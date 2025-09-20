import React, { useMemo } from 'react';
import { MEMBER_READINGS } from '../constants';

interface KanaKeyboardProps {
  onSelect: (initial: string | null) => void;
  activeInitial: string | null;
}

const GOJUON_ORDER = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";

const KanaKeyboard: React.FC<KanaKeyboardProps> = ({ onSelect, activeInitial }) => {
  const availableInitials = useMemo(() => {
    const initials = new Set<string>();
    Object.values(MEMBER_READINGS).forEach(reading => {
      if (reading) {
        initials.add(reading[0]);
      }
    });
    return Array.from(initials).sort((a, b) => GOJUON_ORDER.indexOf(a) - GOJUON_ORDER.indexOf(b));
  }, []);

  const baseClasses = "flex-grow px-2 py-2.5 text-xl text-center font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800";
  const inactiveClasses = "bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-sky-400";
  const activeClasses = "bg-sky-500 text-white focus:ring-sky-300";

  return (
    <div className="mt-4 pt-4 border-t border-slate-700/50">
      <p className="block mb-3 text-lg font-medium text-slate-300">
        頭文字を選択することで、検索できます
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`${baseClasses} ${!activeInitial ? activeClasses.replace('sky', 'green') : inactiveClasses}`}
        >
          すべて
        </button>
        {availableInitials.map(initial => (
          <button
            key={initial}
            onClick={() => onSelect(initial)}
            className={`${baseClasses} ${activeInitial === initial ? activeClasses : inactiveClasses}`}
          >
            {initial}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KanaKeyboard;