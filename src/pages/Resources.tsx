import { useState } from 'react';
import { Wind, Music, Quote, BookOpen, Phone, Heart, ChevronRight, Play, Pause } from 'lucide-react';
import { DAILY_PHRASES } from '../types';

const BREATHING_STEPS = [
  { label: 'Inspire', duration: 4, color: 'from-blue-400 to-blue-600' },
  { label: 'Segure', duration: 4, color: 'from-purple-400 to-purple-700' },
  { label: 'Expire', duration: 6, color: 'from-green-400 to-green-600' },
  { label: 'Descanse', duration: 2, color: 'from-gray-300 to-gray-500' },
];

const MEDITATION_SESSIONS = [
  { title: 'Respiração Consciente', duration: '5 min', desc: 'Acalme a mente com técnicas de respiração profunda.', icon: '🌬️' },
  { title: 'Relaxamento Progressivo', duration: '10 min', desc: 'Relaxe grupos musculares progressivamente.', icon: '🧘' },
  { title: 'Meditação do Presente', duration: '7 min', desc: 'Foque no momento presente e reduza a ansiedade.', icon: '✨' },
  { title: 'Visualização Positiva', duration: '8 min', desc: 'Crie imagens mentais de bem-estar e sucesso.', icon: '🌈' },
];

const MUSIC_PLAYLISTS = [
  { title: 'Lo-Fi para Estudar', mood: 'Foco', icon: '🎵', desc: 'Música ambiente relaxante para concentração.' },
  { title: 'Sons da Natureza', mood: 'Calma', icon: '🌿', desc: 'Chuva, floresta e água para relaxamento.' },
  { title: 'Música Clássica', mood: 'Paz', icon: '🎻', desc: 'Composições clássicas para acalmar a mente.' },
  { title: 'Frequências de Cura', mood: 'Bem-estar', icon: '🔔', desc: 'Frequências binaurais para meditação.' },
];

type Tab = 'breathing' | 'meditation' | 'phrases' | 'music' | 'diary' | 'help';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'breathing', label: 'Respiração', icon: Wind },
  { id: 'meditation', label: 'Meditação', icon: Heart },
  { id: 'phrases', label: 'Frases', icon: Quote },
  { id: 'music', label: 'Músicas', icon: Music },
  { id: 'diary', label: 'Diário', icon: BookOpen },
  { id: 'help', label: 'Apoio', icon: Phone },
];

function BreathingExercise() {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [count, setCount] = useState(0);

  const start = () => {
    setActive(true);
    setStepIdx(0);
    setCount(0);
    runStep(0, 0);
  };

  const stop = () => { setActive(false); setStepIdx(0); setCount(0); };

  const runStep = (idx: number, c: number) => {
    const step = BREATHING_STEPS[idx];
    if (c < step.duration) {
      setCount(c + 1);
      setTimeout(() => runStep(idx, c + 1), 1000);
    } else {
      const next = (idx + 1) % BREATHING_STEPS.length;
      setStepIdx(next);
      setTimeout(() => runStep(next, 0), 100);
    }
  };

  const step = BREATHING_STEPS[stepIdx];
  const progress = active ? ((count / step.duration) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Exercício de Respiração 4-4-6</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-md">
        Inspire por 4 segundos, segure por 4 segundos, expire por 6 segundos. Este ciclo ativa o sistema nervoso parassimpático.
      </p>

      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44"
            fill="none" stroke={active ? '#6D28D9' : '#d8b4fe'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl mb-1">{active ? ['🌬️', '🤚', '😮‍💨', '😌'][stepIdx] : '🫁'}</span>
          {active && (
            <>
              <span className="text-lg font-bold text-purple-800 dark:text-purple-300">{step.label}</span>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{step.duration - count}</span>
            </>
          )}
        </div>
      </div>

      {active ? (
        <button onClick={stop} className="btn-secondary flex items-center gap-2">
          <Pause size={16} /> Pausar
        </button>
      ) : (
        <button onClick={start} className="btn-primary flex items-center gap-2">
          <Play size={16} /> Iniciar Exercício
        </button>
      )}

      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {BREATHING_STEPS.map((s, i) => (
          <div key={s.label} className={`text-center p-3 rounded-xl transition-all ${active && stepIdx === i ? 'bg-purple-100 dark:bg-purple-950/30 ring-2 ring-purple-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className="text-lg font-bold text-purple-800 dark:text-purple-400">{s.duration}s</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState<Tab>('breathing');
  const [phraseIdx, setPhraseIdx] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recursos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ferramentas e conteúdos para seu bem-estar emocional</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
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

        <div className="card animate-fade-in">
          {activeTab === 'breathing' && <BreathingExercise />}

          {activeTab === 'meditation' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Meditação Guiada</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {MEDITATION_SESSIONS.map(session => (
                  <div key={session.title} className="group p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer hover:shadow-md">
                    <div className="text-3xl mb-3">{session.icon}</div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{session.title}</h4>
                      <span className="text-xs text-purple-800 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full">{session.duration}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{session.desc}</p>
                    <button className="flex items-center gap-2 text-sm font-medium text-purple-800 dark:text-purple-400 group-hover:gap-3 transition-all">
                      <Play size={14} /> Iniciar sessão <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Dica:</strong> Para melhores resultados, medite no mesmo horário todos os dias. Apenas 5-10 minutos já fazem diferença!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'phrases' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Frases Motivacionais</h3>
              <div className="text-center py-8 px-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-2xl mb-6">
                <div className="text-5xl mb-4">💜</div>
                <blockquote className="text-xl font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed mb-4">
                  "{DAILY_PHRASES[phraseIdx]}"
                </blockquote>
                <button
                  onClick={() => setPhraseIdx((phraseIdx + 1) % DAILY_PHRASES.length)}
                  className="btn-primary text-sm"
                >
                  Próxima frase
                </button>
              </div>
              <div className="grid gap-3">
                {DAILY_PHRASES.map((phrase, i) => (
                  <div
                    key={i}
                    onClick={() => setPhraseIdx(i)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      phraseIdx === i
                        ? 'bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-300 dark:border-purple-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">"{phrase}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Músicas Relaxantes</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {MUSIC_PLAYLISTS.map(playlist => (
                  <div key={playlist.title} className="group p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{playlist.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{playlist.title}</h4>
                          <span className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">{playlist.mood}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{playlist.desc}</p>
                        <button className="flex items-center gap-2 text-sm font-medium text-purple-800 dark:text-purple-400">
                          <Play size={14} /> Ouvir playlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-2xl">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  🎧 Use fones de ouvido para uma experiência mais imersiva e relaxante.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'diary' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Diário Emocional</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Escrever sobre seus sentimentos é uma das práticas mais eficazes para processamento emocional e autoconhecimento.
              </p>
              <a href="/diario" className="btn-primary inline-flex items-center gap-2">
                <BookOpen size={16} />
                Ir para o Diário
              </a>
            </div>
          )}

          {activeTab === 'help' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Onde Buscar Ajuda</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Recursos profissionais de saúde mental gratuitos e acessíveis.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'CVV', phone: '188', desc: 'Centro de Valorização da Vida. Atendimento 24h para situações de crise emocional.', color: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30', badge: '24h' },
                  { name: 'SAMU', phone: '192', desc: 'Serviço de Atendimento Móvel de Urgência. Emergências médicas e psiquiátricas.', color: 'bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30', badge: 'Urgência' },
                  { name: 'CAPS', phone: 'Buscar local', desc: 'Centro de Atenção Psicossocial. Atendimento gratuito em saúde mental.', color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30', badge: 'Gratuito' },
                  { name: 'Psicólogo', phone: 'CFP: (61) 2109-0100', desc: 'Conselho Federal de Psicologia. Indicações de profissionais próximos a você.', color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30', badge: 'Profissional' },
                ].map(service => (
                  <div key={service.name} className={`p-5 rounded-2xl border ${service.color}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{service.name}</h4>
                      <span className="text-xs font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">{service.badge}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{service.desc}</p>
                    <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-semibold">
                      <Phone size={15} />
                      {service.phone}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-center">
                <p className="font-semibold text-rose-700 dark:text-rose-300 mb-2">Em crise? Não espere.</p>
                <p className="text-sm text-rose-600 dark:text-rose-400">Ligue agora para o CVV: <strong>188</strong></p>
                <a href="/ajuda" className="mt-3 inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-rose-700 transition-colors">
                  <Phone size={15} /> Ver todos os contatos
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
