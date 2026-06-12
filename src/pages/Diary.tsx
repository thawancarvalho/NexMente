import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, X, BookOpen, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { DiaryEntry } from '../types';
import { EMOTION_OPTIONS } from '../types';
import { formatDate } from '../lib/dateUtils';

type ViewMode = 'list' | 'form';

export default function Diary() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('list');
  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [emocao, setEmocao] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setEntries(data as DiaryEntry[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const openNew = () => {
    setEditEntry(null);
    setTitulo('');
    setConteudo('');
    setEmocao('');
    setView('form');
  };

  const openEdit = (entry: DiaryEntry) => {
    setEditEntry(entry);
    setTitulo(entry.titulo);
    setConteudo(entry.conteudo);
    setEmocao(entry.emocao);
    setView('form');
  };

  const handleSave = async () => {
    if (!titulo.trim() || !conteudo.trim() || !emocao) return;
    setSaving(true);

    if (editEntry) {
      const { error } = await supabase
        .from('diary_entries')
        .update({ titulo: titulo.trim(), conteudo: conteudo.trim(), emocao })
        .eq('id', editEntry.id);
      if (!error) {
        setEntries(prev => prev.map(e => e.id === editEntry.id
          ? { ...e, titulo: titulo.trim(), conteudo: conteudo.trim(), emocao }
          : e
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert({ titulo: titulo.trim(), conteudo: conteudo.trim(), emocao })
        .select()
        .single();
      if (!error && data) setEntries(prev => [data as DiaryEntry, ...prev]);
    }

    setSaving(false);
    setView('list');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta entrada?')) return;
    const { error } = await supabase.from('diary_entries').delete().eq('id', id);
    if (!error) setEntries(prev => prev.filter(e => e.id !== id));
  };

  const filtered = entries.filter(e =>
    !searchQuery ||
    e.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.conteudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.emocao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emotionColor: Record<string, string> = {
    Alegria: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Gratidão: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Calma: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Esperança: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    Amor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
    Ansiedade: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    Tristeza: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    Raiva: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Medo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    Frustração: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    Confusão: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    Cansaço: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    Solidão: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
    Empolgação: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    Orgulho: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  };

  if (view === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('list')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {editEntry ? 'Editar entrada' : 'Nova entrada'}
            </h1>
          </div>

          <div className="card space-y-4">
            <div>
              <label className="label">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Como foi o seu dia?"
                className="input"
                maxLength={100}
              />
            </div>

            <div>
              <label className="label">Como você está se sentindo?</label>
              <div className="flex flex-wrap gap-2">
                {EMOTION_OPTIONS.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmocao(em)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      emocao === em
                        ? 'bg-purple-800 text-white border-purple-800'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">O que você quer registrar?</label>
              <textarea
                value={conteudo}
                onChange={e => setConteudo(e.target.value)}
                placeholder="Escreva livremente sobre seus pensamentos, sentimentos e experiências..."
                className="input resize-none h-48"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setView('list')} className="btn-secondary">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={!titulo.trim() || !conteudo.trim() || !emocao || saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Salvando...' : editEntry ? 'Salvar alterações' : 'Salvar entrada'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Diário Emocional</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Seus registros privados e seguros</p>
          </div>
          <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} />
            Nova entrada
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar entradas..."
            className="input pl-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Nenhuma entrada encontrada.' : 'Nenhuma entrada ainda. Comece a escrever!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(entry => (
              <div key={entry.id} className="card hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${emotionColor[entry.emocao] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {entry.emocao}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{entry.titulo}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {entry.conteudo}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => openEdit(entry)}
                      className="p-2 text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
