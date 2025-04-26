'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaGem, FaHeart, FaLaptopCode, FaQuestion } from 'react-icons/fa';
import { validateStudentNumber, checkCooldown, saveGameResult } from './api'; // Import API functions

const symbols = [
  { icon: <FaStar className="text-yellow-400" />, name: 'Star' },
  { icon: <FaGem className="text-blue-400" />, name: 'Gem' },
  { icon: <FaHeart className="text-red-400" />, name: 'Heart' },
  { icon: <FaLaptopCode className="text-green-400" />, name: 'Code' },
  { icon: <FaQuestion className="text-red-400" />, name: 'Question' },
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const SlotMachine = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [reels, setReels] = useState([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
  const [spinning, setSpinning] = useState(false);
  const [isStudentValidated, setIsStudentValidated] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasWon, setHasWon] = useState(false);

  const handleNameSubmit = async (event) => {
    event.preventDefault();
    try {
      const isValid = await validateStudentNumber(studentNumber);
      console.log('Validation result:', isValid);

      if (isValid) {
        setIsStudentValidated(true);
        setStatusMessage('');
      }
    } catch (error) {
      console.error('Error during validation:', error);
      setStatusMessage(error.message);
    }
  };

  const spin = async () => {
    if (spinning) return;

    setSpinning(true);
    setStatusMessage('Spinning...');
    let newReels = [];

    const interval = setInterval(() => {
      newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(newReels);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);

      const isWin = newReels[0].name === newReels[1].name && newReels[1].name === newReels[2].name;

      if (isWin) {
        setStatusMessage('Congratulations! You win!');
        setHasWon(true);
        saveGameResult(studentNumber, 'Win');
      } else {
        setStatusMessage('Try again?');
        saveGameResult(studentNumber, 'Loss');
      }
    }, 2000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {!isStudentValidated ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold mb-6">Enter Student Number</h1>
          <form onSubmit={handleNameSubmit} className="flex flex-col items-center">
            <input
              type="text"
              value={studentNumber}
              required
              onChange={(e) => setStudentNumber(e.target.value)}
              placeholder="Student Number"
              className="mb-4 p-2 text-black rounded-lg bg-white text-center"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300"
            >
              Validate
            </button>
          </form>
          {statusMessage && <p className="mt-4 text-lg">{statusMessage}</p>}
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-6">Slot Machine</h1>
          <div className="flex space-x-4 bg-gray-700 p-6 rounded-lg shadow-lg border-4 border-yellow-500">
            {reels.map((reel, index) => (
              <motion.div
                key={index}
                className="text-6xl"
                animate={{ rotate: spinning ? 360 : 0 }}
                transition={spinning ? { duration: 2, ease: 'easeInOut' } : { duration: 0 }}
              >
                {reel ? reel.icon : <span className="opacity-50">?</span>}
              </motion.div>
            ))}
          </div>
          <div className="mt-6">
            {hasWon ? (
              <div className="px-6 py-3 bg-green-500 rounded-xl text-lg font-bold">
                You Won!
              </div>
            ) : (
              <button
                onClick={spin}
                disabled={spinning}
                className="px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50"
              >
                {spinning ? 'Spinning...' : 'Spin'}
              </button>
            )}
          </div>
          {statusMessage && <p className="mt-4 text-lg">{statusMessage}</p>}
        </>
      )}
    </div>
  );
};

export default SlotMachine;