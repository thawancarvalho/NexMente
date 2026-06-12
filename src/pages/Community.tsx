import { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Trash2, Send, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Post, Comment } from '../types';
import { formatDistanceToNow } from '../lib/dateUtils';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      const postIds = data.map(p => p.id);

      const [commentsRes, reactionsRes, userReactionsRes] = await Promise.all([
        supabase.from('comments').select('post_id').in('post_id', postIds),
        supabase.from('support_reactions').select('post_id').in('post_id', postIds),
        user
          ? supabase.from('support_reactions').select('post_id').eq('user_id', user.id).in('post_id', postIds)
          : Promise.resolve({ data: [] }),
      ]);

      const commentCounts: Record<string, number> = {};
      const reactionCounts: Record<string, number> = {};
      const userReacted = new Set<string>();

      commentsRes.data?.forEach(c => {
        commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1;
      });
      reactionsRes.data?.forEach(r => {
        reactionCounts[r.post_id] = (reactionCounts[r.post_id] || 0) + 1;
      });
      if (userReactionsRes.data) {
        userReactionsRes.data.forEach(r => userReacted.add(r.post_id));
      }

      setUserReactions(userReacted);
      setPosts(data.map(p => ({
        ...p,
        comments_count: commentCounts[p.id] || 0,
        likes_count: reactionCounts[p.id] || 0,
        user_has_reacted: userReacted.has(p.id),
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSubmitPost = async () => {
    if (!newPostContent.trim() || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from('posts').insert({ content: newPostContent.trim() });
    if (!error) {
      setNewPostContent('');
      setShowNewPost(false);
      await fetchPosts();
    }
    setSubmitting(false);
  };

  const handleReaction = async (postId: string) => {
    if (!user) return;
    const hasReacted = userReactions.has(postId);

    if (hasReacted) {
      await supabase.from('support_reactions').delete().eq('post_id', postId).eq('user_id', user.id);
      setUserReactions(prev => { const s = new Set(prev); s.delete(postId); return s; });
    } else {
      await supabase.from('support_reactions').insert({ post_id: postId });
      setUserReactions(prev => new Set([...prev, postId]));
    }

    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likes_count: hasReacted ? p.likes_count - 1 : p.likes_count + 1, user_has_reacted: !hasReacted }
        : p
    ));
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Deseja excluir este desabafo?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profile:profiles(id, nome, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (!error && data) setComments(prev => ({ ...prev, [postId]: data as Comment[] }));
  };

  const toggleComments = async (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!comments[postId]) await fetchComments(postId);
    }
  };

  const handleSubmitComment = async (postId: string) => {
    const content = newComments[postId];
    if (!content?.trim() || !user) return;
    setSubmittingComment(postId);
    const { error } = await supabase.from('comments').insert({ post_id: postId, content: content.trim() });
    if (!error) {
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      await fetchComments(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
    }
    setSubmittingComment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comunidade</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Um espaço seguro para desabafar anonimamente
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {showNewPost ? <X size={16} /> : <Plus size={16} />}
              {showNewPost ? 'Cancelar' : 'Desabafar'}
            </button>
          )}
        </div>

        {/* New Post Form */}
        {showNewPost && user && (
          <div className="card mb-6 animate-slide-up">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Como você está se sentindo?</h3>
            <textarea
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="Compartilhe seu desabafo aqui. Tudo que você escrever será publicado anonimamente..."
              className="input resize-none h-32 text-sm mb-3"
              maxLength={1000}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{newPostContent.length}/1000</span>
              <button
                onClick={handleSubmitPost}
                disabled={!newPostContent.trim() || submitting}
                className="btn-primary text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                Publicar
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="card mb-6 text-center bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Entre na sua conta para compartilhar seu desabafo e apoiar outros.
            </p>
            <a href="/auth" className="btn-primary text-sm inline-block">Entrar / Cadastrar</a>
          </div>
        )}

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <p>Seja o primeiro a compartilhar algo. 💜</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="card hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      A
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Anônimo</div>
                      <div className="text-xs text-gray-400">{formatDistanceToNow(post.created_at)}</div>
                    </div>
                  </div>
                  {user?.id === post.user_id && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleReaction(post.id)}
                    disabled={!user}
                    className={`flex items-center gap-1.5 text-sm transition-all hover:scale-105 ${
                      post.user_has_reacted
                        ? 'text-rose-500'
                        : 'text-gray-400 hover:text-rose-500'
                    } disabled:cursor-default`}
                  >
                    <Heart size={16} className={post.user_has_reacted ? 'fill-current' : ''} />
                    <span>{post.likes_count || 0} Apoiar</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span>{post.comments_count || 0} Comentários</span>
                    {expandedPost === post.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Comments */}
                {expandedPost === post.id && (
                  <div className="mt-4 space-y-3 animate-slide-up">
                    {(comments[post.id] || []).map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 text-xs font-bold flex-shrink-0">
                          {comment.profile?.nome?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {comment.profile?.nome || 'Usuário'}
                            </span>
                            <span className="text-xs text-gray-400">{formatDistanceToNow(comment.created_at)}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {user && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newComments[post.id] || ''}
                          onChange={e => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && handleSubmitComment(post.id)}
                          placeholder="Escreva um comentário de apoio..."
                          className="input text-sm py-2"
                        />
                        <button
                          onClick={() => handleSubmitComment(post.id)}
                          disabled={!newComments[post.id]?.trim() || submittingComment === post.id}
                          className="btn-primary text-sm py-2 px-3 flex items-center gap-1 disabled:opacity-50"
                        >
                          {submittingComment === post.id ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send size={14} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
