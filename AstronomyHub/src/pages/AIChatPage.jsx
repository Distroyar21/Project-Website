import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../services/api';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your Cosmic AI assistant. I have access to the latest astronomical data. How can I help you explore the universe today?", sender: 'ai', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await chatWithAI(inputText);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.reply || "I'm sorry, I received an empty response from the cosmos.",
        sender: 'ai',
        time: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Connection lost in hyperspace. Please ensure the servers are running.",
        sender: 'ai',
        time: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 h-[100vh] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Cosmic AI Online</span>
        </div>
        <h1 className="text-4xl font-bold header-title mb-3">Cosmic AI Assistant</h1>
        <p className="text-gray-400">Your portal to interstellar knowledge, enhanced with the latest AI technology.</p>
        <h3 className='text-gray-400 text-sm'>(Our chatbot is in early stages, so it may not be able to answer all the questions, future updates soon...)</h3>
      </motion.div>

      <div className="flex-1 overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-hide">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-5 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-gray-200 border border-white/10 rounded-tl-none'
              } shadow-lg`}>
                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 border border-white/10 p-8 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-6 bg-white/5 border-t border-white/10 flex gap-4">
          <input
            type="text"
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-500 transition-colors shadow-inner"
            placeholder="Ask about black holes, galaxies, NASA missions..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
            disabled={isTyping || !inputText.trim()}
          >
            <span>Send</span>
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatPage;
