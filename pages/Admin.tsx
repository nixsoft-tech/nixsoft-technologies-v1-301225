import React, { useState, useMemo } from 'react';
import { Shield, Calendar, MessageCircle, Clock, ChevronRight, Lock, AlertCircle } from 'lucide-react';

interface ChatLog {
  timestamp: string;
  sessionId: string;
  role: string;
  text: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [logs, setLogs] = useState<Record<string, ChatLog[]>>({});
  const [token, setToken] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setIsAuthorized(true);
        setPassword('');
        // Fetch logs with the new token
        await fetchLogs(data.token);
      } else if (response.status === 429) {
        setLoginError('Too many failed attempts. Try again later.');
      } else {
        setLoginError('Invalid admin password. Please try again.');
      }
    } catch {
      setLoginError('Failed to connect to backend. Is the server running?');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchLogs = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/chats`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else if (response.status === 401) {
        // Token expired/invalid
        handleLogout();
      }
    } catch {
      setLoginError('Failed to connect to backend. Is the server running?');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setLogs({});
    setSelectedDate(null);
    setSelectedSession(null);
    setPassword('');
    setToken(null);
  };

  // ✅ Pre-compute session IDs and counts with useMemo — not inline in JSX
  const dates = useMemo(() => Object.keys(logs).sort().reverse(), [logs]);

  const sessionsByDate = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const date of dates) {
      result[date] = [...new Set(logs[date].map(l => l.sessionId))];
    }
    return result;
  }, [dates, logs]);

  const sessions = selectedDate ? sessionsByDate[selectedDate] ?? [] : [];

  const activeMessages = useMemo(() => {
    if (!selectedDate || !selectedSession) return [];
    return logs[selectedDate]?.filter(l => l.sessionId === selectedSession) ?? [];
  }, [logs, selectedDate, selectedSession]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 pt-32">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-nixGreen/10 rounded-2xl">
              <Shield className="text-nixGreen" size={40} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">NixBot Admin</h1>
          <p className="text-slate-400 text-center mb-8">Enter your secure access key</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure Key"
                autoComplete="current-password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-nixGreen focus:outline-none transition-all"
              />
            </div>

            {/* ✅ Inline error display — no blocking alert() */}
            {loginError && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full bg-nixGreen hover:bg-green-400 text-slate-900 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Chat Intelligence</h1>
            <p className="text-slate-400">Monitoring NixBot interactions &amp; sessions</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dates Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center space-x-2 text-nixGreen mb-4">
              <Calendar size={18} />
              <span className="font-semibold uppercase tracking-wider text-xs">History</span>
            </div>
            {dates.length === 0 && (
              <div className="text-slate-600 italic text-sm">No logs found.</div>
            )}
            {dates.map(date => (
              <button
                key={date}
                onClick={() => { setSelectedDate(date); setSelectedSession(null); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedDate === date
                    ? 'bg-nixGreen/10 border-nixGreen text-nixGreen'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="font-bold">{date}</div>
                {/* ✅ Session count from pre-computed memo, not inline Set */}
                <div className="text-xs opacity-60">{sessionsByDate[date]?.length ?? 0} sessions</div>
              </button>
            ))}
          </div>

          {/* Sessions Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center space-x-2 text-nixBlue mb-4">
              <MessageCircle size={18} />
              <span className="font-semibold uppercase tracking-wider text-xs">Sessions</span>
            </div>
            {!selectedDate && <div className="text-slate-600 italic text-sm">Select a date</div>}
            {sessions.map(sid => (
              <button
                key={sid}
                onClick={() => setSelectedSession(sid)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedSession === sid
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">ID: {sid}</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>

          {/* Chat Viewer */}
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-t-3xl">
              <span className="font-bold">Conversation Viewer</span>
              {selectedSession && (
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">
                  {selectedSession}
                </span>
              )}
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {!selectedSession && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <MessageCircle size={60} className="mb-4 opacity-20" />
                  <p>Select a session to view transcript</p>
                </div>
              )}
              {/* ✅ Uses pre-computed activeMessages — stable composite key */}
              {activeMessages.map((msg) => (
                <div
                  key={`${msg.sessionId}-${msg.timestamp}`}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-2 mb-1 px-1 text-[10px] text-slate-500 uppercase tracking-tighter">
                    <Clock size={10} />
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    <span className="font-bold">{msg.role}</span>
                  </div>
                  <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-nixBlue text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
