import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10 text-center py-6 shadow-2xl shadow-slate-900/50">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-100">
        巣鴨学園将棋部
      </h1>
      <h2 className="text-3xl sm:text-4xl text-slate-300 mt-1">
        文化祭シフト管理アプリ
      </h2>
      <div className="mt-4 inline-block">
        <div className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg rounded-full shadow-lg border-2 border-red-500/50">
          🎴 将棋部員専用 🎴
        </div>
      </div>
    </header>
  );
};

export default Header;