import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full m-4 border border-slate-700 flex flex-col text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-4xl font-bold text-sky-300">{title}</h2>
        </div>

        <div className="p-8 text-slate-200 text-2xl">
          {children}
        </div>

        <div className="p-4 bg-slate-900/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 font-semibold text-xl text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;