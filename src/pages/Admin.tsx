import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, MessageCircle, BarChart2, Trash2, Shield, BookOpen, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile, Post, DiaryEntry } from '../types';
import { formatDate } from '../lib/dateUtils';

type Tab = 'dashboard' | 'users' | 'posts' | 'diary';

export default function Admin() {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [users, setUsers] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<(DiaryEntry & { profile?: Profile })[]>([]);
  const [stats, setStats] = useState({ users: 0, posts: 0, diary: 0, moods: 0 });
  const [loadingData, setLoadingData] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoadingData(true);
    const [usersRes, postsRes, diaryRes, moodsRes] = await Promise.all([
      supabase.from('profiles').select('count', { count: 'exact', head: true }),
      supabase.from('posts').select('count', { count: 'exact', head: true }),
      supabase.from('diary_entries').select('count', { count: 'exact', head: true }),
      supabase.from('mood_entries').select('count', { count: 'exact', head: true }),
    ]);
    setStats({
      users: usersRes.count || 0,
      posts: postsRes.count || 0,
      diary: diaryRes.count || 0,
      moods: moodsRes.count || 0,
    });
    setLoadingData(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingData(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoadingData(false);
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from('posts')
      .select('*, profile:profiles(id, nome, email)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setPosts(data as Post[]);
    setLoadingData(false);
  }, []);

  const fetchDiary = useCallback(async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from('diary_entries')
      .select('*, profile:profiles(id, nome, email)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setDiaryEntries(data as (DiaryEntry & { profile?: Profile })[]);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboard();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'posts') fetchPosts();
    else if (activeTab === 'diary') fetchDiary();
  }, [activeTab, fetchDashboard, fetchUsers, fetchPosts, fetchDiary]);

  const deletePost = async (id: string) => {
    if (!confirm('Excluir esta publicação?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) setPosts(prev => prev.filter(p => p.id !== id));
  };

  const deleteDiary = async (id: string) => {
    if (!confirm('Excluir esta entrada de diário?')) return;
    const { error } = await supabase.from('diary_entries').delete().eq('id', id);
    if (!error) setDiaryEntries(prev => prev.filter(e => e.id !== id));
  };

  const toggleAdmin = async (userId: string, currentAdmin: boolean) => {
    await supabase.from('profiles').update({ is_admin: !currentAdmin }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !currentAdmin } : u));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile?.is_admin) return <Navigate to="/" replace />;

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'posts', label: 'Publicações', icon: MessageCircle },
    { id: 'diary', label: 'Diários', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-800 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Gerenciamento da plataforma NexMente</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-purple-800 text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {loadingData && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loadingData && activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Total de Usuários', value: stats.users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
                { icon: MessageCircle, label: 'Total de Publicações', value: stats.posts, color: 'text-green-600 bg-green-50 dark:bg-green-950/30' },
                { icon: BookOpen, label: 'Entradas de Diário', value: stats.diary, color: 'text-purple-700 bg-purple-50 dark:bg-purple-950/30' },
                { icon: Activity, label: 'Registros de Humor', value: stats.moods, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
              ].map(stat => (
                <div key={stat.label} className="card">
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon size={22} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informações do Sistema</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  ['Plataforma', 'NexMente v1.0'],
                  ['Banco de Dados', 'Supabase PostgreSQL'],
                  ['Autenticação', 'Supabase Auth'],
                  ['Status', '✅ Operacional'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">{k}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loadingData && activeTab === 'users' && (
          <div className="card overflow-hidden p-0">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Usuários Cadastrados ({users.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-3 font-medium">Usuário</th>
                    <th className="px-6 py-3 font-medium">E-mail</th>
                    <th className="px-6 py-3 font-medium">Cadastro</th>
                    <th className="px-6 py-3 font-medium">Função</th>
                    <th className="px-6 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {u.nome?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{u.nome || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.is_admin ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {u.is_admin ? 'Admin' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAdmin(u.id, u.is_admin)}
                          className="text-xs text-purple-800 dark:text-purple-400 hover:underline"
                        >
                          {u.is_admin ? 'Remover admin' : 'Tornar admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">Nenhum usuário cadastrado.</div>
              )}
            </div>
          </div>
        )}

        {!loadingData && activeTab === 'posts' && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="card text-center py-10 text-gray-400 text-sm">Nenhuma publicação.</div>
            ) : posts.map(post => (
              <div key={post.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{post.profile?.nome || 'Anônimo'}</span>
                      <span>·</span>
                      <span>{formatDate(post.created_at)}</span>
                      <span>·</span>
                      <span>{post.likes_count} apoios</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{post.content}</p>
                  </div>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors flex-shrink-0"
                    title="Excluir publicação"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingData && activeTab === 'diary' && (
          <div className="space-y-3">
            {diaryEntries.length === 0 ? (
              <div className="card text-center py-10 text-gray-400 text-sm">Nenhuma entrada de diário.</div>
            ) : diaryEntries.map(entry => (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{entry.profile?.nome || '—'}</span>
                      <span>·</span>
                      <span>{formatDate(entry.created_at)}</span>
                      <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-full">{entry.emocao}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{entry.titulo}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{entry.conteudo}</p>
                  </div>
                  <button
                    onClick={() => deleteDiary(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
