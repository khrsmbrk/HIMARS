import React, { useState, useMemo, useEffect } from 'react';
import { useData, Proker } from '../../store/DataContext';
import {
  Target, Plus, Search, Trash2, Edit2, Play, CheckCircle,
  Clock, AlertCircle, Calendar as CalendarIcon, ChevronLeft,
  ChevronRight, GripVertical, Info, Inbox, Zap, Share2,
  Mail, MessageSquare, Link as LinkIcon, User as UserIcon,
  Tag, FileText, ExternalLink, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ConfirmModal from '../../components/ConfirmModal';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

// --- Types ---
type Status = Proker['status'];

// --- Components ---

interface SortableItemProps {
  id: string;
  proker: Proker;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Status) => void;
  onEdit: (proker: Proker) => void;
  compact?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, proker, onDelete, onStatusChange, onEdit, compact }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const getDeptColor = (dept: string) => {
    switch (dept) {
      case 'BPH': return 'bg-amber-400';
      case 'Medkom': return 'bg-blue-400';
      case 'PSDM': return 'bg-emerald-400';
      case 'Kewirausahaan': return 'bg-orange-400';
      case 'Humas': return 'bg-purple-400';
      default: return 'bg-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Belum Mulai': return 'bg-amber-100 text-amber-600';
      case 'Sedang Berjalan': return 'bg-blue-100 text-blue-600';
      case 'Selesai': return 'bg-emerald-100 text-emerald-600';
      case 'Overdue': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white rounded-lg border border-slate-100 p-2 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing overflow-hidden ${proker.status === 'Overdue' ? 'border-red-200 bg-red-50/20' : ''}`}
      >
        <div className={`h-1 w-full rounded-full ${getDeptColor(proker.departemen)} mb-1.5`} />
        <p className="text-[9px] font-black text-himars-dark uppercase truncate leading-tight">
          {proker.namaProker}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all mb-3 cursor-default relative overflow-hidden ${proker.status === 'Overdue' ? 'border-red-200 bg-red-50/30' : ''}`}
    >
      {proker.status === 'Overdue' && (
        <div className="absolute top-0 right-0 px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-lg">
          Overdue
        </div>
      )}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-50 rounded">
            <GripVertical className="w-4 h-4 text-slate-300" />
          </div>
          <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
            {proker.departemen}
          </span>
        </div>
        <button 
          onClick={() => onDelete(proker.id)}
          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <h4 className="text-sm font-black text-himars-dark uppercase tracking-tight mb-2 line-clamp-2">
        {proker.namaProker}
      </h4>

      {proker.deskripsi && (
        <p className="text-[10px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">
          {proker.deskripsi}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {proker.labels?.map(label => (
          <span key={label} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase tracking-widest">
            {label}
          </span>
        ))}
        {proker.mirroredIn?.map(dept => (
          <span key={dept} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
            <Share2 className="w-2 h-2" /> {dept}
          </span>
        ))}
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>{proker.tanggalMulai}</span>
            </div>
            {proker.waktuMulai && (
              <div className="flex items-center gap-2 text-blue-500">
                <CalendarIcon className="w-3 h-3" />
                <span>{proker.waktuMulai} - {proker.waktuSelesai}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit(proker)}
              className="p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit Card"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => (window as any).openMirrorModal(proker.id)}
              className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
              title="Mirror to other boards"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            {proker.assignee && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-black">
                  {proker.assignee.charAt(0)}
                </div>
                <span className="text-[9px] font-black text-himars-dark uppercase tracking-tight">{proker.assignee}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {proker.status === 'Sedang Berjalan' && (
        <div className="mt-3 pt-3 border-t border-slate-50 flex justify-end">
          <button 
            onClick={() => onStatusChange(proker.id, 'Selesai')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
          >
            <CheckCircle className="w-3 h-3" /> Selesai
          </button>
        </div>
      )}
      {proker.status === 'Belum Mulai' && (
        <div className="mt-3 pt-3 border-t border-slate-50 flex justify-end">
          <button 
            onClick={() => onStatusChange(proker.id, 'Sedang Berjalan')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
          >
            <Play className="w-3 h-3" /> Mulai
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProkerAdmin() {
  const { 
    data, addProker, updateProkerStatus, deleteProker, updateProkerDates, 
    updateProkerDetails, addInboxItem, processInboxItem, toggleAutomationRule, runAutomations 
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [view, setView] = useState<'board' | 'calendar'>('board');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showMirrorModal, setShowMirrorModal] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Proker>>({});

  const departments = ['BPH', 'Medkom', 'PSDM', 'Kewirausahaan', 'Humas'];

  const handleToggleMirror = (prokerId: number, dept: string) => {
    const proker = data.proker.find(p => p.id === prokerId);
    if (!proker) return;

    const currentMirrors = proker.mirroredIn || [];
    const newMirrors = currentMirrors.includes(dept)
      ? currentMirrors.filter(m => m !== dept)
      : [...currentMirrors, dept];

    updateProkerDetails(prokerId, { mirroredIn: newMirrors });
  };

  const handleEditClick = (proker: Proker) => {
    setEditFormData(proker);
    setShowEditModal(proker.id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showEditModal) {
      updateProkerDetails(showEditModal, editFormData);
      setShowEditModal(null);
    }
  };

  // Run automations on mount
  useEffect(() => {
    runAutomations();
  }, [runAutomations]);

  // --- AI Processing Simulation ---
  const handleAIProcess = async (inboxId: number) => {
    setIsProcessingAI(true);
    try {
      const item = data.inbox.find(i => i.id === inboxId);
      if (!item) return;

      // Simulate Gemini AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiResult = {
        namaProker: item.title,
        deskripsi: item.content,
        departemen: 'BPH',
        ketuaPelaksana: 'AI Generated',
        tanggalMulai: new Date().toISOString().split('T')[0],
        tanggalSelesai: new Date().toISOString().split('T')[0],
        status: 'Belum Mulai' as Status,
        kpi: 'TBD',
        anggaran: 0,
        realisasi: 0,
        labels: ['AI', item.source],
        source: item.source
      };

      addProker(aiResult);
      processInboxItem(inboxId);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // --- Calendar State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    // Current month days
    for (let i = 1; i <= days; i++) {
      calendarDays.push(new Date(year, month, i));
    }
    return calendarDays;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  // --- DND Setup ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: { id: Status; title: string; color: string }[] = [
    { id: 'Belum Mulai', title: 'To Do', color: 'bg-amber-500' },
    { id: 'Sedang Berjalan', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'Selesai', title: 'Done', color: 'bg-emerald-500' },
    { id: 'Overdue', title: 'Overdue', color: 'bg-red-500' },
  ];

  const prokerByStatus = useMemo(() => {
    const filtered = data.proker.filter(p => 
      p.namaProker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.departemen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mirroredIn?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const getByStatus = (status: Status) => {
      return filtered.filter(p => p.status === status);
    };

    return {
      'Belum Mulai': getByStatus('Belum Mulai'),
      'Sedang Berjalan': getByStatus('Sedang Berjalan'),
      'Selesai': getByStatus('Selesai'),
      'Overdue': getByStatus('Overdue'),
    };
  }, [data.proker, searchTerm]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleStatusChange = async (id: number, status: Status) => {
    const proker = data.proker.find(p => p.id === id);
    if (proker) {
      await kirimKeSheet({
        nama_proker: proker.namaProker,
        status_baru: status,
        aksi: 'Update Status'
      }, 'Tracking Proker');
    }
    updateProkerStatus(id, status);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping on a calendar date
    if (overId.startsWith('date-')) {
      const dateStr = overId.replace('date-', '');
      const prokerId = parseInt(activeId.replace('proker-', ''));
      
      // Update proker date with default time 10:00 - 11:00 (1 hour duration)
      updateProkerDates(prokerId, dateStr, dateStr, '10:00', '11:00');
      return;
    }

    // Handle dropping on a column (status change)
    if (columns.some(col => col.id === overId)) {
      const prokerId = parseInt(activeId.replace('proker-', ''));
      const newStatus = overId as Status;
      await handleStatusChange(prokerId, newStatus);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  const [formData, setFormData] = useState({
    namaProker: '',
    departemen: 'BPH',
    ketuaPelaksana: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
    status: 'Belum Mulai' as Status,
    kpi: '',
    anggaran: 0,
    realisasi: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sync to Google Sheets
    await kirimKeSheet({
      nama_proker: formData.namaProker,
      departemen: formData.departemen,
      ketua_pelaksana: formData.ketuaPelaksana,
      tanggal_mulai: formData.tanggalMulai,
      status: formData.status,
      aksi: 'Tambah'
    }, 'Tracking Proker');

    addProker(formData);
    setShowAdd(false);
    setFormData({
      namaProker: '',
      departemen: 'BPH',
      ketuaPelaksana: '',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: new Date().toISOString().split('T')[0],
      status: 'Belum Mulai',
      kpi: '',
      anggaran: 0,
      realisasi: 0
    });
  };

  const activeProker = useMemo(() => {
    if (!activeId) return null;
    const id = parseInt(activeId.replace('proker-', ''));
    return data.proker.find(p => p.id === id);
  }, [activeId, data.proker]);

  // Expose mirror modal to child components
  useEffect(() => {
    (window as any).openMirrorModal = (id: number) => setShowMirrorModal(id);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Planner Proker</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Visualisasikan Agenda & Progres Program Kerja
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl mr-2 overflow-x-auto max-w-[500px]">
            {[
              { id: 'board', label: 'Board', icon: Target },
              { id: 'calendar', label: 'Planner', icon: CalendarIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                  view === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Proker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-xs w-64"
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" /> Tambah Proker
          </button>
        </div>
      </div>

      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-white" />
        </div>
        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest leading-relaxed">
          <span className="font-black">Tips:</span> Seret kartu dari board ke slot kalender untuk mengatur jadwal secara otomatis.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* --- Calendar View --- */}
          {view === 'calendar' && (
            <div className="xl:col-span-12">
              <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-black text-himars-dark uppercase tracking-tight">{monthName}</h2>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                      className="p-2 hover:bg-white rounded-lg transition-all text-slate-400"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                      className="p-2 hover:bg-white rounded-lg transition-all text-slate-400"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-7 mb-2">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                      <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 auto-rows-[minmax(120px,auto)]">
                    {daysInMonth.map((date, idx) => {
                      if (!date) return <div key={`empty-${idx}`} className="min-h-[120px] bg-slate-50/30 rounded-xl" />;
                      
                      const dateStr = date.toISOString().split('T')[0];
                      const isToday = dateStr === new Date().toISOString().split('T')[0];
                      const prokersOnThisDay = data.proker.filter(p => p.tanggalMulai === dateStr);

                      return (
                        <CalendarDay 
                          key={dateStr} 
                          date={date} 
                          isToday={isToday} 
                          prokers={prokersOnThisDay}
                          view={view}
                          onDelete={(id) => {
                            setItemToDelete(id);
                            setIsDeleteModalOpen(true);
                          }}
                          onStatusChange={handleStatusChange}
                          onEdit={handleEditClick}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Kanban Board --- */}
          {view === 'board' && (
            <div className="xl:col-span-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
                {columns.map(column => (
                  <KanbanColumn 
                    key={column.id} 
                    id={column.id} 
                    title={column.title} 
                    color={column.color}
                    prokers={prokerByStatus[column.id]}
                    onDelete={(id) => {
                      setItemToDelete(id);
                      setIsDeleteModalOpen(true);
                    }}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* --- Inbox View --- */}
          {view === 'inbox' && (
            <div className="xl:col-span-12">
              <div className="glass-ios rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <Inbox className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Inbox Capture</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tangkap ide & tugas dari mana saja</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => addInboxItem({ title: 'New Task from Slack', content: 'Membahas persiapan event bulan depan.', source: 'slack' })}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" /> Simulate Slack Capture
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.inbox.filter(i => !i.processed).length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
                      <Inbox className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest opacity-40">Inbox Kosong</p>
                    </div>
                  ) : (
                    data.inbox.filter(i => !i.processed).map(item => (
                      <div key={item.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                            item.source === 'slack' ? 'bg-purple-50 text-purple-600' : 
                            item.source === 'email' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {item.source === 'slack' ? <MessageSquare className="w-3 h-3" /> : 
                             item.source === 'email' ? <Mail className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                            {item.source}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <h3 className="text-sm font-black text-himars-dark uppercase tracking-tight mb-2">{item.title}</h3>
                        <p className="text-[10px] text-slate-500 mb-6 leading-relaxed">{item.content}</p>
                        <button 
                          onClick={() => handleAIProcess(item.id)}
                          disabled={isProcessingAI}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          {isProcessingAI ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                          AI Process to Board
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- Automation View --- */}
          {view === 'automation' && (
            <div className="xl:col-span-12">
              <div className="glass-ios rounded-[2.5rem] p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">No-Code Automation</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atur alur kerja otomatis tanpa kode</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.automations.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${rule.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-himars-dark uppercase tracking-tight">{rule.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Trigger: {rule.trigger.replace(/_/g, ' ')} → Action: {rule.action.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleAutomationRule(rule.id)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          rule.enabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-blue-400 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Create New Rule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- Integrations View --- */}
          {view === 'integration' && (
            <div className="xl:col-span-12">
              <div className="glass-ios rounded-[2.5rem] p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Power-Ups & Integrations</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hubungkan dengan aplikasi favorit Anda</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Slack', icon: MessageSquare, color: 'bg-purple-500', desc: 'Kirim notifikasi & tangkap pesan ke board.' },
                    { name: 'Microsoft Teams', icon: MessageSquare, color: 'bg-indigo-500', desc: 'Integrasi chat & kolaborasi tim.' },
                    { name: 'Google Drive', icon: LinkIcon, color: 'bg-emerald-500', desc: 'Lampirkan dokumen langsung ke card.' },
                    { name: 'Email Forwarding', icon: Mail, color: 'bg-blue-500', desc: 'Forward email ke inbox khusus board.' },
                    { name: 'GitHub', icon: ExternalLink, color: 'bg-slate-900', desc: 'Sinkronisasi issue & pull requests.' },
                  ].map(app => (
                    <div key={app.name} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${app.color} flex items-center justify-center text-white`}>
                          <app.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-black text-himars-dark uppercase tracking-tight">{app.name}</h3>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-6 flex-1 leading-relaxed">{app.desc}</p>
                      <button className="w-full py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeId && activeProker ? (
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-4 shadow-2xl w-64 rotate-3 scale-105 cursor-grabbing">
              <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 mb-2 inline-block">
                {activeProker.departemen}
              </span>
              <h4 className="text-sm font-black text-himars-dark uppercase tracking-tight mb-2">
                {activeProker.namaProker}
              </h4>
              <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{activeProker.tanggalMulai}</span>
                </div>
                {activeProker.waktuMulai && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{activeProker.waktuMulai} - {activeProker.waktuSelesai}</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal Tambah Proker */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-himars-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-ios rounded-[3rem] p-10 max-w-md w-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Tambah Proker</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Program Kerja</label>
                  <input type="text" required value={formData.namaProker} onChange={e => setFormData({...formData, namaProker: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" placeholder="Contoh: Seminar Nasional Kesehatan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Departemen</label>
                    <select value={formData.departemen} onChange={e => setFormData({...formData, departemen: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm">
                      <option value="BPH">BPH</option>
                      <option value="Medkom">Medkom</option>
                      <option value="PSDM">PSDM</option>
                      <option value="Kewirausahaan">Kewirausahaan</option>
                      <option value="Humas">Humas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ketua Pelaksana</label>
                    <input type="text" required value={formData.ketuaPelaksana} onChange={e => setFormData({...formData, ketuaPelaksana: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Mulai</label>
                    <input type="date" required value={formData.tanggalMulai} onChange={e => setFormData({...formData, tanggalMulai: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Selesai</label>
                    <input type="date" required value={formData.tanggalSelesai} onChange={e => setFormData({...formData, tanggalSelesai: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">KPI / Target Keberhasilan</label>
                  <textarea required value={formData.kpi} onChange={e => setFormData({...formData, kpi: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm min-h-[100px]" placeholder="Contoh: Diikuti oleh minimal 200 peserta dari berbagai universitas..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Anggaran (Rp)</label>
                  <input type="number" min="0" required value={formData.anggaran} onChange={e => setFormData({...formData, anggaran: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all mt-4">Simpan Proker</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Mirror Modal --- */}
      <AnimatePresence>
        {showMirrorModal !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMirrorModal(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Card Mirroring</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tampilkan card ini di board lain</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {departments.map(dept => {
                  const proker = data.proker.find(p => p.id === showMirrorModal);
                  const isMain = proker?.departemen === dept;
                  const isMirrored = proker?.mirroredIn?.includes(dept);

                  return (
                    <button
                      key={dept}
                      disabled={isMain}
                      onClick={() => handleToggleMirror(showMirrorModal, dept)}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isMain ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' :
                        isMirrored ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isMain ? 'bg-slate-300' : isMirrored ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                        <span className="text-xs font-black uppercase tracking-tight">{dept}</span>
                      </div>
                      {isMain ? (
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Main Board</span>
                      ) : isMirrored ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowMirrorModal(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Edit Modal --- */}
      <AnimatePresence>
        {showEditModal !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-ios rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-white/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Edit Proker</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Program Kerja</label>
                  <input type="text" required value={editFormData.namaProker} onChange={e => setEditFormData({...editFormData, namaProker: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Deskripsi</label>
                  <textarea value={editFormData.deskripsi} onChange={e => setEditFormData({...editFormData, deskripsi: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Assignee</label>
                    <input type="text" value={editFormData.assignee} onChange={e => setEditFormData({...editFormData, assignee: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Departemen</label>
                    <select value={editFormData.departemen} onChange={e => setEditFormData({...editFormData, departemen: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm">
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all mt-4">Update Card</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (itemToDelete) {
            deleteProker(itemToDelete);
          }
        }}
        title="Hapus Program Kerja"
        message="Apakah Anda yakin ingin menghapus program kerja ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}

// --- Helper Components ---

import { useDroppable } from '@dnd-kit/core';

const KanbanColumn: React.FC<{ 
  id: Status; 
  title: string; 
  color: string; 
  prokers: Proker[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Status) => void;
  onEdit: (proker: Proker) => void;
}> = ({ id, title, color, prokers, onDelete, onStatusChange, onEdit }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h3 className="text-xs font-black text-himars-dark uppercase tracking-widest">{title}</h3>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[9px] font-bold">
            {prokers.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 rounded-[2rem] p-4 transition-all ${
          isOver ? 'bg-blue-50/50 border-2 border-dashed border-blue-200' : 'bg-slate-50/30 border border-transparent'
        }`}
      >
        <SortableContext 
          id={id}
          items={prokers.map(p => `proker-${p.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {prokers.map(p => (
            <SortableItem 
              key={p.id} 
              id={`proker-${p.id}`} 
              proker={p} 
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>
        
        {prokers.length === 0 && !isOver && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
            <Target className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Kosong</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CalendarDay: React.FC<{ 
  date: Date; 
  isToday: boolean; 
  prokers: Proker[];
  view: 'board' | 'calendar';
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Status) => void;
  onEdit: (proker: Proker) => void;
}> = ({ date, isToday, prokers, view, onDelete, onStatusChange, onEdit }) => {
  const dateStr = date.toISOString().split('T')[0];
  const { setNodeRef, isOver } = useDroppable({ id: `date-${dateStr}` });

  const getDeptColor = (dept: string) => {
    switch (dept) {
      case 'BPH': return 'bg-amber-400';
      case 'Medkom': return 'bg-blue-400';
      case 'PSDM': return 'bg-emerald-400';
      case 'Kewirausahaan': return 'bg-orange-400';
      case 'Humas': return 'bg-purple-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`${view === 'calendar' ? 'min-h-[120px]' : 'aspect-square'} rounded-xl border p-1 transition-all relative group ${
        isToday ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100'
      } ${
        isOver ? 'bg-emerald-100 border-emerald-300 scale-[1.02] z-10 shadow-lg' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[10px] font-black ${isToday ? 'text-emerald-600' : 'text-slate-400'}`}>
          {date.getDate()}
        </span>
      </div>
      
      <div className="flex flex-col gap-1">
        {prokers.map(p => (
          view === 'calendar' ? (
            <SortableItem 
              key={p.id} 
              id={`proker-${p.id}`} 
              proker={p} 
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              compact
            />
          ) : (
            <div 
              key={p.id} 
              className={`w-full h-1.5 rounded-full ${getDeptColor(p.departemen)} shadow-sm`} 
              title={p.namaProker}
            />
          )
        ))}
      </div>

      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 rounded-xl">
          <Plus className="w-4 h-4 text-emerald-600 animate-pulse" />
        </div>
      )}
    </div>
  );
};

