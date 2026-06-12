import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart2, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { MoodEntry } from '../types';
import { MOOD_OPTIONS } from '../types';

const MOOD_SCORE: Record<string, number> = {
  very_good: 5, good: 4, neutral: 3, sad: 2, very_sad: 1,
};

const MOOD_LABEL: Record<string, string> = {
  very_good: 'Muito Bem', good: 'Bem', neutral: 'Normal', sad: 'Triste', very_sad: 'Muito Mal',
};

const MOOD_COLORS: Record<string, string> = {
  very_good: '#22c55e', good: '#84cc16', neutral: '#eab308', sad: '#f97316', very_sad: '#ef4444',
};

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function EmotionalThermometer() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (!error && data) setEntries(data as MoodEntry[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const getWeekData = () => {
    const today = new Date();
    const days: { name: string; score: number | null; mood: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayEntries = entries.filter(e => e.created_at.startsWith(dateStr));
      const last = dayEntries[dayEntries.length - 1];
      days.push({
        name: DAY_LABELS[date.getDay()],
        score: last ? MOOD_SCORE[last.mood] : null,
        mood: last ? last.mood : '',
      });
    }
    return days;
  };

  const getMonthData = (): { name: string; score: number | null; mood: string }[] => {
    const today = new Date();
    const weeks: { name: string; score: number | null; mood: string }[] = [];

    for (let w = 3; w >= 0; w--) {
      const weekEntries: MoodEntry[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - w * 7 - d);
        const dateStr = date.toISOString().split('T')[0];
        const dayEs = entries.filter(e => e.created_at.startsWith(dateStr));
        weekEntries.push(...dayEs);
      }
      const avg = weekEntries.length
        ? weekEntries.reduce((s, e) => s + MOOD_SCORE[e.mood], 0) / weekEntries.length
        : 0;
      weeks.push({ name: `Sem ${4 - w}`, score: weekEntries.length ? parseFloat(avg.toFixed(1)) : null, mood: '' });
    }
    return weeks;
  };

  const getMoodDistribution = () => {
    const counts: Record<string, number> = {};
    entries.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    return MOOD_OPTIONS.map(opt => ({
      name: opt.label,
      value: counts[opt.value] || 0,
      color: MOOD_COLORS[opt.value],
    })).filter(d => d.value > 0);
  };

  const getStats = () => {
    if (entries.length === 0) return null;
    const scores = entries.map(e => MOOD_SCORE[e.mood]);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const last7 = entries.slice(-7);
    const prev7 = entries.slice(-14, -7);
    const avgLast7 = last7.length ? last7.reduce((s, e) => s + MOOD_SCORE[e.mood], 0) / last7.length : 0;
    const avgPrev7 = prev7.length ? prev7.reduce((s, e) => s + MOOD_SCORE[e.mood], 0) / prev7.length : 0;
    const trend = avgLast7 - avgPrev7;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(e => e.created_at.startsWith(todayStr));
    const todayMood = todayEntries[todayEntries.length - 1];
    const bestMood = entries.reduce((best, e) => MOOD_SCORE[e.mood] > MOOD_SCORE[best.mood] ? e : best, entries[0]);

    return { avg, trend, todayMood, totalEntries: entries.length, bestMood };
  };

  const stats = getStats();
  const weekData = getWeekData();
  const monthData = getMonthData();
  const distribution = getMoodDistribution();
  const chartData = period === 'week' ? weekData : monthData;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length && payload[0].value) {
      const score = payload[0].value;
      const moodEntry = MOOD_OPTIONS.find(m => MOOD_SCORE[m.value] === Math.round(score));
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
          {moodEntry && <p className="text-sm" style={{ color: MOOD_COLORS[moodEntry.value] }}>{moodEntry.emoji} {moodEntry.label}</p>}
          <p className="text-xs text-gray-400">Score: {score.toFixed(1)}/5</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Termômetro Emocional</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Acompanhe sua evolução e bem-estar emocional</p>
        </div>

        {entries.length === 0 ? (
          <div className="card text-center py-16">
            <Activity size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum dado ainda</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Registre seu humor diariamente para ver seus gráficos aqui.</p>
            <a href="/" className="btn-primary inline-block">Registrar meu humor</a>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: 'Humor de Hoje',
                  value: stats?.todayMood ? `${MOOD_OPTIONS.find(m => m.value === stats.todayMood?.mood)?.emoji} ${MOOD_LABEL[stats.todayMood.mood]}` : '—',
                  icon: Calendar,
                  color: 'text-purple-700 bg-purple-50 dark:bg-purple-950/30',
                },
                {
                  label: 'Média Geral',
                  value: stats ? `${stats.avg.toFixed(1)}/5` : '—',
                  icon: BarChart2,
                  color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
                },
                {
                  label: 'Total de Registros',
                  value: stats ? `${stats.totalEntries}` : '0',
                  icon: Activity,
                  color: 'text-green-600 bg-green-50 dark:bg-green-950/30',
                },
                {
                  label: 'Tendência',
                  value: stats
                    ? stats.trend > 0.2 ? '↑ Melhorando' : stats.trend < -0.2 ? '↓ Atenção' : '→ Estável'
                    : '—',
                  icon: stats && stats.trend > 0.2 ? TrendingUp : stats && stats.trend < -0.2 ? TrendingDown : Minus,
                  color: stats && stats.trend > 0.2
                    ? 'text-green-600 bg-green-50 dark:bg-green-950/30'
                    : stats && stats.trend < -0.2
                    ? 'text-red-600 bg-red-50 dark:bg-red-950/30'
                    : 'text-gray-600 bg-gray-50 dark:bg-gray-800',
                },
              ].map(stat => (
                <div key={stat.label} className="card">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Line Chart - Evolution */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Evolução Emocional</h2>
                <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setPeriod('week')}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${period === 'week' ? 'bg-purple-800 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    7 dias
                  </button>
                  <button
                    onClick={() => setPeriod('month')}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${period === 'month' ? 'bg-purple-800 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    30 dias
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis domain={[1, 5]} tick={{ fontSize: 12, fill: '#9ca3af' }} tickCount={5} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6D28D9"
                    strokeWidth={2.5}
                    dot={{ fill: '#6D28D9', r: 5 }}
                    activeDot={{ r: 7 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400 flex-wrap">
                {[1, 2, 3, 4, 5].map(s => {
                  const opt = MOOD_OPTIONS.find(m => MOOD_SCORE[m.value] === s);
                  return opt ? (
                    <span key={s} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: MOOD_COLORS[opt.value] }} />
                      {s} = {opt.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Bar Chart */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Média Semanal</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={getMonthData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip
                      formatter={(v: unknown) => [`${(v as number).toFixed(1)}/5`, 'Média']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="score" fill="#6D28D9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Distribuição de Humores</h2>
                {distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {distribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: unknown) => [`${v} registros`, '']} contentStyle={{ borderRadius: '12px' }} />
                      <Legend formatter={(v) => <span className="text-sm text-gray-600 dark:text-gray-400">{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    Sem dados suficientes
                  </div>
                )}
              </div>
            </div>

            {/* Mood History */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Histórico Recente</h2>
              <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
                {[...entries].reverse().slice(0, 20).map(entry => {
                  const opt = MOOD_OPTIONS.find(m => m.value === entry.mood);
                  return (
                    <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <span className="text-2xl">{opt?.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: MOOD_COLORS[entry.mood] }}>{opt?.label}</span>
                          {entry.note && <span className="text-xs text-gray-400 truncate max-w-[200px]">{entry.note}</span>}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <div key={s} className="w-2.5 h-2.5 rounded-full" style={{ background: s <= MOOD_SCORE[entry.mood] ? MOOD_COLORS[entry.mood] : '#e5e7eb' }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
