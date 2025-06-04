import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} カタカナマスター. All rights reserved.
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-500 text-sm flex items-center">
              Made with <Heart className="h-4 w-4 text-pink-500 mx-1" /> for Japanese language learners
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;