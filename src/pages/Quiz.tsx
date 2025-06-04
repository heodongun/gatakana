import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKatakana } from '../context/KatakanaContext';
import { CheckCircle, X, Check, RefreshCw } from 'lucide-react';

const Quiz: React.FC = () => {
  const { characters, markAsMastered } = useKatakana();
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizType, setQuizType] = useState<'recognition' | 'writing'>('recognition');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Generate quiz questions
  const generateQuiz = (type: 'recognition' | 'writing') => {
    // Prioritize characters that aren't mastered yet
    const notMasteredIndices = characters
      .map((char, index) => ({ char, index }))
      .filter(item => !item.char.mastered)
      .map(item => item.index);
    
    // If not enough non-mastered characters, include some random ones
    let questionIndices = [...notMasteredIndices];
    if (questionIndices.length < 10) {
      const remainingIndices = characters
        .map((_, index) => index)
        .filter(index => !questionIndices.includes(index));
      
      const additionalIndices = shuffleArray(remainingIndices)
        .slice(0, 10 - questionIndices.length);
      
      questionIndices = [...questionIndices, ...additionalIndices];
    }
    
    // Limit to 10 questions and shuffle
    setQuizQuestions(shuffleArray(questionIndices).slice(0, 10));
    setQuizType(type);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setQuizCompleted(false);
    setQuizStarted(true);
  };
  
  // Handle user answer submission
  const handleSubmitAnswer = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = quizType === 'recognition'
      ? characters[currentQuestion].romaji
      : characters[currentQuestion].character;
    
    const isAnswerCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setQuizResults([...quizResults, isAnswerCorrect]);
    
    // If answer is correct, mark the character as mastered
    if (isAnswerCorrect) {
      markAsMastered(currentQuestion);
    }
  };
  
  // Move to next question or finish quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Restart the quiz
  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setUserAnswer('');
    setShowResult(false);
    setQuizCompleted(false);
  };
  
  // Calculate quiz score
  const calculateScore = () => {
    const correctAnswers = quizResults.filter(result => result).length;
    return {
      score: correctAnswers,
      total: quizResults.length,
      percentage: Math.round((correctAnswers / quizResults.length) * 100),
    };
  };
  
  // Show quiz type selection screen
  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Test Your Katakana Knowledge
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Choose Quiz Type
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => generateQuiz('recognition')}
                className="p-6 bg-indigo-50 hover:bg-indigo-100 rounded-lg border-2 border-indigo-200 hover:border-indigo-300 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Character Recognition</h3>
                <p className="text-gray-700">
                  You'll be shown katakana characters and asked to type their romaji pronunciation
                </p>
              </button>
              
              <button
                onClick={() => generateQuiz('writing')}
                className="p-6 bg-pink-50 hover:bg-pink-100 rounded-lg border-2 border-pink-200 hover:border-pink-300 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Character Writing</h3>
                <p className="text-gray-700">
                  You'll be given romaji pronunciations and asked to type the corresponding katakana character
                </p>
              </button>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Each quiz consists of 10 questions</li>
              <li>Characters you haven't mastered will be prioritized</li>
              <li>Correct answers will mark characters as mastered</li>
              <li>You can retake quizzes as many times as you like</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  // Show quiz completion screen
  if (quizCompleted) {
    const { score, total, percentage } = calculateScore();
    
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Quiz Results
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {percentage >= 80 ? 'Great job!' : percentage >= 60 ? 'Good effort!' : 'Keep practicing!'}
            </h2>
            
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 relative rounded-full flex items-center justify-center border-8 border-indigo-100">
                <div className="text-4xl font-bold text-indigo-600">
                  {percentage}%
                </div>
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E0E7FF"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="8"
                    strokeDasharray={`${percentage * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
            
            <p className="text-center text-lg text-gray-700 mb-6">
              You got <span className="font-semibold">{score}</span> out of <span className="font-semibold">{total}</span> questions correct!
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium flex items-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Main quiz interface
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const questionDisplay = quizType === 'recognition' 
    ? characters[currentQuestion].character 
    : characters[currentQuestion].romaji;
  const questionPrompt = quizType === 'recognition'
    ? 'What is the pronunciation of this character?'
    : 'What is the katakana character for this sound?';
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {quizType === 'recognition' ? 'Character Recognition Quiz' : 'Character Writing Quiz'}
        </h1>
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-gray-700">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </p>
          </div>
          <button
            onClick={handleRestartQuiz}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Exit Quiz
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {questionPrompt}
          </h2>
          
          <div className="flex justify-center mb-8">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {quizType === 'recognition' ? (
                <div className="text-8xl font-bold mb-4">{questionDisplay}</div>
              ) : (
                <div className="text-4xl font-bold mb-4">{questionDisplay}</div>
              )}
            </motion.div>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showResult}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder={`Type your answer here...`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !showResult && userAnswer) {
                    handleSubmitAnswer();
                  }
                }}
              />
            </div>
            
            <AnimatePresence>
              {!showResult ? (
                <motion.button
                  key="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer}
                  className={`w-full px-6 py-3 rounded-md transition-colors font-medium ${
                    userAnswer
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Check Answer
                </motion.button>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div
                    className={`p-4 rounded-md mb-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="flex items-center">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 mr-2" />
                      ) : (
                        <X className="h-5 w-5 mr-2" />
                      )}
                      <span>
                        {isCorrect
                          ? 'Correct!'
                          : `Incorrect. The correct answer is "${
                              quizType === 'recognition'
                                ? characters[currentQuestion].romaji
                                : characters[currentQuestion].character
                            }"`}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                  >
                    {currentQuestionIndex < quizQuestions.length - 1
                      ? 'Next Question'
                      : 'Finish Quiz'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default Quiz;