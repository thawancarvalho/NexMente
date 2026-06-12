import { Heart, Shield, Users, Zap, BookOpen, Target, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-800 to-purple-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/ChatGPT_Image_3_de_jun._de_2026,_09_26_12.png"
              alt="NexMente"
              className="h-16 w-auto filter brightness-200"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Sobre o NexMente</h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Uma plataforma criada para promover saúde mental, acolhimento e apoio emocional para estudantes em todos os momentos.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        {/* Mission */}
        <section className="py-12 border-b border-gray-100 dark:border-gray-800">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Target size={14} />
                Nossa Missão
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Tecnologia a serviço do bem-estar emocional
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                O NexMente nasceu da compreensão de que estudantes enfrentam pressões únicas — acadêmicas, sociais e emocionais — que muitas vezes passam despercebidas ou sem suporte adequado.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Acreditamos que cuidar da saúde mental é tão importante quanto cuidar da saúde física. Nossa missão é tornar esse cuidado acessível, seguro e acolhedor para todos os estudantes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Heart, label: 'Acolhimento', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
                { icon: Shield, label: 'Privacidade', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
                { icon: Users, label: 'Comunidade', color: 'text-green-500 bg-green-50 dark:bg-green-950/20' },
                { icon: Zap, label: 'Acesso Fácil', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
              ].map(item => (
                <div key={item.label} className={`p-5 rounded-2xl ${item.color} border border-opacity-20`}>
                  <item.icon size={24} className="mb-2" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Nossos Valores</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🔒',
                title: 'Privacidade Total',
                desc: 'Seus dados são seus. Aplicamos as melhores práticas de segurança e nunca compartilhamos informações pessoais.',
              },
              {
                icon: '💜',
                title: 'Empatia em Primeiro',
                desc: 'Cada funcionalidade é pensada com empatia. Aqui não há julgamentos, apenas suporte.',
              },
              {
                icon: '🌱',
                title: 'Crescimento Contínuo',
                desc: 'Acreditamos na capacidade de cada pessoa de se conhecer melhor e desenvolver resiliência emocional.',
              },
            ].map(v => (
              <div key={v.title} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-12 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">O que oferecemos</h2>
          <div className="space-y-4">
            {[
              { icon: BookOpen, label: 'Diário Emocional Privado', desc: 'Registre seus pensamentos e sentimentos em um espaço seguro e totalmente privado.' },
              { icon: Users, label: 'Comunidade Anônima', desc: 'Compartilhe desabafos e receba apoio de pessoas que passam por situações similares.' },
              { icon: Heart, label: 'Termômetro Emocional', desc: 'Acompanhe sua evolução emocional com gráficos e estatísticas personalizadas.' },
              { icon: Zap, label: 'Recursos de Bem-estar', desc: 'Exercícios de respiração, meditações guiadas, frases motivacionais e mais.' },
              { icon: Shield, label: 'Rede de Apoio Profissional', desc: 'Informações sobre serviços de saúde mental gratuitos e acessíveis.' },
            ].map(feature => (
              <div key={feature.label} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center text-purple-800 dark:text-purple-400 flex-shrink-0">
                  <feature.icon size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5">{feature.label}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fale Conosco</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Tem sugestões, dúvidas ou quer contribuir com o projeto?
          </p>
          <a
            href="mailto:contato@nexmente.com.br"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <Mail size={18} />
            contato@nexmente.com.br
          </a>
          <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
            NexMente não substitui acompanhamento psicológico profissional.
            <br />Em situações de crise, ligue para o CVV: <strong className="text-gray-600 dark:text-gray-300">188</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
