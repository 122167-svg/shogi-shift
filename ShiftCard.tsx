import React from 'react';
import type { Shift } from '../types.ts';

interface ShiftCardProps {
  shift: Shift;
}

const EventIcon: React.FC<{ event: string }> = ({ event }) => {
  const isShogi = event === '将棋サロン';
  return (
    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${isShogi ? 'bg-green-100' : 'bg-yellow-100'}`}>
      {isShogi ? (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 6v12l8 4 8-4V6L12 2z" />
            <path d="M8 9l4 4 4-4" />
         </svg>
      ) : (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12.38c0-3.53 2.87-6.4 6.4-6.4h7.2c3.53 0 6.4 2.87 6.4 6.4v0c0 3.53-2.87 6.4-6.4 6.4h-7.2C4.87 18.78 2 15.91 2 12.38v0z"/>
            <path d="M12 18.78V5.98"/>
            <path d="M19.2 12.38H4.8"/>
         </svg>
      )}
    </div>
  );
};

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const isShogi = shift.event === '将棋サロン';
  
  return (
    <div className="bg-white rounded-lg p-3 flex items-center space-x-4 border border-slate-200 hover:shadow-lg hover:border-indigo-400 transition-all duration-200 ease-in-out transform hover:-translate-y-1">
      <EventIcon event={shift.event} />
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <p className={`font-bold text-lg ${isShogi ? 'text-green-800' : 'text-yellow-900'}`}>{shift.event}</p>
          {shift.role && (
            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
              {shift.role}
            </span>
          )}
        </div>
        <div className="text-slate-600 mt-1 flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono tracking-wider">{shift.time}</span>
        </div>
      </div>
    </div>
  );
};

export default ShiftCard;
