import React, { useState } from 'react';
import { useData, HomeSection } from '../../store/DataContext';
import { Save, Globe, Shield, Layout, GripVertical, Eye, EyeOff, X, Plus, Trash2, Youtube, Play, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  key: string;
  section: HomeSection;
  onToggle: (id: string) => void;
}

function SortableSectionItem({ section, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white border ${isDragging ? 'border-himars-peach shadow-lg' : 'border-slate-100'} rounded-2xl mb-3 transition-all`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h4 className="font-black text-himars-dark uppercase tracking-tight text-sm">{section.title}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{section.id}</p>
      </div>

      <button
        type="button"
        onClick={() => onToggle(section.id)}
        className={`p-3 rounded-xl transition-all ${
          section.enabled 
            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
        }`}
      >
        {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function Settings() {
  const { data, updateSettings, updateHomeSections } = useData();
  const [formData, setFormData] = useState({ ...data.settings });
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'layout' | 'organisasi' | 'media' | 'legal' | 'content' | 'surat'>('general');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formData.homeSections.findIndex((s) => s.id === active.id);
      const newIndex = formData.homeSections.findIndex((s) => s.id === over.id);
      
      const newSections = arrayMove(formData.homeSections, oldIndex, newIndex);
      setFormData({ ...formData, homeSections: newSections });
      updateHomeSections(newSections);
    }
  };

  const toggleSection = (id: string) => {
    const newSections = formData.homeSections.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    setFormData({ ...formData, homeSections: newSections });
    updateHomeSections(newSections);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Pengaturan Web</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Kustomisasi Identitas & Tata Letak</p>
      </div>

      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'general' ? 'bg-white text-himars-dark shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Umum
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'layout' ? 'bg-white text-himars-dark shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> Tata Letak
        </button>
        <button
          onClick={() => setActiveTab('organisasi')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'organisasi' ? 'bg-white text-himars-dark shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Organisasi
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'media' ? 'bg-white text-himars-dark shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Media
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'content' ? 'bg-white text-himars-dark shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> Konten
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'legal' ? 'bg-white text-himars-dark shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Legal
        </button>
        <button
          onClick={() => setActiveTab('surat')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'surat' ? 'bg-white text-himars-dark shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Surat
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' ? (
          <motion.form 
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {/* Identity Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Globe className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Identitas Website</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Organisasi</label>
                    <input
                      type="text"
                      value={formData.siteName}
                      onChange={e => setFormData({...formData, siteName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Logo Website</label>
                    <div className="flex items-center gap-4">
                      {formData.logoUrl && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-white">
                          <img src={formData.logoUrl || undefined} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                          <Plus className="w-4 h-4" /> Unggah Logo Baru
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData({...formData, logoUrl: event.target?.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Deskripsi Singkat</label>
                  <textarea
                    rows={3}
                    value={formData.siteDescription}
                    onChange={e => setFormData({...formData, siteDescription: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Member Format Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Shield className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Format Data Anggota</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Format QR Code / ID Anggota</label>
                  <input
                    type="text"
                    value={formData.memberIdFormat}
                    onChange={e => setFormData({...formData, memberIdFormat: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-mono text-sm"
                    placeholder="ORG-{YEAR}-{RAND}"
                  />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">
                    Gunakan placeholder: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-himars-peach">{"{YEAR}"}</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-himars-peach">{"{TIME}"}</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-himars-peach">{"{RAND}"}</code>
                  </p>
                </div>
                <div className="p-6 bg-himars-peach/5 rounded-3xl border border-himars-peach/10">
                  <h4 className="text-[10px] font-black text-himars-peach uppercase tracking-[0.2em] mb-3">Preview Format</h4>
                  <p className="text-lg font-black text-himars-dark tracking-tight">
                    {formData.memberIdFormat
                      .replace('{YEAR}', new Date().getFullYear().toString())
                      .replace('{TIME}', Date.now().toString().slice(-6))
                      .replace('{RAND}', 'ABCDE')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <AnimatePresence>
                {isSaved && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    Pengaturan Berhasil Disimpan!
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                type="submit"
                className="ml-auto inline-flex items-center px-8 py-4 bg-himars-dark text-white rounded-2xl hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 transition-all active:scale-95"
              >
                <Save className="w-5 h-5 mr-3" />
                Simpan Perubahan
              </button>
            </div>
          </motion.form>
        ) : activeTab === 'layout' ? (
          <motion.div
            key="layout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Layout className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Tata Letak Beranda</h2>
              </div>
              <div className="p-8">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                  Tarik dan lepas untuk mengatur urutan bagian di halaman beranda. Gunakan ikon mata untuk menampilkan atau menyembunyikan bagian tersebut.
                </p>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={formData.homeSections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {formData.homeSections.map((section) => (
                      <SortableSectionItem 
                        key={section.id} 
                        section={section} 
                        onToggle={toggleSection}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'organisasi' ? (
          <motion.div
            key="organisasi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-himars-peach" />
                  <h2 className="font-black text-himars-dark uppercase tracking-tight">Formatur Kepengurusan</h2>
                </div>
                <button 
                  onClick={() => {
                    const newFormatur = [{ id: Date.now().toString(), nama: '', jabatan: '' }, ...formData.formatur];
                    setFormData({ ...formData, formatur: newFormatur });
                  }}
                  className="px-4 py-2 bg-himars-peach text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Tambah Personil
                </button>
              </div>
              <div className="p-8 space-y-4">
                {formData.formatur.map((person, index) => (
                  <div key={person.id} className="flex gap-4 items-end p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
                          <input
                            type="text"
                            value={person.nama}
                            onChange={e => {
                              const newFormatur = [...formData.formatur];
                              newFormatur[index].nama = e.target.value;
                              setFormData({ ...formData, formatur: newFormatur });
                            }}
                            className="w-full px-4 py-2.5 bg-white border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Jabatan</label>
                          <input
                            type="text"
                            value={person.jabatan}
                            onChange={e => {
                              const newFormatur = [...formData.formatur];
                              newFormatur[index].jabatan = e.target.value;
                              setFormData({ ...formData, formatur: newFormatur });
                            }}
                            className="w-full px-4 py-2.5 bg-white border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Departemen (Opsional)</label>
                          <input
                            type="text"
                            value={person.departemen || ''}
                            onChange={e => {
                              const newFormatur = [...formData.formatur];
                              newFormatur[index].departemen = e.target.value;
                              setFormData({ ...formData, formatur: newFormatur });
                            }}
                            className="w-full px-4 py-2.5 bg-white border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Foto Pengurus</label>
                        <div className="flex items-center gap-4">
                          {person.foto && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white">
                              <img src={person.foto || undefined} alt={person.nama} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <label className="flex-1 cursor-pointer">
                            <div className="px-4 py-2 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                              <Plus className="w-3 h-3" /> Unggah Foto
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const newFormatur = [...formData.formatur];
                                    newFormatur[index].foto = event.target?.result as string;
                                    setFormData({ ...formData, formatur: newFormatur });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newFormatur = formData.formatur.filter((_, i) => i !== index);
                        setFormData({ ...formData, formatur: newFormatur });
                      }}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl"
                >
                  Simpan Struktur Organisasi
                </button>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'media' ? (
          <motion.div
            key="media"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Globe className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Media & Sosial</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Official YouTube Channel</label>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    placeholder="https://www.youtube.com/@channel"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Featured Video / Podcast (Embed URL)</label>
                  <input
                    type="text"
                    value={formData.podcastUrl}
                    onChange={e => setFormData({...formData, podcastUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Gunakan URL embed (misal: https://www.youtube.com/embed/VIDEO_ID)</p>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl"
                >
                  Simpan Media
                </button>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'content' ? (
          <motion.form 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {/* Hero Section CMS */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Layout className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Konten Hero (Beranda)</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Judul Hero</label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Sub-judul Hero</label>
                  <textarea
                    rows={3}
                    value={formData.heroSubtitle}
                    onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Gambar Background Hero</label>
                  <div className="flex items-center gap-4">
                    {formData.heroImageUrl && (
                      <div className="w-20 h-12 rounded-xl overflow-hidden border border-slate-100 bg-white">
                        <img src={formData.heroImageUrl || undefined} alt="Hero" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                        <Plus className="w-4 h-4" /> Ganti Gambar Hero
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFormData({...formData, heroImageUrl: event.target?.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Visi Misi CMS */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Shield className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Visi & Misi (Beranda)</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Judul Visi Misi</label>
                  <input
                    type="text"
                    value={formData.visiMisiTitle}
                    onChange={e => setFormData({...formData, visiMisiTitle: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Teks Visi Misi</label>
                  <textarea
                    rows={3}
                    value={formData.visiMisiText}
                    onChange={e => setFormData({...formData, visiMisiText: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Gambar Visi Misi</label>
                  <div className="flex items-center gap-4">
                    {formData.visiMisiImageUrl && (
                      <div className="w-20 h-12 rounded-xl overflow-hidden border border-slate-100 bg-white">
                        <img src={formData.visiMisiImageUrl || undefined} alt="Visi Misi" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                        <Plus className="w-4 h-4" /> Ganti Gambar Visi Misi
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFormData({...formData, visiMisiImageUrl: event.target?.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillars CMS */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Layout className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Gambar Pilar Utama</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pilar {idx + 1}</label>
                      <div className="space-y-4">
                        {formData.pillarImages[idx] && (
                          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-100 bg-white">
                            <img src={formData.pillarImages[idx] || undefined} alt={`Pillar ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="block cursor-pointer">
                          <div className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                            <Plus className="w-4 h-4" /> Ganti
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const newPillars = [...formData.pillarImages];
                                  newPillars[idx] = event.target?.result as string;
                                  setFormData({...formData, pillarImages: newPillars});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Sections Images */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Layout className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Gambar Header Halaman Lain</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Hero Struktur', key: 'strukturHeroImageUrl' },
                    { label: 'Hero Berita/Blog', key: 'blogHeroImageUrl' },
                    { label: 'Hero Dokumen', key: 'dokumenHeroImageUrl' },
                    { label: 'Hero Profil Prodi', key: 'profilHeroImageUrl' }
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</label>
                      <div className="space-y-4">
                        {formData[item.key as keyof typeof formData] && (
                          <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-white">
                            <img src={(formData[item.key as keyof typeof formData] as string) || undefined} alt={item.label} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="block cursor-pointer">
                          <div className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                            <Plus className="w-4 h-4" /> Ganti {item.label}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setFormData({...formData, [item.key]: event.target?.result as string});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Sections Images */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Layout className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Gambar Seksi Lainnya</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Gambar Program Kerja</label>
                    <div className="space-y-4">
                      {formData.prokerImageUrl && (
                        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-white">
                          <img src={formData.prokerImageUrl || undefined} alt="Proker" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="block cursor-pointer">
                        <div className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                          <Plus className="w-4 h-4" /> Ganti Gambar Proker
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData({...formData, prokerImageUrl: event.target?.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Gambar Kontak/Footer</label>
                    <div className="space-y-4">
                      {formData.kontakImageUrl && (
                        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-white">
                          <img src={formData.kontakImageUrl || undefined} alt="Kontak" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="block cursor-pointer">
                        <div className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-himars-peach transition-colors flex items-center justify-center gap-2 text-slate-500 font-bold text-xs">
                          <Plus className="w-4 h-4" /> Ganti Gambar Kontak
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData({...formData, kontakImageUrl: event.target?.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <AnimatePresence>
                {isSaved && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    Konten Berhasil Disimpan!
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                type="submit"
                className="ml-auto inline-flex items-center px-8 py-4 bg-himars-dark text-white rounded-2xl hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 transition-all active:scale-95"
              >
                <Save className="w-5 h-5 mr-3" />
                Simpan Konten
              </button>
            </div>
          </motion.form>
        ) : activeTab === 'legal' ? (
          <motion.div
            key="legal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <FileText className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Halaman Legal</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kebijakan Privasi</label>
                  <textarea
                    rows={10}
                    value={formData.privacyPolicy}
                    onChange={e => setFormData({...formData, privacyPolicy: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm resize-y"
                    placeholder="Masukkan konten Kebijakan Privasi..."
                  />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Dukung format teks biasa. Baris baru akan diubah menjadi paragraf.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Syarat & Ketentuan</label>
                  <textarea
                    rows={10}
                    value={formData.termsConditions}
                    onChange={e => setFormData({...formData, termsConditions: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm resize-y"
                    placeholder="Masukkan konten Syarat & Ketentuan..."
                  />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Dukung format teks biasa. Baris baru akan diubah menjadi paragraf.</p>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl"
                >
                  Simpan Halaman Legal
                </button>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'surat' ? (
          <motion.form 
            key="surat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <FileText className="w-6 h-6 text-himars-peach" />
                <h2 className="font-black text-himars-dark uppercase tracking-tight">Pengaturan Surat</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kop Surat (Upload Gambar)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'kopSuratUrl')}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-himars-peach/10 file:text-himars-peach hover:file:bg-himars-peach/20"
                  />
                  {formData.kopSuratUrl && (
                    <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden relative group">
                      <img src={formData.kopSuratUrl} alt="Kop Surat" className="w-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, kopSuratUrl: ''})}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tanda Tangan Digital (Upload Gambar PNG Transparan)</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={e => handleImageUpload(e, 'tandaTanganUrl')}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-himars-peach/10 file:text-himars-peach hover:file:bg-himars-peach/20"
                  />
                  {formData.tandaTanganUrl && (
                    <div className="mt-4 w-32 h-32 border border-slate-200 rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 relative group">
                      <img src={formData.tandaTanganUrl} alt="Tanda Tangan" className="max-w-full max-h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, tandaTanganUrl: ''})}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Stempel Digital (Upload Gambar PNG Transparan)</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={e => handleImageUpload(e, 'stempelUrl')}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-himars-peach/10 file:text-himars-peach hover:file:bg-himars-peach/20"
                  />
                  {formData.stempelUrl && (
                    <div className="mt-4 w-32 h-32 border border-slate-200 rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 relative group">
                      <img src={formData.stempelUrl} alt="Stempel" className="max-w-full max-h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, stempelUrl: ''})}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan Surat
            </button>
          </motion.form>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
