import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, CheckCircle } from 'lucide-react';
import { useKatakana } from '../context/KatakanaContext';
import CharacterCard from '../components/CharacterCard';
import ProgressBar from '../components/ProgressBar';

const Learn: React.FC = () => {
  const { 
    characters, 
    currentCharacterIndex, 
    setCurrentCharacterIndex,
    markAsLearned,
    markAsMastered,
    progress
  } = useKatakana();

  const [showHint, setShowHint] = useState(false);

  const currentChar = characters[currentCharacterIndex];

  const goToPrevious = () => {
    setCurrentCharacterIndex(
      (prev) => (prev - 1 + characters.length) % characters.length
    );
    setShowHint(false);
  };

  const goToNext = () => {
    setCurrentCharacterIndex((prev) => (prev + 1) % characters.length);
    setShowHint(false);
  };

  const handleLearned = () => {
    markAsLearned(currentCharacterIndex);
  };

  const handleMastered = () => {
    markAsMastered(currentCharacterIndex);
    goToNext();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Learn Katakana
        </h1>
        
        <div className="mb-6">
          <ProgressBar 
            value={progress.mastered} 
            max={progress.total} 
            label="Mastery Progress" 
            color="green"
          />
        </div>
        
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-full max-w-md">
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-indigo-50 transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6 text-indigo-600" />
            </button>
            
            <div className="flex justify-center mb-4">
              <CharacterCard
                character={currentChar.character}
                romaji={currentChar.romaji}
                isLearned={currentChar.learned}
                isMastered={currentChar.mastered}
              />
            </div>
            
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-indigo-50 transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6 text-indigo-600" />
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xl font-medium text-gray-900">
              Character {currentCharacterIndex + 1} of {characters.length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pronunciation Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Romaji</h3>
              <p className="text-3xl text-indigo-600 font-semibold">{currentChar.romaji}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Sound Tips</h3>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                {showHint ? "Hide pronunciation hint" : "Show pronunciation hint"}
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-indigo-50 rounded-md">
                  <p className="text-gray-700">
                    {getPronunciationHint(currentChar.romaji)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={handleLearned}
            disabled={currentChar.learned}
            className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
              currentChar.learned
                ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                : 'text-white bg-yellow-500 hover:bg-yellow-600'
            } transition duration-150`}
          >
            <Check className="h-5 w-5 mr-2" />
            {currentChar.learned ? "Marked as Learned" : "Mark as Learned"}
          </button>
          
          <button
            onClick={handleMastered}
            disabled={currentChar.mastered}
            className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
              currentChar.mastered
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'text-white bg-green-600 hover:bg-green-700'
            } transition duration-150`}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {currentChar.mastered ? "Mastered!" : "Mark as Mastered"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function for pronunciation hints
function getPronunciationHint(romaji: string): string {
  const hints: Record<string, string> = {
    'a': 'Pronounced like "ah" as in "father"',
    'i': 'Pronounced like "ee" as in "feet"',
    'u': 'Pronounced like "oo" as in "food" but shorter',
    'e': 'Pronounced like "eh" as in "bed"',
    'o': 'Pronounced like "oh" as in "go"',
    'ka': 'Pronounced like "kah"',
    'ki': 'Pronounced like "key"',
    'ku': 'Pronounced like "koo"',
    'ke': 'Pronounced like "keh"',
    'ko': 'Pronounced like "koh"',
    'sa': 'Pronounced like "sah"',
    'shi': 'Pronounced like "she"',
    'su': 'Pronounced like "sue"',
    'se': 'Pronounced like "seh"',
    'so': 'Pronounced like "soh"',
    'ta': 'Pronounced like "tah"',
    'chi': 'Pronounced like "chee"',
    'tsu': 'Pronounced like "tsoo"',
    'te': 'Pronounced like "teh"',
    'to': 'Pronounced like "toe"',
    // Add more as needed
  };
  
  return hints[romaji] || `Pronounced as "${romaji}"`;
}

export default Learn;