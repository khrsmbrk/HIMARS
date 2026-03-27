import React, { useState, useRef, useMemo } from 'react';
import { useData, DriveItem, ActivityLog } from '../../store/DataContext';
import { 
  Folder, 
  File, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Download, 
  ChevronRight, 
  Search, 
  Grid, 
  List, 
  ArrowLeft,
  Image as ImageIcon,
  Video,
  FileText,
  FolderPlus,
  Upload,
  Cloud,
  XCircle,
  Share2,
  Clock,
  RotateCcw,
  Trash,
  Info,
  Calendar,
  StickyNote,
  CheckSquare,
  Users,
  Link as LinkIcon,
  Filter,
  UserPlus,
  Settings,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../../components/ConfirmModal';

type NavTab = 'my-drive' | 'shared' | 'trash' | 'activity';

export default function DriveAdmin() {
  const { 
    data, 
    addDriveItem, 
    trashDriveItem, 
    restoreDriveItem, 
    permanentlyDeleteDriveItem, 
    renameDriveItem, 
    moveDriveItem,
    shareDriveItem,
    toggleDrivePublicLink
  } = useData();
  
  const usedStorage = data.drive.reduce((acc, item) => acc + (item.size || 0), 0);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  const [activeTab, setActiveTab] = useState<NavTab>('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    type: 'all',
    dateRange: 'all'
  });

  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [itemToManage, setItemToManage] = useState<DriveItem | null>(null);
  
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);

  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('folder');
  const [newItemName, setNewItemName] = useState('');
  const [actionStatus, setActionStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on active tab and search
  const filteredItems = useMemo(() => {
    let items = data.drive;

    if (activeTab === 'my-drive') {
      items = items.filter(i => !i.isTrashed && i.parentId === currentFolderId && i.ownerId === currentUser.id);
    } else if (activeTab === 'shared') {
      items = items.filter(i => !i.isTrashed && (i.permissions.some(p => p.userId === currentUser.id) || i.isPublicLink));
    } else if (activeTab === 'trash') {
      items = items.filter(i => i.isTrashed && i.ownerId === currentUser.id);
    }

    if (searchQuery) {
      items = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (searchFilters.type !== 'all') {
      if (searchFilters.type === 'folder') items = items.filter(i => i.type === 'folder');
      else items = items.filter(i => i.mimeType?.includes(searchFilters.type));
    }

    return items.sort((a, b) => b.timestamp - a.timestamp);
  }, [data.drive, activeTab, currentFolderId, searchQuery, searchFilters, currentUser.id]);

  const breadcrumbs = useMemo(() => {
    const crumbs = [];
    let tempId = currentFolderId;
    while (tempId) {
      const folder = data.drive.find(i => i.id === tempId);
      if (folder) {
        crumbs.unshift(folder);
        tempId = folder.parentId;
      } else break;
    }
    return crumbs;
  }, [currentFolderId, data.drive]);

  const handleCreate = () => {
    if (!newItemName) return;
    addDriveItem({
      name: newItemName,
      type: newItemType,
      parentId: currentFolderId,
      department: currentUser.department || 'all',
      createdBy: currentUser.nama,
      ownerId: currentUser.id,
      mimeType: newItemType === 'file' ? 'application/octet-stream' : undefined,
      size: newItemType === 'file' ? 0 : undefined,
    });
    setIsCreateModalOpen(false);
    setNewItemName('');
    setActionStatus({ message: 'Item berhasil dibuat', type: 'success' });
    setTimeout(() => setActionStatus(null), 3000);
  };

  const uploadFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      addDriveItem({
        name: file.name,
        type: 'file',
        parentId: currentFolderId,
        department: currentUser.department || 'all',
        createdBy: currentUser.nama,
        ownerId: currentUser.id,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        url: URL.createObjectURL(file) // For demo purposes
      });
    });
    setActionStatus({ message: `${files.length} file berhasil diupload`, type: 'success' });
    setTimeout(() => setActionStatus(null), 3000);
  };

  const getFileIcon = (item: DriveItem) => {
    if (item.type === 'folder') return <Folder className="w-10 h-10 text-amber-400 fill-amber-400" />;
    
    const name = item.name.toLowerCase();
    const mime = item.mimeType?.toLowerCase() || '';

    if (mime.includes('image') || name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) 
      return <ImageIcon className="w-10 h-10 text-orange-500" />;
    
    if (mime.includes('video') || name.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/)) 
      return <Video className="w-10 h-10 text-red-500" />;
    
    if (mime.includes('pdf') || name.endsWith('.pdf')) 
      return <FileText className="w-10 h-10 text-red-400" />;
    
    if (mime.includes('word') || mime.includes('officedocument.wordprocessingml') || name.match(/\.(doc|docx)$/))
      return <FileText className="w-10 h-10 text-blue-500" />;
    
    if (mime.includes('excel') || mime.includes('officedocument.spreadsheetml') || name.match(/\.(xls|xlsx|csv)$/))
      return <FileText className="w-10 h-10 text-emerald-600" />;
    
    if (mime.includes('presentation') || mime.includes('officedocument.presentationml') || name.match(/\.(ppt|pptx)$/))
      return <FileText className="w-10 h-10 text-orange-600" />;

    return <FileText className="w-10 h-10 text-slate-400" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '--';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-slate-50 -m-8 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header / Search */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 gap-4">
          {/* Top Bar Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                className="p-2.5 bg-himars-peach text-white rounded-xl shadow-sm hover:shadow-md transition-all group"
                title="Buat baru"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
              <AnimatePresence>
                {isNewMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsNewMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[110] overflow-hidden"
                    >
                      <button 
                        onClick={() => { setIsNewMenuOpen(false); setNewItemType('folder'); setIsCreateModalOpen(true); }}
                        className="w-full px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                      >
                        <FolderPlus className="w-5 h-5 text-amber-400" /> Folder Baru
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button 
                        onClick={() => { setIsNewMenuOpen(false); fileInputRef.current?.click(); }}
                        className="w-full px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                      >
                        <Upload className="w-5 h-5 text-himars-peach" /> Upload File
                      </button>
                      <button 
                        className="w-full px-4 py-3 text-left text-sm font-bold text-slate-400 cursor-not-allowed flex items-center gap-3"
                      >
                        <FolderPlus className="w-5 h-5" /> Upload Folder
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => { setActiveTab('my-drive'); setCurrentFolderId(null); }}
              className={`p-2.5 rounded-xl transition-colors ${activeTab === 'my-drive' ? 'bg-himars-peach/10 text-himars-peach' : 'text-slate-600 hover:bg-slate-50'}`}
              title="Drive saya"
            >
              <HardDrive className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab('trash')}
              className={`p-2.5 rounded-xl transition-colors ${activeTab === 'trash' ? 'bg-himars-peach/10 text-himars-peach' : 'text-slate-600 hover:bg-slate-50'}`}
              title="Sampah"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full mx-auto relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-himars-peach transition-colors" />
              <input 
                type="text" 
                placeholder="Telusuri di Drive" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-2.5 bg-slate-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-himars-peach/20 outline-none transition-all text-sm font-medium"
              />
              <button 
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Advanced Search Dropdown */}
            <AnimatePresence>
              {showAdvancedSearch && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-[100]"
                >
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Penelusuran Lanjutan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jenis File</label>
                      <select 
                        value={searchFilters.type}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-2 bg-slate-50 rounded-lg text-xs outline-none"
                      >
                        <option value="all">Semua Jenis</option>
                        <option value="folder">Folder</option>
                        <option value="image">Gambar</option>
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Terakhir Diubah</label>
                      <select 
                        value={searchFilters.dateRange}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                        className="w-full p-2 bg-slate-50 rounded-lg text-xs outline-none"
                      >
                        <option value="all">Kapan saja</option>
                        <option value="today">Hari ini</option>
                        <option value="week">Minggu ini</option>
                        <option value="month">Bulan ini</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 gap-2">
                    <button 
                      onClick={() => {
                        setSearchFilters({ type: 'all', dateRange: 'all' });
                        setShowAdvancedSearch(false);
                      }}
                      className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase hover:bg-slate-50 rounded-lg"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setShowAdvancedSearch(false)}
                      className="px-4 py-2 bg-himars-peach text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-himars-peach/20"
                    >
                      Terapkan
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {/* Settings and Profile removed as requested */}
          </div>
        </header>

        {/* Action Bar */}
        <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <button 
              onClick={() => { setActiveTab('my-drive'); setCurrentFolderId(null); }}
              className="hover:text-himars-peach transition-colors flex items-center"
              title={activeTab === 'my-drive' ? 'Drive Saya' : activeTab === 'trash' ? 'Sampah' : activeTab === 'shared' ? 'Dibagikan' : 'Aktivitas'}
            >
              {activeTab === 'my-drive' ? <HardDrive className="w-4 h-4" /> : activeTab === 'trash' ? <Trash2 className="w-4 h-4" /> : activeTab === 'shared' ? <Users className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </button>
            {activeTab === 'my-drive' && breadcrumbs.map((folder) => (
              <React.Fragment key={folder.id}>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <button 
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="hover:text-himars-peach transition-colors"
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg mr-4">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-himars-peach' : 'text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-himars-peach' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-full transition-colors ${showDetails ? 'text-himars-peach' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Tampilkan detail"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'activity' ? (
            <div className="w-full mx-auto space-y-8">
              <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Riwayat Aktivitas</h2>
              {data.activityLogs.filter(log => log.action.includes('Folder') || log.action.includes('File') || log.action.includes('Item')).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                  <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada aktivitas terbaru</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.activityLogs
                    .filter(log => log.action.includes('Folder') || log.action.includes('File') || log.action.includes('Item') || log.action.includes('Nama') || log.action.includes('Sampah'))
                    .map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        {log.action.includes('Upload') ? <Upload className="w-4 h-4 text-emerald-500" /> :
                         log.action.includes('Membuat') ? <Plus className="w-4 h-4 text-blue-500" /> :
                         log.action.includes('Hapus') ? <Trash2 className="w-4 h-4 text-red-500" /> :
                         log.action.includes('Pindahkan') ? <ArrowLeft className="w-4 h-4 text-amber-500" /> :
                         <Clock className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">{log.details}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {log.timestamp} • Oleh {log.nama}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                {activeTab === 'trash' ? <Trash2 className="w-12 h-12 text-slate-200" /> : <Folder className="w-12 h-12 text-slate-200" />}
              </div>
              <h3 className="text-lg font-black text-himars-dark uppercase tracking-tight">
                {activeTab === 'trash' ? 'Sampah Kosong' : 'Belum ada item di sini'}
              </h3>
              <p className="text-slate-400 text-sm font-medium mt-2 max-w-xs">
                {activeTab === 'trash' ? 'Item yang Anda hapus akan muncul di sini.' : 'Gunakan tombol + di pojok kiri atas untuk menambahkan folder atau file.'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredItems.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    if (item.type === 'folder' && !item.isTrashed) setCurrentFolderId(item.id);
                  }}
                  className={`group relative bg-white p-6 rounded-[2rem] border transition-all cursor-pointer ${selectedItem?.id === item.id ? 'border-himars-peach ring-2 ring-himars-peach/10 shadow-lg' : 'border-slate-100 hover:shadow-xl hover:-translate-y-1'}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 transition-transform group-hover:scale-110">
                      {getFileIcon(item)}
                    </div>
                    <span className="text-[11px] font-black text-himars-dark uppercase tracking-tight truncate w-full px-2">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {item.type === 'file' ? formatSize(item.size) : 'Folder'}
                    </span>
                  </div>

                  {/* Context Menu Trigger */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative group/menu">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-[110]">
                        {activeTab === 'trash' ? (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); restoreDriveItem(item.id); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" /> Pulihkan
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setItemToManage(item); setIsDeleteModalOpen(true); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash className="w-4 h-4" /> Hapus Permanen
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setItemToManage(item); setIsShareModalOpen(true); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Share2 className="w-4 h-4" /> Bagikan
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setItemToManage(item); setIsMoveModalOpen(true); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <ArrowLeft className="w-4 h-4" /> Pindahkan
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); trashDriveItem(item.id); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemilik</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Terakhir Diubah</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ukuran</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredItems.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => {
                        setSelectedItem(item);
                        if (item.type === 'folder' && !item.isTrashed) setCurrentFolderId(item.id);
                      }}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer group ${selectedItem?.id === item.id ? 'bg-himars-peach/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.type === 'folder' ? <Folder className="w-5 h-5 text-amber-400" /> : <File className="w-5 h-5 text-slate-400" />}
                          <span className="text-sm font-bold text-himars-dark">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {item.createdBy[0]}
                          </div>
                          <span className="text-xs font-medium text-slate-500">{item.createdBy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.updatedAt}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{formatSize(item.size)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {activeTab === 'trash' ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); restoreDriveItem(item.id); }} className="p-2 text-slate-400 hover:text-himars-peach hover:bg-himars-peach/5 rounded-lg"><RotateCcw className="w-4 h-4" /></button>
                              <button onClick={(e) => { e.stopPropagation(); setItemToManage(item); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash className="w-4 h-4" /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setItemToManage(item); setIsShareModalOpen(true); }} className="p-2 text-slate-400 hover:text-himars-peach hover:bg-himars-peach/5 rounded-lg"><Share2 className="w-4 h-4" /></button>
                              <button onClick={(e) => { e.stopPropagation(); trashDriveItem(item.id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Right Details Panel removed as requested */}

      {/* Modals */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Folder Baru</h2>
              <input 
                type="text" 
                autoFocus
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nama folder"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-himars-peach outline-none font-bold text-sm mb-6"
              />
              <div className="flex gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest">Batal</button>
                <button onClick={handleCreate} className="flex-1 py-4 bg-himars-peach text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-himars-peach/20">Buat</button>
              </div>
            </motion.div>
          </div>
        )}

        {isShareModalOpen && itemToManage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShareModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-2">Bagikan "{itemToManage.name}"</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Kelola akses dan izin</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tambah Orang</label>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                      onChange={(e) => {
                        const userId = parseInt(e.target.value);
                        if (userId) shareDriveItem(itemToManage.id, userId, 'viewer');
                      }}
                    >
                      <option value="">Pilih pengguna...</option>
                      {data.users.filter(u => u.id !== currentUser.id && !itemToManage.permissions.some(p => p.userId === u.id)).map(u => (
                        <option key={u.id} value={u.id}>{u.nama} ({u.username})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Orang yang memiliki akses</label>
                  <div className="max-h-40 overflow-auto space-y-2 pr-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-himars-peach text-white flex items-center justify-center text-[10px] font-black">{itemToManage.createdBy[0]}</div>
                        <span className="text-xs font-bold text-slate-700">{itemToManage.createdBy} (Anda)</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pemilik</span>
                    </div>
                    {itemToManage.permissions.map(p => {
                      const user = data.users.find(u => u.id === p.userId);
                      return (
                        <div key={p.userId} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-black">{user?.nama[0]}</div>
                            <span className="text-xs font-bold text-slate-700">{user?.nama}</span>
                          </div>
                          <select 
                            value={p.role}
                            onChange={(e) => shareDriveItem(itemToManage.id, p.userId, e.target.value as 'viewer' | 'editor')}
                            className="bg-transparent text-[10px] font-bold text-himars-peach uppercase outline-none"
                          >
                            <option value="viewer">Pelihat</option>
                            <option value="editor">Editor</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Akses Umum</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-himars-peach/10 text-himars-peach rounded-lg">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Link Internal Organisasi</p>
                        <p className="text-[10px] text-slate-400 font-medium">{itemToManage.isPublicLink ? 'Siapa saja di organisasi dengan link dapat melihat' : 'Dibatasi'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleDrivePublicLink(itemToManage.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${itemToManage.isPublicLink ? 'bg-himars-peach text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {itemToManage.isPublicLink ? 'Aktif' : 'Aktifkan'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={() => setIsShareModalOpen(false)} className="px-8 py-3 bg-himars-peach text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-himars-peach/20">Selesai</button>
              </div>
            </motion.div>
          </div>
        )}

        {isMoveModalOpen && itemToManage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMoveModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Pindahkan Item</h2>
              <div className="space-y-2 max-h-64 overflow-auto mb-6 pr-2">
                <button 
                  onClick={() => { moveDriveItem(itemToManage.id, null); setIsMoveModalOpen(false); }}
                  className="w-full p-4 rounded-2xl border border-slate-100 hover:border-himars-peach hover:bg-himars-peach/5 transition-all text-left flex items-center gap-3"
                >
                  <HardDrive className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">Drive Saya</span>
                </button>
                {data.drive.filter(i => i.type === 'folder' && i.id !== itemToManage.id && !i.isTrashed).map(folder => (
                  <button 
                    key={folder.id}
                    onClick={() => { moveDriveItem(itemToManage.id, folder.id); setIsMoveModalOpen(false); }}
                    className="w-full p-4 rounded-2xl border border-slate-100 hover:border-himars-peach hover:bg-himars-peach/5 transition-all text-left flex items-center gap-3"
                  >
                    <Folder className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold text-slate-700">{folder.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setIsMoveModalOpen(false)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest">Batal</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setItemToManage(null); }}
        onConfirm={() => {
          if (itemToManage) {
            permanentlyDeleteDriveItem(itemToManage.id);
            setActionStatus({ message: 'Item dihapus permanen', type: 'success' });
            setTimeout(() => setActionStatus(null), 3000);
          }
        }}
        title="Hapus Permanen"
        message="Apakah Anda yakin ingin menghapus item ini secara permanen? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && uploadFiles(e.target.files)} 
        multiple 
        className="hidden" 
      />
    </div>
  );
}
