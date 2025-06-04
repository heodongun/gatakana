import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import Footer from './components/Footer';
import { KatakanaProvider } from './context/KatakanaContext';

function App() {
  return (
    <KatakanaProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/quiz" element={<Quiz />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </KatakanaProvider>
  );
}

export default App;