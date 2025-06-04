import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKatakana } from '../context/KatakanaContext';
import CharacterCard from '../components/CharacterCard';
import { CheckCircle, X } from 'lucide-react';

const Practice: React.FC = () => {
  const { characters, markAsLearned, progress } = useKatakana();
  const [practiceMode, setPracticeMode] = useState<'recognition' | 'romaji'>('recognition');
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [options, setOptions] = useState<Array<{ character: string; romaji: string }>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showNextButton, setShowNextButton] = useState(false);

  // Function to generate a new question
  const generateQuestion = () => {
    // Filter characters to prioritize those not mastered yet
    const notMasteredChars = characters.filter(char => !char.mastered);
    const availableChars = notMasteredChars.length > 5 ? notMasteredChars : characters;
    
    // Select a random character for the question
    const questionIndex = Math.floor(Math.random() * availableChars.length);
    const questionChar = availableChars[questionIndex];
    
    // Generate wrong options
    let wrongOptions = [...availableChars];
    wrongOptions.splice(questionIndex, 1);
    wrongOptions = shuffleArray(wrongOptions).slice(0, 3);
    
    // Combine correct and wrong options and shuffle
    const allOptions = shuffleArray([questionChar, ...wrongOptions]);
    
    setCurrentQuestion(characters.findIndex(c => c.character === questionChar.character));
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowNextButton(false);
  };
  
  // Initialize the first question
  useEffect(() => {
    generateQuestion();
  }, [practiceMode]);
  
  // Handle user answer selection
  const handleAnswerSelect = (answer: string) => {
    if (showNextButton) return; // Prevent selecting after answer is revealed
    
    const correctAnswer = practiceMode === 'recognition' 
      ? characters[currentQuestion!].romaji 
      : characters[currentQuestion!].character;
    
    const isAnswerCorrect = answer === correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(isAnswerCorrect);
    setScore(prev => ({
      correct: isAnswerCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
    
    if (isAnswerCorrect) {
      markAsLearned(currentQuestion!);
    }
    
    setShowNextButton(true);
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    generateQuestion();
  };
  
  // Switch practice mode
  const togglePracticeMode = () => {
    setPracticeMode(prev => prev === 'recognition' ? 'romaji' : 'recognition');
  };

  if (currentQuestion === null) return <div>Loading...</div>;

  const currentChar = characters[currentQuestion];
  const questionPrompt = practiceMode === 'recognition' 
    ? 'What is the pronunciation of this character?' 
    : 'Which character represents this sound?';
  const questionDisplay = practiceMode === 'recognition' 
    ? currentChar.character 
    : currentChar.romaji;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Practice Katakana
        </h1>
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-gray-700">
              Score: <span className="font-semibold">{score.correct}</span> / {score.total}
            </p>
          </div>
          <button
            onClick={togglePracticeMode}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors font-medium"
          >
            {practiceMode === 'recognition' ? 'Switch to Romaji to Character' : 'Switch to Character to Romaji'}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {questionPrompt}
          </h2>
          
          <div className="flex justify-center mb-8">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {practiceMode === 'recognition' ? (
                <div className="text-8xl font-bold mb-4">{questionDisplay}</div>
              ) : (
                <div className="text-4xl font-bold mb-4">{questionDisplay}</div>
              )}
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(
                  practiceMode === 'recognition' ? option.romaji : option.character
                )}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswer === (practiceMode === 'recognition' ? option.romaji : option.character)
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-medium">
                    {practiceMode === 'recognition' ? option.romaji : option.character}
                  </span>
                  
                  {selectedAnswer === (practiceMode === 'recognition' ? option.romaji : option.character) && (
                    isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <X className="h-6 w-6 text-red-600" />
                    )
                  )}
                </div>
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {showNextButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 flex justify-center"
              >
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  Next Question
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Practice Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Focus on the shape and distinctive features of each character</li>
            <li>Practice regularly for better retention</li>
            <li>If you're struggling with a character, review it in the Learn section</li>
            <li>Once you feel confident, take a quiz to test your mastery</li>
          </ul>
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

export default Practice;