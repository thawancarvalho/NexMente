import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield, Users, BookOpen, Phone, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MOOD_OPTIONS, DAILY_PHRASES, type MoodValue } from '../types';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodSaved, setMoodSaved] = useState(false);
  const [savingMood, setSavingMood] = useState(false);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const phrase = DAILY_PHRASES[new Date().getDate() % DAILY_PHRASES.length];

  useEffect(() => {
    if (user) fetchTodayMood();
  }, [user]);

  const fetchTodayMood = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('mood_entries')
      .select('mood')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .order('created_at', { ascending: false })
      .limit(1);
    if (data && data.length > 0) setTodayMood(data[0].mood);
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;
    if (!user) { navigate('/auth'); return; }
    setSavingMood(true);
    const { error } = await supabase.from('mood_entries').insert({
      mood: selectedMood,
      note: moodNote || null,
    });
    if (!error) {
      setMoodSaved(true);
      setTodayMood(selectedMood);
      setTimeout(() => setMoodSaved(false), 3000);
    }
    setSavingMood(false);
  };

  const todayMoodOption = MOOD_OPTIONS.find(m => m.value === todayMood);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Heart size={14} className="fill-current" />
                Saúde mental para estudantes
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Você não precisa{' '}
                <span className="text-purple-800 dark:text-purple-400">
                  enfrentar tudo
                </span>{' '}
                sozinho.
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                Um espaço seguro para compartilhar sentimentos, cuidar da sua saúde mental e encontrar apoio emocional.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to={user ? '/comunidade' : '/auth'}
                  className="btn-primary flex items-center gap-2 text-base"
                >
                  <Heart size={18} />
                  Fazer um Desabafo
                </Link>
                <Link
                  to="/ajuda"
                  className="btn-secondary flex items-center gap-2 text-base"
                >
                  <Phone size={18} />
                  Buscar Apoio
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                {[
                  { number: '100%', label: 'Seguro e Anônimo' },
                  { number: '24h', label: 'Disponível Sempre' },
                  { number: '❤️', label: 'Comunidade Acolhedora' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-400">{stat.number}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="relative flex justify-center items-center animate-fade-in">
              <div className="relative">
                <img
                  src="/ChatGPT_Image_3_de_jun._de_2026,_09_26_12.png"
                  alt="NexMente - Apoio Emocional"
                  className="w-full max-w-md rounded-3xl shadow-2xl animate-float"
                />

                {/* Floating bubbles */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 py-2.5 border border-purple-100 dark:border-purple-900/50 animate-pulse-soft">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    💜 Seus sentimentos importam
                  </p>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-purple-800 rounded-2xl shadow-lg px-4 py-2.5 animate-pulse-soft" style={{ animationDelay: '1s' }}>
                  <p className="text-sm font-medium text-white">
                    🤝 Você não está sozinho
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Phrase */}
      <section className="bg-purple-800 py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star size={16} className="text-purple-300" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wider">Frase do Dia</span>
            <Star size={16} className="text-purple-300" />
          </div>
          <p className="text-white text-xl md:text-2xl font-medium italic leading-relaxed">
            "{phrase}"
          </p>
        </div>
      </section>

      {/* Mood Tracker */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Como você está hoje?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Registre seu humor diário e acompanhe sua evolução emocional.</p>

            {todayMood && todayMoodOption ? (
              <div className="py-4">
                <p className="text-gray-600 dark:text-gray-400 mb-3">Seu humor de hoje:</p>
                <div className="inline-flex items-center gap-3 bg-purple-50 dark:bg-purple-950/30 px-6 py-3 rounded-2xl">
                  <span className="text-4xl">{todayMoodOption.emoji}</span>
                  <span className="text-lg font-semibold" style={{ color: todayMoodOption.color }}>{todayMoodOption.label}</span>
                </div>
                <button
                  onClick={() => { setTodayMood(null); setSelectedMood(null); setMoodSaved(false); }}
                  className="block mx-auto mt-4 text-sm text-purple-800 dark:text-purple-400 hover:underline"
                >
                  Atualizar registro
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-3 flex-wrap mb-6">
                  {MOOD_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedMood(opt.value)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedMood === opt.value
                          ? 'border-purple-800 bg-purple-50 dark:bg-purple-950/30 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {selectedMood && (
                  <div className="mb-4 animate-slide-up">
                    <textarea
                      value={moodNote}
                      onChange={e => setMoodNote(e.target.value)}
                      placeholder="Como você está se sentindo? (opcional)"
                      className="input resize-none h-20 text-sm"
                    />
                  </div>
                )}

                {moodSaved ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-2 animate-fade-in">
                    <span>✅</span> Humor registrado com sucesso!
                  </div>
                ) : (
                  <button
                    onClick={handleSaveMood}
                    disabled={!selectedMood || savingMood}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingMood ? 'Salvando...' : 'Registrar Humor'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Por que o NexMente?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Uma plataforma criada especialmente para estudantes que precisam de suporte emocional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Seguro e Anônimo',
                desc: 'Compartilhe seus sentimentos com total privacidade. Nenhum dado é compartilhado sem seu consentimento.',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
              },
              {
                icon: Users,
                title: 'Comunidade Acolhedora',
                desc: 'Encontre pessoas que entendem você. Uma rede de apoio mútuo entre estudantes.',
                color: 'text-purple-700 bg-purple-50 dark:bg-purple-950/30',
              },
              {
                icon: Heart,
                title: 'Cuide da Sua Mente',
                desc: 'Dicas, técnicas e conteúdos para melhorar seu bem-estar emocional no dia a dia.',
                color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30',
              },
              {
                icon: Phone,
                title: 'Rede de Apoio',
                desc: 'Informações e contatos para ajuda especializada quando você mais precisar.',
                color: 'text-green-600 bg-green-50 dark:bg-green-950/30',
              },
            ].map(card => (
              <div key={card.title} className="card hover:shadow-md transition-shadow duration-200 group">
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Dê o primeiro passo hoje.
          </h2>
          <p className="text-purple-200 mb-8 text-lg">
            Crie sua conta gratuitamente e comece a cuidar da sua saúde mental.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={user ? '/termometro' : '/auth'} className="bg-white text-purple-800 font-semibold py-3 px-8 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2">
              {user ? 'Ver Meu Dashboard' : 'Criar Conta Grátis'}
              <ChevronRight size={18} />
            </Link>
            <Link to="/recursos" className="border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
              <BookOpen size={18} />
              Explorar Recursos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
