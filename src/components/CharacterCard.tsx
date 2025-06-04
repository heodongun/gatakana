import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CharacterCardProps {
  character: string;
  romaji: string;
  showRomaji?: boolean;
  onClick?: () => void;
  isLearned?: boolean;
  isMastered?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  romaji,
  showRomaji = true,
  onClick,
  isLearned = false,
  isMastered = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!showRomaji) {
      setIsFlipped(!isFlipped);
    }
    if (onClick) {
      onClick();
    }
  };

  let statusClass = '';
  if (isMastered) {
    statusClass = 'border-green-500 bg-green-50';
  } else if (isLearned) {
    statusClass = 'border-yellow-500 bg-yellow-50';
  }

  return (
    <motion.div
      className={`relative w-full h-56 md:w-64 md:h-64 cursor-pointer rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg ${statusClass}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side - Character */}
        <div
          className={`absolute w-full h-full flex items-center justify-center ${
            isFlipped ? 'backface-hidden' : ''
          }`}
        >
          <div className="text-center">
            <p className="text-8xl font-bold mb-4">{character}</p>
            {showRomaji && (
              <p className="text-xl text-gray-600">{romaji}</p>
            )}
          </div>
        </div>

        {/* Back side - Romaji */}
        {!showRomaji && (
          <div
            className="absolute w-full h-full flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <p className="text-4xl font-semibold text-indigo-600">{romaji}</p>
          </div>
        )}
      </motion.div>
      
      {/* Status indicators */}
      {(isLearned || isMastered) && (
        <div className="absolute top-2 right-2">
          <div 
            className={`rounded-full h-4 w-4 ${
              isMastered ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CharacterCard;