import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { katakanaData } from '../data/katakanaData';

type KatakanaCharacter = {
  character: string;
  romaji: string;
  audioUrl?: string;
  learned: boolean;
  mastered: boolean;
  lastPracticed: Date | null;
};

type KatakanaContextType = {
  characters: KatakanaCharacter[];
  currentCharacterIndex: number;
  setCurrentCharacterIndex: (index: number) => void;
  markAsLearned: (index: number) => void;
  markAsMastered: (index: number) => void;
  resetProgress: () => void;
  progress: {
    learned: number;
    mastered: number;
    total: number;
  };
};

const KatakanaContext = createContext<KatakanaContextType | undefined>(undefined);

export const useKatakana = () => {
  const context = useContext(KatakanaContext);
  if (!context) {
    throw new Error('useKatakana must be used within a KatakanaProvider');
  }
  return context;
};

type KatakanaProviderProps = {
  children: ReactNode;
};

export const KatakanaProvider = ({ children }: KatakanaProviderProps) => {
  const [characters, setCharacters] = useState<KatakanaCharacter[]>(() => {
    const savedCharacters = localStorage.getItem('katakanaCharacters');
    if (savedCharacters) {
      const parsed = JSON.parse(savedCharacters);
      return parsed.map((char: any) => ({
        ...char,
        lastPracticed: char.lastPracticed ? new Date(char.lastPracticed) : null,
      }));
    }
    return katakanaData.map((char) => ({
      ...char,
      learned: false,
      mastered: false,
      lastPracticed: null,
    }));
  });

  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  
  useEffect(() => {
    localStorage.setItem('katakanaCharacters', JSON.stringify(characters));
  }, [characters]);

  const markAsLearned = (index: number) => {
    setCharacters((prev) => 
      prev.map((char, i) => 
        i === index 
          ? { ...char, learned: true, lastPracticed: new Date() } 
          : char
      )
    );
  };

  const markAsMastered = (index: number) => {
    setCharacters((prev) => 
      prev.map((char, i) => 
        i === index 
          ? { ...char, learned: true, mastered: true, lastPracticed: new Date() } 
          : char
      )
    );
  };

  const resetProgress = () => {
    setCharacters(katakanaData.map((char) => ({
      ...char,
      learned: false,
      mastered: false,
      lastPracticed: null,
    })));
  };

  const progress = {
    learned: characters.filter((char) => char.learned).length,
    mastered: characters.filter((char) => char.mastered).length,
    total: characters.length,
  };

  return (
    <KatakanaContext.Provider
      value={{
        characters,
        currentCharacterIndex,
        setCurrentCharacterIndex,
        markAsLearned,
        markAsMastered,
        resetProgress,
        progress,
      }}
    >
      {children}
    </KatakanaContext.Provider>
  );
};