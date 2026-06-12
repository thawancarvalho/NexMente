# NexMente 🧠

Um espaço seguro para compartilhar sentimentos, cuidar da sua saúde mental e encontrar apoio emocional.

## 🚀 Features

- 💬 Comunidade ativa
- 📊 Dashboard com estatísticas
- 🔐 Autenticação segura com Supabase
- 📱 Responsivo e mobile-first
- ⚡ Construído com Next.js 15
- 🎨 Tailwind CSS
- 📈 Gráficos com Recharts

## 🛠️ Tecnologias

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Backend & Database
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📦 Instalação

```bash
npm install
```

## 🔑 Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏃 Executar Localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Build para Produção

```bash
npm run build
npm run start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Home
│   ├── globals.css         # Estilos globais
│   ├── dashboard/          # Dashboard
│   ├── community/          # Comunidade
│   └── auth/               # Autenticação
├── components/             # Componentes reutilizáveis
├── lib/                    # Utilitários e configuração
└── public/                 # Assets estáticos
```

## 🚀 Deploy

Este projeto é otimizado para deploy no **Vercel**. Basta conectar seu repositório GitHub ao Vercel dashboard e ele fará deploy automático!

## 📝 Próximas Etapas

- [ ] Integrar autenticação real com Supabase Auth
- [ ] Implementar banco de dados para posts
- [ ] Adicionar notificações
- [ ] Sistema de messaging
- [ ] Testes automatizados