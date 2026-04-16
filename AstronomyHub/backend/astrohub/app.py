from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from typing import List, Optional
import uvicorn

app = FastAPI(title="Astronomy Hub AI Service")

# Cache models
models = {}

def load_all_models():
    print("Attempting to load Cosmic AI Models...")
    try:
        models["summarizer"] = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        models["classifier"] = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-3")
        models["chat"] = pipeline("text2text-generation", model="google/flan-t5-small")
        print("All models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")

def get_models():
    if not models:
        load_all_models()
    return models.get("summarizer"), models.get("classifier"), models.get("chat")

# Eager load on start
load_all_models()

# TF-IDF keyword extractor
def extract_keywords_tfidf(text, top_n=8, ngram_range=(1,2)):
    try:
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=ngram_range)
        X = vectorizer.fit_transform([text])
        feature_names = np.array(vectorizer.get_feature_names_out())
        scores = X.toarray()[0]
        top_indices = scores.argsort()[::-1][:top_n]
        return [feature_names[i] for i in top_indices if scores[i] > 0]
    except Exception as e:
        print(f"Keyword extraction error: {e}")
        return []

class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    summary: str
    keywords: List[str]
    classification: dict

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_article(request: AnalysisRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    summarizer, classifier, _ = get_models()
    
    # Summary
    summary_result = summarizer(request.text, max_length=200, min_length=50, do_sample=False)
    summary = summary_result[0]['summary_text']
    
    # Keywords
    keywords = extract_keywords_tfidf(request.text)
    
    # Classification
    candidate_labels = ["Exoplanets", "Galaxies", "Stars and Nebulae", "Space Missions", "Astronomy General"]
    classification_result = classifier(request.text, candidate_labels)
    classification = dict(zip(classification_result['labels'], classification_result['scores']))
    
    return {
        "summary": summary,
        "keywords": keywords,
        "classification": classification
    }

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    _, _, chatbot = get_models()
    
    # Expanded grounding for even better accuracy
    grounding = {
        "neutron star": "A neutron star is the incredibly dense collapsed core of a massive star that remains after a supernova explosion. They are about 20 km in diameter but have a mass about 1.4 times that of our Sun.",
        "solar system": "Our solar system consists of the Sun and everything bound to it by gravity—the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets like Pluto; and millions of asteroids and comets.",
        "planets": "There are eight major planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
        "sun": "The Sun is a G-type main-sequence star (yellow dwarf) at the center of our solar system, making up 99.8% of its total mass.",
        "milky way": "The Milky Way is a barred spiral galaxy that contains our Solar System. it is estimated to contain 100–400 billion stars and at least that many planets.",
        "black hole": "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it.",
        "galaxy": "A galaxy is a massive system of stars, stellar remnants, interstellar gas, dust, and dark matter, all bound together by gravity.",
        "nasa": "NASA (National Aeronautics and Space Administration) is the U.S. government agency responsible for the civilian space program, as well as aeronautics and space research."
    }

    # Simplified, direct prompt
    prompt = f"Summarize this astronomy concept: {request.message}"
    print(f"Chat Prompt: {prompt}")
    
    # Deterministic decoding for absolute factual consistency
    response = chatbot(
        prompt, 
        max_new_tokens=150,
        do_sample=False, # Disable randomness for factual reliability
        num_beams=5,
        no_repeat_ngram_size=3,
        early_stopping=True,
        num_return_sequences=1
    )
    
    reply = response[0]['generated_text'].strip()
    
    # Check for keywords to inject grounding if the response is too short or weird
    msg_lower = request.message.lower()
    found_grounding = None
    for kw, fact in grounding.items():
        if kw in msg_lower:
            found_grounding = fact
            break

    # If the reply is short or repetitive, use grounding
    if len(reply) < 20 and found_grounding:
        reply = found_grounding
    elif not reply:
        reply = "That is a fascinating celestial topic! While I am still learning the vast depths of space, that specific phenomenon is a key part of our astronomical history."
        
    print(f"AI Reply: {reply}")
    return {"reply": reply}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
