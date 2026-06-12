import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Heart, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'register' | 'forgot';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'register') {
      if (!nome.trim()) { setError('Por favor, informe seu nome.'); setLoading(false); return; }
      if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); setLoading(false); return; }
      const { error } = await signUp(email, password, nome);
      if (error) {
        if (error.message.includes('already registered')) setError('Este e-mail já está cadastrado.');
        else setError('Erro ao criar conta. Tente novamente.');
      } else {
        navigate('/');
      }
    } else if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login')) setError('E-mail ou senha incorretos.');
        else setError('Erro ao entrar. Tente novamente.');
      } else {
        navigate('/');
      }
    } else {
      setSuccess('Se este e-mail estiver cadastrado, você receberá as instruções em breve.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-800 dark:hover:text-purple-400 transition-colors mb-6">
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart size={28} className="text-white fill-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' && 'Bem-vindo de volta'}
            {mode === 'register' && 'Criar sua conta'}
            {mode === 'forgot' && 'Recuperar senha'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {mode === 'login' && 'Entre na sua conta NexMente'}
            {mode === 'register' && 'Junte-se à nossa comunidade'}
            {mode === 'forgot' && 'Informe seu e-mail para redefinir'}
          </p>
        </div>

        <div className="card shadow-xl">
          {/* Mode Tabs */}
          {mode !== 'forgot' && (
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-purple-800 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-purple-800 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Cadastrar
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">Nome completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="label">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                    className="input pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); }}
                  className="text-sm text-purple-800 dark:text-purple-400 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm animate-fade-in">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 text-sm animate-fade-in">
                ✅ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Aguarde...
                </span>
              ) : (
                <>
                  {mode === 'login' && 'Entrar'}
                  {mode === 'register' && 'Criar Conta Grátis'}
                  {mode === 'forgot' && 'Enviar instruções'}
                </>
              )}
            </button>
          </form>

          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="mt-4 w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-800 dark:hover:text-purple-400 transition-colors"
            >
              ← Voltar para o login
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Ao continuar, você concorda com nossos termos de uso e política de privacidade.
          <br />Sua privacidade é nossa prioridade. 💜
        </p>
      </div>
    </div>
  );
}
