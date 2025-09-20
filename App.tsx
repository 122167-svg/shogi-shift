import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MEMBERS, SHIFT_SCHEDULE, MEMBER_READINGS } from './constants';
import { type AllMemberWorkStatus } from './types';
import Header from './Header';
import MemberButton from './MemberButton';
import Dashboard from './Dashboard';
import AdminModal from './AdminModal';
import NextShiftModal from './NextShiftModal';
import InfoModal from './InfoModal';

const getTodayKey = () => {
  const today = new Date();
  return `shogi-attendance-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const App: React.FC = () => {
  const [memberWorkStatus, setMemberWorkStatus] = useState<AllMemberWorkStatus>(() => {
    try {
      const savedStatus = localStorage.getItem(getTodayKey());
      if (savedStatus) {
        const parsedStatus = JSON.parse(savedStatus);
        MEMBERS.forEach(member => {
          if (!parsedStatus[member] || !parsedStatus[member].sessions) {
            parsedStatus[member] = { status: 'absent', sessions: [] };
          }
        });
        return parsedStatus;
      }
    } catch (error) {
      console.error("Could not parse saved status from localStorage", error);
    }
    return Object.fromEntries(MEMBERS.map(name => [name, { status: 'absent', sessions: [] }]));
  });

  const [filterInitial, setFilterInitial] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // State for new modals
  const [nextShiftModal, setNextShiftModal] = useState<{isOpen: boolean; memberName: string | null}>({isOpen: false, memberName: null});
  const [infoModal, setInfoModal] = useState<{isOpen: boolean; title: string; content: React.ReactNode}>({isOpen: false, title: '', content: null});


  useEffect(() => {
    try {
      localStorage.setItem(getTodayKey(), JSON.stringify(memberWorkStatus));
    } catch (error) {
      console.error("Could not save status to localStorage", error);
    }
  }, [memberWorkStatus]);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleConfirmClockOut = useCallback((name: string) => {
    setMemberWorkStatus(prev => {
        const currentMemberState = prev[name];
        const now = Date.now();
        let newSessions = [...currentMemberState.sessions];
        const lastSession = newSessions[newSessions.length - 1];
        if (lastSession && !lastSession.clockOut) {
            lastSession.clockOut = now;
        }
        return {
            ...prev,
            [name]: { status: 'absent', sessions: newSessions },
        };
    });
    setNextShiftModal({isOpen: false, memberName: null});
    setInfoModal({
        isOpen: true,
        title: `${name} さん、お疲れ様でした！`,
        content: (
            <div className="space-y-4">
                <p className="text-3xl">貴重な文化祭の時間を割いてくれて本当にありがとう。(by部長)</p>
                <p className="text-2xl">今後の部活動にもご理解・ご協力をお願いします。</p>
            </div>
        )
    });
  }, []);

  const handleToggleAttendance = useCallback((name: string) => {
    const currentStatus = memberWorkStatus[name]?.status;

    if (currentStatus === 'present') {
      // Show confirmation modal before clocking out
      setNextShiftModal({ isOpen: true, memberName: name });
    } else {
      // Clock in immediately and show info modal
      setMemberWorkStatus(prev => {
        const newSessions = [...(prev[name]?.sessions || [])];
        newSessions.push({ clockIn: Date.now() });
        return {
          ...prev,
          [name]: { status: 'present', sessions: newSessions },
        };
      });
      setInfoModal({
        isOpen: true,
        title: `ようこそ、${name} さん！`,
        content: (
            <div className="space-y-4">
                <p className="text-4xl font-semibold text-green-300">来てくれてありがとう！ (by部長)</p>
                <p className="text-2xl font-bold text-yellow-300 bg-yellow-900/50 p-3 rounded-lg">
                    注意：部屋から出る時は、必ずこのアプリで「退勤」ボタンを押してください。
                </p>
            </div>
        )
      });
    }
  }, [memberWorkStatus]);
  
  const handleFilterChange = useCallback((initial: string | null) => {
    setFilterInitial(current => (current === initial ? null : initial));
  }, []);

  const filteredMembers = useMemo(() => {
    if (!filterInitial) {
      return MEMBERS;
    }
    return MEMBERS.filter(name => {
      const reading = MEMBER_READINGS[name];
      return reading && reading.startsWith(filterInitial);
    });
  }, [filterInitial]);
  
  const presentCount = Object.values(memberWorkStatus).filter(s => s.status === 'present').length;

  return (
    <div className="min-h-screen bg-transparent text-white antialiased">
      <Header />
      
      <InfoModal 
        isOpen={infoModal.isOpen}
        onClose={() => setInfoModal({isOpen: false, title: '', content: null})}
        title={infoModal.title}
      >
        {infoModal.content}
      </InfoModal>

      {nextShiftModal.memberName && (
         <NextShiftModal 
            isOpen={nextShiftModal.isOpen}
            onClose={() => setNextShiftModal({isOpen: false, memberName: null})}
            onConfirm={() => handleConfirmClockOut(nextShiftModal.memberName!)}
            memberName={nextShiftModal.memberName}
            schedule={SHIFT_SCHEDULE}
            currentTime={currentTime}
         />
      )}

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        workStatus={memberWorkStatus}
        currentTime={currentTime}
      />
      <main className="container mx-auto px-4 py-8">
        <Dashboard
          presentCount={presentCount}
          totalCount={MEMBERS.length}
          onFilterChange={handleFilterChange}
          activeFilter={filterInitial}
          onAdminClick={() => setIsAdminModalOpen(true)}
          schedule={SHIFT_SCHEDULE}
          currentTime={currentTime}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-8">
          {filteredMembers.map(name => (
            <MemberButton
              key={name}
              name={name}
              status={memberWorkStatus[name]?.status ?? 'absent'}
              onClick={handleToggleAttendance}
            />
          ))}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-400 text-lg">
        <p>©Sugamo-Gakuen_Shogi-Club-Leader_秀村紘嗣</p>
      </footer>
    </div>
  );
};

export default App;