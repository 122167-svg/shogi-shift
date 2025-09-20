import React, { useMemo } from 'react';
import { type ShiftDay } from './types';
import KanaKeyboard from './KanaKeyboard';

interface DashboardProps {
  presentCount: number;
  totalCount: number;
  onFilterChange: (initial: string | null) => void;
  activeFilter: string | null;
  onAdminClick: () => void;
  schedule: ShiftDay[];
  currentTime: Date;
}

const CurrentShiftDisplay: React.FC<{ schedule: ShiftDay[], currentTime: Date }> = ({ schedule, currentTime }) => {
  const currentShiftInfo = useMemo(() => {
    const y = currentTime.getFullYear();
    const m = String(currentTime.getMonth() + 1).padStart(2, '0');
    const d = String(currentTime.getDate()).padStart(2, '0');
    const todayDateString = `${y}-${m}-${d}`;

    const todaySchedule = schedule.find(day => day.date === todayDateString);

    if (!todaySchedule) {
      return {
        isFestivalDay: false,
        shift: null,
        dayLabel: ''
      };
    }
    
    const dayLabel = schedule.indexOf(todaySchedule) === 0 ? "1日目" : "2日目";
    const currentHour = currentTime.getHours();
    const currentShift = todaySchedule.shifts.find(shift => currentHour >= shift.startHour && currentHour < shift.endHour);
    
    return {
        isFestivalDay: true,
        shift: currentShift,
        dayLabel
    };
  }, [schedule, currentTime]);

  return (
    <div className="text-center md:text-left mt-6 md:mt-0 md:ml-6 flex-grow">
      <h3 className="text-xl font-bold text-sky-400 tracking-wider uppercase">現在のシフト {currentShiftInfo.isFestivalDay && `(${currentShiftInfo.dayLabel})`}</h3>
      {currentShiftInfo.isFestivalDay ? (
        currentShiftInfo.shift ? (
          <>
            <p className="text-3xl text-slate-200 font-semibold">{currentShiftInfo.shift.time}</p>
            <p className="text-2xl text-slate-300" title={currentShiftInfo.shift.members.join('、 ')}>
              {currentShiftInfo.shift.members.join('、 ')}
            </p>
          </>
        ) : (
          <p className="text-2xl text-slate-400">現在シフト時間外です</p>
        )
      ) : (
        <p className="text-2xl text-slate-400">本日は文化祭の開催日ではありません</p>
      )}
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ presentCount, totalCount, onFilterChange, activeFilter, onAdminClick, schedule, currentTime }) => {
  return (
    <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700/50">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="flex items-baseline space-x-2 text-slate-200 justify-center md:justify-start">
          <span className="text-4xl font-bold">出席状況:</span>
          <span className="text-6xl font-bold text-green-400">{presentCount}</span>
          <span className="text-4xl">/ {totalCount} 名</span>
        </div>
         <CurrentShiftDisplay schedule={schedule} currentTime={currentTime} />
        <div className="flex items-center justify-center gap-4 mt-6 md:mt-0">
          <button
            onClick={onAdminClick}
            className="w-full sm:w-auto px-6 py-4 font-semibold text-xl text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            管理者モード
          </button>
        </div>
      </div>
       <p className="my-4 text-center text-slate-400 text-lg">シフト時間外であろうとなかろうとアプリで出欠をつけてください。</p>
      <KanaKeyboard onSelect={onFilterChange} activeInitial={activeFilter} />
    </div>
  );
};

export default Dashboard;