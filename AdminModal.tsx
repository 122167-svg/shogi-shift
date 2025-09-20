import React, { useState, useMemo, useEffect } from 'react';
import { type AllMemberWorkStatus, type WorkSession } from '../types';
import { MEMBERS } from '../constants';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  workStatus: AllMemberWorkStatus;
  currentTime: Date;
}

const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 0) milliseconds = 0;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const calculateTotalWorkTime = (sessions: WorkSession[], currentTime: Date): number => {
  return sessions.reduce((total, session) => {
    // If clocked in but not out, calculate duration up to the passed currentTime
    const clockOutTime = session.clockOut ?? currentTime.getTime();
    return total + (clockOutTime - session.clockIn);
  }, 0);
};


const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, workStatus, currentTime }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPassword('');
        setIsAuthenticated(false);
        setError('');
      }, 300); 
    }
  }, [isOpen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hidemura') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('パスワードが正しくありません。');
    }
  };
  
  const workReport = useMemo(() => {
    return MEMBERS.map(name => {
      const status = workStatus[name];
      const totalTime = status ? calculateTotalWorkTime(status.sessions, currentTime) : 0;
      return {
        name,
        totalTime,
        status: status?.status ?? 'absent',
      };
    }).sort((a, b) => b.totalTime - a.totalTime); 
  }, [workStatus, currentTime]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full m-4 border border-slate-700 flex flex-col" style={{maxHeight: '90vh'}}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-3xl font-bold text-indigo-400">管理者モード</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            <label htmlFor="password-input" className="block font-semibold text-slate-200 text-xl">パスワードを入力してください</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-md py-3 px-4 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="text-right">
              <button type="submit" className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 text-xl">
                認証
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 overflow-y-auto">
            <table className="w-full text-left table-auto">
              <thead className="sticky top-0 bg-slate-800">
                <tr>
                  <th className="p-3 border-b-2 border-slate-600 text-slate-300 text-xl">名前</th>
                  <th className="p-3 border-b-2 border-slate-600 text-slate-300 text-xl">総勤務時間</th>
                  <th className="p-3 border-b-2 border-slate-600 text-slate-300 text-xl">現在の状況</th>
                </tr>
              </thead>
              <tbody>
                {workReport.map(report => (
                  <tr key={report.name} className="hover:bg-slate-700/50">
                    <td className="p-3 border-b border-slate-700 font-medium text-slate-100 text-xl">{report.name}</td>
                    <td className="p-3 border-b border-slate-700 font-mono text-slate-200 text-xl">{formatDuration(report.totalTime)}</td>
                    <td className="p-3 border-b border-slate-700">
                      {report.status === 'present' ? (
                        <span className="px-3 py-1 text-base font-semibold text-green-100 bg-green-600 rounded-full">出勤中</span>
                      ) : (
                        <span className="px-3 py-1 text-base font-semibold text-slate-300 bg-slate-600 rounded-full">退勤</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;