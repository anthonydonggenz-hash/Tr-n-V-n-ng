
import React, { useState, useRef, useEffect } from 'react';
import { STUDENTS, QUESTIONS } from './constants';
import type { HistoryEntry, Student } from './types';
import WheelCanvas from './components/WheelCanvas';
import PopupModal from './components/PopupModal';

const SPIN_DURATION_MS = 6000;

const generateAvatarDataURL = (name: string): string => {
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 75%, 85%)`;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#374151';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.charAt(0).toUpperCase(), size / 2, size / 2 + 1);
  }

  return canvas.toDataURL();
};

const initialStudents: Student[] = STUDENTS.map((name, index) => ({
  name,
  avatar: generateAvatarDataURL(name),
  question: QUESTIONS[index % QUESTIONS.length],
}));

const App: React.FC = () => {
  const [currentStudents, setCurrentStudents] = useState<Student[]>(initialStudents);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selected, setSelected] = useState<{ name: string; question: string } | null>(null);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const cheerSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  useEffect(() => {
    bgMusicRef.current = new Audio("https://www.bensound.com/bensound-music/bensound-littleidea.mp3");
    bgMusicRef.current.loop = true;
    spinSoundRef.current = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
    cheerSoundRef.current = new Audio("https://www.soundjay.com/human/sounds/applause-8.mp3");
  }, []);

  const handleSpin = () => {
    if (isSpinning || currentStudents.length === 0) return;

    setIsSpinning(true);
    spinSoundRef.current?.play().catch(e => console.error("Error playing spin sound:", e));

    const winnerIndex = Math.floor(Math.random() * currentStudents.length);
    const arc = 360 / currentStudents.length;
    const angleToWinner = 360 - (winnerIndex * arc + arc / 2);
    const randomSpins = Math.floor(Math.random() * 5 + 8) * 360;
    const newRotation = rotation + randomSpins + angleToWinner;
    
    setRotation(newRotation);

    setTimeout(() => {
      const winner = currentStudents[winnerIndex];
      setSelected({ name: winner.name, question: winner.question });
      cheerSoundRef.current?.play().catch(e => console.error("Error playing cheer sound:", e));

      setHistory(prev => [...prev, { student: winner, index: winnerIndex }]);
      
      const updatedStudents = currentStudents.filter((_, index) => index !== winnerIndex);
      setCurrentStudents(updatedStudents);
      
      setIsSpinning(false);
    }, SPIN_DURATION_MS);
  };
  
  const handleUndo = () => {
    if (history.length === 0 || isSpinning) return;

    const lastEntry = history[history.length - 1];
    const studentToRestore = lastEntry.student;
    
    if (studentToRestore) {
        const newStudents = [...currentStudents];
        newStudents.splice(lastEntry.index, 0, studentToRestore);
        setCurrentStudents(newStudents);
        setHistory(prev => prev.slice(0, -1));
    }
  };
  
  const handleReset = () => {
    if (isSpinning) return;
    setCurrentStudents(initialStudents);
    setHistory([]);
  };
  
  const handleToggleMusic = () => {
    if (!bgMusicRef.current) return;
    if (isMusicPlaying) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play().catch(e => console.error("Error playing music:", e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };
  
  const handleClosePopup = () => {
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 text-gray-800 font-sans overflow-hidden">
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-indigo-800 uppercase tracking-tight">Vòng quay nghiệp vụ NH-KS</h1>
        <p className="text-xl text-indigo-600 mt-2 font-medium">Trường Cao đẳng Quảng Nam</p>
      </header>
      
      <div className="flex-grow w-full flex flex-col lg:flex-row items-center justify-center gap-8 xl:gap-16">
        <main className="relative flex flex-col items-center">
          <div 
            className={`absolute -top-4 z-10 transition-transform duration-300 ${isSpinning ? 'animate-bounce' : ''}`}
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 shadow-lg"></div>
          </div>
          
          <div 
            className="transition-transform"
            style={{ 
              transform: `rotate(${rotation}deg)`, 
              transitionDuration: `${SPIN_DURATION_MS}ms`,
              transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <WheelCanvas students={currentStudents} width={500} height={500} isSpinning={isSpinning} />
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={handleSpin} disabled={isSpinning || currentStudents.length === 0} className="px-10 py-4 bg-indigo-600 text-white font-bold text-xl rounded-full shadow-xl transform hover:scale-105 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed">
              QUAY NGAY
            </button>
            <button onClick={handleUndo} disabled={isSpinning || history.length === 0} className="px-6 py-4 bg-amber-500 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform disabled:bg-gray-400">
              ↩ Hoàn tác
            </button>
            <button onClick={handleReset} disabled={isSpinning} className="px-6 py-4 bg-red-500 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform disabled:bg-gray-400">
              🔄 Làm mới
            </button>
            <button onClick={handleToggleMusic} className="px-6 py-4 bg-emerald-500 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform">
              {isMusicPlaying ? '🔇 Tắt nhạc' : '🔊 Bật nhạc'}
            </button>
          </div>
        </main>
        
        <aside className="w-full max-w-xs lg:w-72 self-center lg:self-start mt-8 lg:mt-0">
          {history.length > 0 && (
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-indigo-100">
                  <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4 border-b-2 border-indigo-200 pb-2">Danh sách đã quay</h2>
                  <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {history.map(({ student }, index) => (
                          <li key={`${student.name}-${index}`} className="text-lg text-gray-400 line-through text-center font-medium">
                              {student.name}
                          </li>
                      ))}
                  </ul>
              </div>
          )}
        </aside>
      </div>

      {selected && (
        <PopupModal 
          name={selected.name}
          question={selected.question}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default App;
