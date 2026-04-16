import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../services/api';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Greetings, explorer! I am your Cosmic AI assistant. How can I help you navigate the mysteries of the universe today?", 
      sender: 'ai', 
      time: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickActions = [
    { label: "Black Holes", icon: "🌌" },
    { label: "Next NASA Mission", icon: "🚀" },
    { label: "Exoplanets", icon: "🪐" },
    { label: "James Webb", icon: "🔭" }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    const messageToSend = text || inputText;
    if (!messageToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageToSend,
      sender: 'user',
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!text) setInputText('');
    setIsTyping(true);

    try {
      const response = await chatWithAI(messageToSend);
      const aiMessage = {
        id: Date.now() + 1,
        text: response.reply || "Connection to stellar database interrupted.",
        sender: 'ai',
        time: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Signal lost in hyperspace. Please ensure your servers are operational.",
        sender: 'ai',
        time: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ 
      id: Date.now(), 
      text: "Chat cleared. I'm ready for your next cosmic inquiry!", 
      sender: 'ai', 
      time: new Date() 
    }]);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 bg-black/40 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="max-w-4xl mx-auto h-[85vh] flex flex-col relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-xl shadow-lg ring-2 ring-white/20">
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">AI Chatbot</h2>
              <div className="flex items-center gap-1.5">
              </div>
            </div>
          </div>
          <button 
            onClick={handleClearChat}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
          >
            <i className="fas fa-trash-alt"></i>
            Clear Session
          </button>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden group">
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide">
            {messages.length === 1 && (
              <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                <div className="text-6xl animate-float">🛸</div>
                <p className="text-sm font-medium">Ready for departure...</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm shrink-0 self-end">
                    ✨
                  </div>
                )}
                
                <div className={`max-w-[75%] group/msg relative`}>
                  <div className={`p-4 md:p-5 rounded-3xl shadow-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-sm' 
                      : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-sm backdrop-blur-sm'
                  }`}>
                    <p className="text-sm md:text-base leading-relaxed font-normal">{msg.text}</p>
                    <div className={`flex items-center gap-2 mt-2 opacity-50 text-[10px] ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.sender === 'user' && <i className="fas fa-check-double text-[8px] text-blue-300"></i>}
                    </div>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm shrink-0 self-end">
                  </div>
                )}
              </motion.div>
            ))}
            
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs animate-pulse">
                    🛰️
                  </div>
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl rounded-tl-sm flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400/80 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-400/80 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400/80 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Bottom Bar */}
          <div className="p-4 md:p-6 bg-white/5 border-t border-white/10">
            {/* Quick Actions */}
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage(action.label)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300 whitespace-nowrap hover:bg-white/10 hover:border-blue-500/50 transition-all"
                >
                  <span>{action.icon}</span>
                  {action.label}
                </motion.button>
              ))}
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
              className="flex gap-3 relative"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] pr-12"
                  placeholder="Scan the heavens for answers..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isTyping}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <i className="far fa-smile text-lg"></i>
                </button>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-30 text-white w-14 h-14 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-90 flex items-center justify-center shrink-0 border border-white/10"
                disabled={isTyping || !inputText.trim()}
              >
                <i className="fas fa-paper-plane text-lg translate-x-[-1px] translate-y-[-1px]"></i>
              </button>
            </form>
            <p className="mt-4 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-40">Powered by Gemini Orbital Engine 2.5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
