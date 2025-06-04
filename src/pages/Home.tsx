import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Pencil, CheckCircle, BarChart2 } from 'lucide-react';
import { useKatakana } from '../context/KatakanaContext';
import ProgressBar from '../components/ProgressBar';

const Home: React.FC = () => {
  const { progress, resetProgress } = useKatakana();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            カタカナマスター
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Master katakana through interactive learning and practice
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/learn"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
            >
              Start Learning
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition duration-150"
            >
              Practice Now
            </Link>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Progress</h2>
          <div className="space-y-4">
            <ProgressBar
              value={progress.learned}
              max={progress.total}
              label="Characters Learned"
              color="yellow"
            />
            <ProgressBar
              value={progress.mastered}
              max={progress.total}
              label="Characters Mastered"
              color="green"
            />
          </div>
          {(progress.learned > 0 || progress.mastered > 0) && (
            <div className="mt-6 text-right">
              <button
                onClick={resetProgress}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Reset Progress
              </button>
            </div>
          )}
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-start">
              <BookOpen className="h-8 w-8 text-indigo-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn</h3>
                <p className="text-gray-600">
                  Study each katakana character with pronunciation guides and mnemonic aids
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-pink-500">
            <div className="flex items-start">
              <Pencil className="h-8 w-8 text-pink-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice</h3>
                <p className="text-gray-600">
                  Interactive exercises to reinforce your katakana recognition skills
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-start">
              <CheckCircle className="h-8 w-8 text-yellow-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz</h3>
                <p className="text-gray-600">
                  Test your knowledge with various quiz formats to solidify your learning
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-start">
              <BarChart2 className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">
                  Monitor your progress and focus on characters that need more practice
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Getting Started */}
        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Start in the <strong>Learn</strong> section to familiarize yourself with each katakana character</li>
            <li>Use the <strong>Practice</strong> mode to reinforce your recognition through interactive exercises</li>
            <li>Test your knowledge in the <strong>Quiz</strong> section to identify areas needing improvement</li>
            <li>Review your progress and focus on challenging characters</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;