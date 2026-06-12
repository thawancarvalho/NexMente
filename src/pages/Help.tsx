import { Phone, Heart, AlertCircle, ExternalLink, Clock, ChevronRight } from 'lucide-react';

const CRISIS_CONTACTS = [
  {
    name: 'CVV — Centro de Valorização da Vida',
    phone: '188',
    whatsapp: false,
    available: '24 horas, todos os dias',
    desc: 'Apoio emocional e prevenção do suicídio. Totalmente gratuito e sigiloso. Atendimento por telefone, chat e e-mail.',
    color: 'border-red-300 dark:border-red-700/50 bg-red-50 dark:bg-red-950/20',
    badgeColor: 'bg-red-600',
    icon: '🆘',
    primary: true,
  },
  {
    name: 'SAMU — Serviço de Atendimento Móvel de Urgência',
    phone: '192',
    available: '24 horas, emergências',
    desc: 'Atendimento de urgência e emergência médica, incluindo crises psiquiátricas que requerem atenção imediata.',
    color: 'border-orange-300 dark:border-orange-700/50 bg-orange-50 dark:bg-orange-950/20',
    badgeColor: 'bg-orange-600',
    icon: '🚑',
    primary: false,
  },
  {
    name: 'CAPS — Centro de Atenção Psicossocial',
    phone: 'Buscar unidade próxima',
    available: 'Horário comercial',
    desc: 'Atendimento gratuito de saúde mental pelo SUS. Conta com equipe multiprofissional de psicólogos, psiquiatras e assistentes sociais.',
    color: 'border-blue-300 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-950/20',
    badgeColor: 'bg-blue-600',
    icon: '🏥',
    primary: false,
  },
  {
    name: 'Conselho Federal de Psicologia',
    phone: '(61) 2109-0100',
    available: 'Horário comercial',
    desc: 'Para indicação de psicólogos, denúncias de irregularidades ou informações sobre atendimento psicológico na sua região.',
    color: 'border-purple-300 dark:border-purple-700/50 bg-purple-50 dark:bg-purple-950/20',
    badgeColor: 'bg-purple-700',
    icon: '📋',
    primary: false,
  },
];

const TIPS = [
  { emoji: '🗣️', title: 'Fale com alguém', desc: 'Conversar com um amigo, familiar ou profissional pode aliviar muito o peso emocional.' },
  { emoji: '🌬️', title: 'Respire fundo', desc: 'Técnicas de respiração ativam o sistema nervoso parassimpático e reduzem a ansiedade.' },
  { emoji: '🚶', title: 'Mude de ambiente', desc: 'Uma caminhada curta pode ajudar a quebrar o ciclo de pensamentos negativos.' },
  { emoji: '📝', title: 'Escreva o que sente', desc: 'Colocar os pensamentos no papel ajuda a processá-los e ganhar perspectiva.' },
  { emoji: '💧', title: 'Cuide do básico', desc: 'Água, alimentação e sono têm impacto direto no estado emocional.' },
  { emoji: '📱', title: 'Ligue para o CVV', desc: 'Se sentir que não consegue lidar sozinho, ligue para o 188. É gratuito e sigiloso.' },
];

export default function Help() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16">
      {/* Emergency Banner */}
      <div className="bg-red-600 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-white flex-shrink-0" />
            <p className="text-white font-semibold">Em risco imediato? Ligue agora:</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:188" className="bg-white text-red-600 font-bold px-6 py-2 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 text-lg">
              <Phone size={18} /> 188 — CVV
            </a>
            <a href="tel:192" className="border-2 border-white text-white font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors text-sm">
              192 — SAMU
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <section className="py-10 text-center">
          <div className="text-5xl mb-4">💜</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Você não está sozinho
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Buscar ajuda é um ato de coragem. Abaixo você encontra contatos de apoio emocional e saúde mental totalmente gratuitos.
          </p>
        </section>

        {/* Main CTA */}
        <div className="mb-8 p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl text-white text-center shadow-lg">
          <div className="text-4xl mb-3">🆘</div>
          <h2 className="text-2xl font-bold mb-2">Preciso de Ajuda Agora</h2>
          <p className="text-red-100 mb-4">Se você está passando por uma crise emocional, não enfrente isso sozinho.</p>
          <a
            href="tel:188"
            className="inline-flex items-center gap-3 bg-white text-red-600 font-bold text-xl py-3 px-8 rounded-2xl hover:bg-red-50 transition-colors shadow-md"
          >
            <Phone size={22} />
            Ligar para o CVV: 188
          </a>
          <div className="flex items-center justify-center gap-2 mt-3 text-red-100 text-sm">
            <Clock size={14} />
            Disponível 24 horas, 7 dias por semana — gratuito e sigiloso
          </div>
        </div>

        {/* Contacts */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Contatos de Apoio</h2>
          <div className="space-y-4">
            {CRISIS_CONTACTS.map(contact => (
              <div key={contact.name} className={`p-5 rounded-2xl border-2 ${contact.color} transition-shadow hover:shadow-md`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{contact.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{contact.name}</h3>
                      <span className="text-xs text-white px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: contact.badgeColor === 'bg-red-600' ? '#dc2626' : contact.badgeColor === 'bg-orange-600' ? '#ea580c' : contact.badgeColor === 'bg-blue-600' ? '#2563eb' : '#6D28D9' }}>
                        {contact.icon === '🆘' ? 'URGENTE' : contact.icon === '🚑' ? 'Emergência' : 'Gratuito'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{contact.desc}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                          <Phone size={15} />
                          {contact.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} />
                          {contact.available}
                        </div>
                      </div>
                      {contact.phone.match(/^\d/) && (
                        <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="btn-primary text-sm py-2 flex items-center gap-1.5">
                          <Phone size={14} /> Ligar agora
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">O que fazer em momentos difíceis</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map(tip => (
              <div key={tip.title} className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{tip.emoji}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-3xl border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3 mb-4">
            <Heart size={20} className="text-purple-800 dark:text-purple-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Use as ferramentas do NexMente</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: '/recursos', label: 'Exercícios de Respiração', icon: '🌬️' },
              { href: '/diario', label: 'Escrever no Diário', icon: '📖' },
              { href: '/comunidade', label: 'Desabafar na Comunidade', icon: '💬' },
            ].map(tool => (
              <a
                key={tool.href}
                href={tool.href}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all group"
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">{tool.label}</span>
                <ChevronRight size={14} className="text-gray-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          O NexMente não substitui acompanhamento psicológico ou psiquiátrico profissional.
          <a href="https://cfp.org.br" target="_blank" rel="noopener noreferrer" className="ml-1 text-purple-700 dark:text-purple-400 hover:underline inline-flex items-center gap-0.5">
            CFP <ExternalLink size={10} />
          </a>
        </p>
      </div>
    </div>
  );
}
