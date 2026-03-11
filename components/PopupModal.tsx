
import React from 'react';

interface PopupModalProps {
  name: string;
  question: string;
  onClose: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({ name, question, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all scale-100">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Chúc mừng {name}!</h2>
        <p className="text-lg text-gray-700 mb-6">{question}</p>
        <button
          onClick={onClose}
          className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default PopupModal;
