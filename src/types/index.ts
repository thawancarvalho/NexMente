export type MoodValue = 'very_good' | 'good' | 'neutral' | 'sad' | 'very_sad';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodValue;
  note: string | null;
  created_at: string;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  titulo: string;
  conteudo: string;
  emocao: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  profile?: Profile;
  comments_count?: number;
  user_has_reacted?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export interface SupportReaction {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export const MOOD_OPTIONS: { value: MoodValue; emoji: string; label: string; color: string; score: number }[] = [
  { value: 'very_good', emoji: '😀', label: 'Muito Bem', color: '#22c55e', score: 5 },
  { value: 'good', emoji: '🙂', label: 'Bem', color: '#84cc16', score: 4 },
  { value: 'neutral', emoji: '😐', label: 'Normal', color: '#eab308', score: 3 },
  { value: 'sad', emoji: '🙁', label: 'Triste', color: '#f97316', score: 2 },
  { value: 'very_sad', emoji: '😢', label: 'Muito Mal', color: '#ef4444', score: 1 },
];

export const EMOTION_OPTIONS = [
  'Alegria', 'Gratidão', 'Calma', 'Esperança', 'Amor',
  'Ansiedade', 'Tristeza', 'Raiva', 'Medo', 'Frustração',
  'Confusão', 'Cansaço', 'Solidão', 'Empolgação', 'Orgulho',
];

export const DAILY_PHRASES = [
  'Tudo bem não estar bem o tempo todo.',
  'Seus sentimentos são válidos e importam.',
  'Você é mais forte do que imagina.',
  'Cada dia é uma nova oportunidade de recomeçar.',
  'Cuidar de você não é egoísmo, é necessidade.',
  'Pequenos passos também te levam longe.',
  'Você não precisa ter tudo resolvido agora.',
  'Pedir ajuda é um ato de coragem.',
  'O progresso não precisa ser perfeito.',
  'Você merece amor e cuidado — inclusive de você mesmo.',
  'Respire. Este momento também vai passar.',
  'Sua história importa. Você importa.',
  'Não compare sua jornada com a dos outros.',
  'Descansar também é produtivo.',
  'Você está fazendo o melhor que pode, e isso é suficiente.',
];
