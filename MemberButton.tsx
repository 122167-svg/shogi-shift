import React from 'react';
import { type AttendanceStatus } from './types';

interface MemberButtonProps {
  name: string;
  status: AttendanceStatus;
  onClick: (name: string) => void;
}

const MemberButton: React.FC<MemberButtonProps> = ({ name, status, onClick }) => {
  const isPresent = status === 'present';
  const baseClasses = "w-full h-full flex items-center justify-center p-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:scale-95";
  
  const statusClasses = isPresent
    ? "bg-green-600 hover:bg-green-500 text-white focus:ring-green-400"
    : "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-sky-400";

  return (
    <button
      type="button"
      className={`${baseClasses} ${statusClasses}`}
      onClick={() => onClick(name)}
      aria-pressed={isPresent}
    >
      <div className="flex flex-col items-center">
        <div 
          className={`w-3 h-3 rounded-full mb-2 transition-colors duration-300 ${isPresent ? 'bg-green-300' : 'bg-slate-500'}`}
          aria-hidden="true"
        ></div>
        <span className="font-semibold text-3xl leading-tight text-center">{name}</span>
      </div>
    </button>
  );
};

export default MemberButton;