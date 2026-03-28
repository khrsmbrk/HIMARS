import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, User, Clock, Search, Filter, MoreVertical, ThumbsUp, MessageCircle, Share2, Pin, Image as ImageIcon, Trash2, X } from 'lucide-react';

interface Reply {
  id: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  image?: string;
}

interface Post {
  id: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
  isPinned?: boolean;
  likedBy: string[]; // Store user IDs who liked
  image?: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'Super Admin',
    role: 'BPH',
    content: 'Selamat pagi rekan-rekan pengurus. Mohon segera update laporan program kerja masing-masing departemen di Drive ya. Deadline akhir pekan ini.',
    timestamp: '2 jam yang lalu',
    likes: 12,
    replies: [
      { id: 101, author: 'Kharis Admin', role: 'BPH', content: 'Siap pak, segera kami update.', timestamp: '1 jam yang lalu' }
    ],
    isPinned: true,
    likedBy: []
  },
  {
    id: 2,
    author: 'Kharis Admin',
    role: 'BPH',
    content: 'Siap, untuk departemen Medkom sudah hampir selesai. Tinggal dokumentasi Milad kemarin yang masih proses upload.',
    timestamp: '1 jam yang lalu',
    likes: 5,
    replies: [],
    likedBy: []
  }
];

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'Terbaru' | 'Terlama' | 'Paling banyak komentar' | 'Paling aktif'>('Terbaru');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: (img: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !postImage) return;

    const post: Post = {
      id: Date.now(),
      author: currentUser.nama || 'Admin',
      role: currentUser.role === 'superadmin' ? 'BPH' : 'Pengurus',
      content: newPost,
      timestamp: 'Baru saja',
      likes: 0,
      replies: [],
      likedBy: [],
      image: postImage || undefined
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setPostImage(null);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked 
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    }));
  };

  const handleReply = (postId: number) => {
    if (!replyText.trim() && !replyImage) return;

    const reply: Reply = {
      id: Date.now(),
      author: currentUser.nama || 'Admin',
      role: currentUser.role === 'superadmin' ? 'BPH' : 'Pengurus',
      content: replyText,
      timestamp: 'Baru saja',
      image: replyImage || undefined
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, reply]
        };
      }
      return post;
    }));

    setReplyText('');
    setReplyImage(null);
    setReplyingTo(null);
  };

  const handlePin = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isPinned: !post.isPinned } : post
    ).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)));
    setActiveMenu(null);
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    setActiveMenu(null);
  };

  const handleDeleteReply = (postId: number, replyId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.filter(r => r.id !== replyId)
        };
      }
      return post;
    }));
  };

  const handleShare = async (text: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Forum Internal HIMARS',
          text: text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Teks disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    if (sortBy === 'Terbaru') return b.id - a.id;
    if (sortBy === 'Terlama') return a.id - b.id;
    if (sortBy === 'Paling banyak komentar') return b.replies.length - a.replies.length;
    if (sortBy === 'Paling aktif') {
      const lastActiveA = a.replies.length > 0 ? Math.max(...a.replies.map(r => r.id)) : a.id;
      const lastActiveB = b.replies.length > 0 ? Math.max(...b.replies.map(r => r.id)) : b.id;
      return lastActiveB - lastActiveA;
    }
    return 0;
  });

  return (
    <div className="p-8 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Forum Internal</h1>
          <p className="text-slate-500">Ruang diskusi dan koordinasi antar pengurus HIMARS.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari diskusi..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:border-himars-peach outline-none transition-all w-full md:w-64"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-600 hidden md:inline">Urut: {sortBy}</span>
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    {(['Terbaru', 'Terlama', 'Paling banyak komentar', 'Paling aktif'] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === option ? 'bg-himars-peach/10 text-himars-peach font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Post Input */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 mb-8 border border-slate-100">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-himars-peach/10 rounded-2xl flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-himars-peach" />
            </div>
            <div className="flex-1 space-y-4">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Apa yang ingin Anda diskusikan hari ini?"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-700 focus:bg-white focus:border-himars-peach outline-none transition-all resize-none h-32"
              />
              {postImage && (
                <div className="relative inline-block">
                  <img src={postImage} alt="Preview" className="h-32 rounded-xl object-cover border border-slate-200" />
                  <button 
                    type="button" 
                    onClick={() => setPostImage(null)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, setPostImage)}
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!newPost.trim() && !postImage}
                  className="px-6 py-2.5 bg-himars-peach text-white rounded-xl font-bold shadow-lg shadow-himars-peach/20 hover:bg-himars-peach/90 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> Kirim Diskusi
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        <AnimatePresence mode='popLayout'>
          {sortedPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-3xl shadow-lg shadow-slate-200/40 p-6 border ${post.isPinned ? 'border-himars-peach/30 bg-orange-50/10' : 'border-slate-100'}`}
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 relative">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800">{post.author}</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded">
                        {post.role}
                      </span>
                      {post.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-himars-peach uppercase">
                          <Pin className="h-3 w-3 fill-himars-peach" /> Tersemat
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </button>
                    
                    {/* Post Menu */}
                    <AnimatePresence>
                      {activeMenu === post.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-40 z-10"
                        >
                          <button 
                            onClick={() => handlePin(post.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Pin className="w-4 h-4" /> {post.isPinned ? 'Lepas Sematan' : 'Sematkan'}
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Hapus
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <Clock className="h-3 w-3" /> {post.timestamp}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  {post.image && (
                    <img src={post.image} alt="Post attachment" className="rounded-2xl max-h-96 object-cover mb-6 border border-slate-100" />
                  )}
                  
                  {/* Replies Section */}
                  {post.replies.length > 0 && (
                    <div className="mb-6 space-y-4 pl-4 border-l-2 border-slate-50">
                      {post.replies.map(reply => (
                        <div key={reply.id} className="bg-slate-50/50 p-3 rounded-2xl relative group">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-700 text-xs">{reply.author}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{reply.role}</span>
                            <span className="text-[9px] text-slate-300 ml-auto">{reply.timestamp}</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2">
                              <button onClick={() => handleShare(reply.content)} className="p-1 hover:bg-slate-200 rounded text-slate-400" title="Bagikan">
                                <Share2 className="w-3 h-3" />
                              </button>
                              <button onClick={() => handleDeleteReply(post.id, reply.id)} className="p-1 hover:bg-red-100 rounded text-red-500" title="Hapus">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{reply.content}</p>
                          {reply.image && (
                            <img src={reply.image} alt="Reply attachment" className="rounded-xl max-h-48 object-cover border border-slate-200" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors text-sm font-medium ${post.likedBy.includes(currentUser.id) ? 'text-himars-peach' : 'text-slate-400 hover:text-himars-peach'}`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${post.likedBy.includes(currentUser.id) ? 'fill-himars-peach' : ''}`} /> {post.likes} Suka
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-himars-peach transition-colors text-sm font-medium"
                    >
                      <MessageCircle className="h-4 w-4" /> {post.replies.length} Balasan
                    </button>
                    <button onClick={() => handleShare(post.content)} className="flex items-center gap-2 text-slate-400 hover:text-himars-peach transition-colors text-sm font-medium ml-auto">
                      <Share2 className="h-4 w-4" /> Bagikan
                    </button>
                  </div>

                  {/* Reply Input */}
                  <AnimatePresence>
                    {replyingTo === post.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        {replyImage && (
                          <div className="relative inline-block mb-2">
                            <img src={replyImage} alt="Preview" className="h-20 rounded-lg object-cover border border-slate-200" />
                            <button 
                              type="button" 
                              onClick={() => setReplyImage(null)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={replyFileInputRef}
                            onChange={(e) => handleImageUpload(e, setReplyImage)}
                          />
                          <button 
                            type="button" 
                            onClick={() => replyFileInputRef.current?.click()}
                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-500"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </button>
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Tulis balasan..."
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-himars-peach transition-all min-h-[80px] resize-y"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(post.id);
                              }
                            }}
                          />
                          <button 
                            onClick={() => handleReply(post.id)}
                            disabled={!replyText.trim() && !replyImage}
                            className="p-2 bg-himars-peach text-white rounded-xl disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
