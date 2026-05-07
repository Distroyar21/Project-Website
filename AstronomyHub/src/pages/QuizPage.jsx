import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchSuggestions } from '../services/api';

const QuizPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [isStarted, setIsStarted] = useState(false);
  const [hasExploredEnough, setHasExploredEnough] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExplorationStatus = async () => {
      if (user) {
        const data = await fetchSuggestions();
        if (data.suggestions && data.suggestions.length > 0) {
          setHasExploredEnough(true);
        }
      }
      setIsLoading(false);
    };
    checkExplorationStatus();
  }, []);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/5 p-12 rounded-3xl border border-white/10 max-w-2xl w-full backdrop-blur-md"
        >
          <div className="mb-6 flex justify-center">
            <svg className="w-20 h-20 text-blue-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold header-title mb-4">Quiz Locked</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Log in and explore our AstroHub to unlock the quiz
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-white shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all"
          >
            Log In Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold header-title mb-4">Cosmic Quiz</h1>
        <p className="text-gray-400">Test your knowledge based on your explorations.</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !hasExploredEnough ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 rounded-3xl p-12 border border-dashed border-white/10 shadow-2xl backdrop-blur-sm max-w-3xl mx-auto text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Not Enough Data Yet</h3>
          <p className="text-gray-400 mb-8 text-lg">
            We generate personalized quizzes based on your interests. Right now, we don't have enough data to create a custom challenge for you!
          </p>
          <button 
            onClick={() => navigate('/news')}
            className="px-8 py-3 bg-blue-500/20 text-blue-400 rounded-full font-bold border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
          >
            Explore News & Analyze
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-sm max-w-3xl mx-auto"
        >
          {!isStarted ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready for a Challenge, {user.username}?</h3>
            <p className="text-gray-400 mb-8">We've generated a custom quiz based on your recent activity.</p>
            <button 
              onClick={() => setIsStarted(true)}
              className="px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Quiz in Progress...</h3>
            <p className="text-gray-400 mb-8">The dynamic AI questions will appear here.</p>
            {/* Future placeholder for questions */}
            <div className="flex flex-col gap-4 max-w-md mx-auto mb-8">
              <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left text-gray-300">Option A</button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left text-gray-300">Option B</button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left text-gray-300">Option C</button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left text-gray-300">Option D</button>
            </div>
            <button 
              onClick={() => setIsStarted(false)}
              className="text-gray-500 hover:text-white transition-colors text-sm underline"
            >
              Cancel Quiz
            </button>
          </div>
        )}
        </motion.div>
      )}
    </div>
  );
};

export default QuizPage;
