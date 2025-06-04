import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { useKatakana } from '../context/KatakanaContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { progress } = useKatakana();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">カタカナマスター</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="text-sm font-medium text-gray-500">
              Mastered: {progress.mastered}/{progress.total} characters
            </div>
            <Link to="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition duration-150">
              Home
            </Link>
            <Link to="/learn" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition duration-150">
              Learn
            </Link>
            <Link to="/practice" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition duration-150">
              Practice
            </Link>
            <Link to="/quiz" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition duration-150">
              Quiz
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/learn" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Learn
            </Link>
            <Link 
              to="/practice" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Practice
            </Link>
            <Link 
              to="/quiz" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Quiz
            </Link>
            <div className="px-3 py-2 text-sm font-medium text-gray-500">
              Mastered: {progress.mastered}/{progress.total}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;