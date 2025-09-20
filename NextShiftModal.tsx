import React, { useMemo } from 'react';
import { type ShiftDay } from '../types';

interface NextShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  schedule: ShiftDay[];
  currentTime: Date;
}

const NextShiftModal: React.FC<NextShiftModalProps> = ({ isOpen, onClose, onConfirm, memberName, schedule, currentTime }) => {
  const upcomingShifts = useMemo(() => {
    const y = currentTime.getFullYear();
    const m = String(currentTime.getMonth() + 1).padStart(2, '0');
    const d = String(currentTime.getDate()).padStart(2, '0');
    const todayDateString = `${y}-${m}-${d}`;

    const todaySchedule = schedule.find(day => day.date === todayDateString);
    if (!todaySchedule) return [];

    const currentHour = currentTime.getHours();
    
    // Find all shifts that haven't ended yet
    const relevantShifts = todaySchedule.shifts.filter(shift => shift.endHour > currentTime.getHours() && shift.members.includes(memberName));
    
    return relevantShifts;

  }, [schedule, currentTime, memberName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full m-4 border border-slate-700 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-3xl font-bold text-yellow-300">退勤前の確認</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 text-slate-200">
          <p className="text-2xl"><span className="font-bold">{memberName}</span> さん、お疲れ様です。</p>
          
          {upcomingShifts.length > 0 ? (
            <div>
              <p className="text-xl">本日、以下のシフトがまだ残っています。</p>
              <ul className="mt-2 list-disc list-inside bg-slate-700/50 p-3 rounded-md">
                {upcomingShifts.map(shift => (
                  <li key={shift.time} className="font-semibold text-xl">{shift.time}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xl">本日のあなたのシフトはこれで終了です。お疲れ様でした！</p>
          )}

          <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-lg">
            <p className="font-bold">※もし急遽シフトに来れなくなった場合は、必ず部長まで連絡してください。</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-b-xl text-right">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3 font-bold text-2xl text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors duration-300"
          >
            確認しました (退勤する)
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextShiftModal;