import { useState, useEffect, type ElementType } from 'react';
import { User, Mail, Lock, Camera, Save, BarChart2, BookOpen, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MOOD_OPTIONS } from '../types';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [nome, setNome] = useState(profile?.nome || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  const [stats, setStats] = useState({ moods: 0, diary: 0, posts: 0, avgMood: 0, topMood: '' });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (profile) setNome(profile.nome);
    fetchStats();
  }, [profile]);

  const fetchStats = async () => {
    if (!user) return;
    setLoadingStats(true);
    const [moodsRes, diaryRes, postsRes] = await Promise.all([
      supabase.from('mood_entries').select('mood').eq('user_id', user.id),
      supabase.from('diary_entries').select('id').eq('user_id', user.id),
      supabase.from('posts').select('id').eq('user_id', user.id),
    ]);

    const moods = moodsRes.data || [];
    const moodScores: Record<string, number> = { very_good: 5, good: 4, neutral: 3, sad: 2, very_sad: 1 };
    const avg = moods.length ? moods.reduce((s, m) => s + moodScores[m.mood], 0) / moods.length : 0;

    const moodCounts: Record<string, number> = {};
    moods.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
    const top = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    setStats({
      moods: moods.length,
      diary: diaryRes.data?.length || 0,
      posts: postsRes.data?.length || 0,
      avgMood: avg,
      topMood: top,
    });
    setLoadingStats(false);
  };

  const handleSaveProfile = async () => {
    if (!nome.trim()) return;
    setSaving(true);
    setError('');
    const { error } = await supabase.from('profiles').update({ nome: nome.trim() }).eq('id', user?.id);
    if (error) {
      setError('Erro ao salvar. Tente novamente.');
    } else {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setChangingPassword(true);
    setPasswordMsg('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg('Erro ao alterar senha. Tente novamente.');
    } else {
      setPasswordMsg('✅ Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
    }
    setChangingPassword(false);
  };

  const topMoodOption = MOOD_OPTIONS.find(m => m.value === stats.topMood);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gerencie suas informações e acompanhe suas estatísticas</p>
        </div>

        {/* Avatar + Basic Info */}
        <div className="card mb-5">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white text-3xl font-bold">
                  {nome?.[0]?.toUpperCase() || <User size={28} />}
                </div>
              )}
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-800 text-white rounded-full flex items-center justify-center hover:bg-purple-900 transition-colors shadow-md">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.nome || 'Usuário'}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                <Mail size={13} /> {profile?.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Membro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {([
            { Icon: BarChart2, label: 'Registros de Humor', value: stats.moods, color: 'text-purple-700 bg-purple-50 dark:bg-purple-950/30', emoji: null },
            { Icon: BookOpen, label: 'Entradas no Diário', value: stats.diary, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30', emoji: null },
            { Icon: MessageCircle, label: 'Desabafos', value: stats.posts, color: 'text-green-600 bg-green-50 dark:bg-green-950/30', emoji: null },
            { Icon: null, label: 'Humor Frequente', value: topMoodOption?.label || '—', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30', emoji: topMoodOption?.emoji || '—' },
          ] as { Icon: ElementType | null; label: string; value: string | number; color: string; emoji: string | null }[]).map(stat => (
            <div key={stat.label} className="card p-4">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
                {stat.emoji ? <span className="text-lg">{stat.emoji}</span> : stat.Icon ? <stat.Icon size={18} /> : null}
              </div>
              {loadingStats ? (
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
              ) : (
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile */}
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informações Pessoais</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Nome</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="input pl-10"
                  placeholder="Seu nome"
                />
              </div>
            </div>
            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="input pl-10 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {saved && <p className="text-sm text-green-600 flex items-center gap-1">✅ Perfil atualizado!</p>}
            <button
              onClick={handleSaveProfile}
              disabled={saving || !nome.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Alterar Senha</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Senha atual</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Nova senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {passwordMsg}
              </p>
            )}
            <button
              onClick={handleChangePassword}
              disabled={changingPassword || !newPassword}
              className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock size={16} />
              {changingPassword ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
