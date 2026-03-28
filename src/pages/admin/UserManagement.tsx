import React from 'react';
import { useData } from '../../store/DataContext';
import { Trash2, Shield, User as UserIcon, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../../components/ConfirmModal';

export default function UserManagement() {
  const { data, deleteUser, updateUserRole, updateUserDepartment, resetUserPassword, addActivityLog } = useData();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const pendingUsers = data.users.filter(u => u.role === 'member');
  
  const activeUsers = data.users.filter(u => u.role !== 'member').sort((a, b) => {
    const getOrder = (user: any) => {
      if (user.role === 'superadmin') return 1;
      if (user.role === 'admin') {
        if (user.department === 'pembina') return 2;
        return 1;
      }
      if (user.department === 'pembina') return 2;
      return 3;
    };
    return getOrder(a) - getOrder(b);
  });

  const departments = [
    { id: 'pembina', title: 'Pembina' },
    { id: 'ketua-wakil', title: 'Ketua & Wakil' },
    { id: 'sekretaris', title: 'Sekretaris' },
    { id: 'bendahara', title: 'Bendahara' },
    { id: 'penak', title: 'PENAK' },
    { id: 'litbang', title: 'Litbang' },
    { id: 'pengmas', title: 'PENGAPMAS' },
    { id: 'medkom', title: 'Medkom' },
  ];

  const [actionStatus, setActionStatus] = React.useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const UserTable = ({ users, title, showAccept = false }: { users: typeof data.users, title: string, showAccept?: boolean }) => (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {title}
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{users.length}</span>
        </h2>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Username / Email</th>
                {!showAccept && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Departemen</th>}
                {!showAccept && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NIM</th>}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Terdaftar</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={showAccept ? 4 : 6} className="px-6 py-10 text-center text-slate-400 italic">
                    Tidak ada data pengguna
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-500'}`}>
                          {user.role === 'admin' || user.role === 'superadmin' ? <ShieldCheck className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.nama}</div>
                          {user.id === currentUser.id && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-bold uppercase">Anda</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{user.username}</td>
                    {!showAccept && (
                      <td className="px-6 py-4">
                        {user.username === 'himars' || user.username === 'kharis@alishlah.sch.id' || user.role === 'superadmin' ? (
                          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                            Administrator
                          </span>
                        ) : user.role === 'admin' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-100 px-2 py-1 rounded-lg border border-orange-200">
                              Admin
                            </span>
                            <select
                              required
                              value={user.department || ''}
                              onChange={async (e) => {
                                if (!e.target.value) return;
                                
                                updateUserDepartment(user.id, e.target.value);
                                addActivityLog({
                                  userId: currentUser.id,
                                  username: currentUser.username,
                                  nama: currentUser.nama,
                                  action: 'Update User',
                                  details: `Admin ${currentUser.nama} memperbarui departemen ${user.nama} menjadi ${e.target.value}.`
                                });
                                setActionStatus({ message: `Departemen ${user.nama} diperbarui.`, type: 'success' });
                                setTimeout(() => setActionStatus(null), 3000);
                              }}
                              className="text-xs font-bold bg-slate-50 border-none rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Pilih Departemen</option>
                              {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.title}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-1 rounded-lg border border-blue-200">
                              Anggota
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              {user.department || '-'}
                            </span>
                          </div>
                        )}
                      </td>
                    )}
                    {!showAccept && (
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{user.nim || '-'}</td>
                    )}
                    <td className="px-6 py-4 text-sm text-slate-500">{user.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.id !== currentUser.id && (
                          <>
                            {showAccept && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={async () => {
                                    updateUserRole(user.id, 'admin');
                                    addActivityLog({
                                      userId: currentUser.id,
                                      username: currentUser.username,
                                      nama: currentUser.nama,
                                      action: 'Approve User',
                                      details: `Admin ${currentUser.nama} menyetujui pendaftaran ${user.nama} sebagai Admin.`
                                    });
                                    setActionStatus({ message: `${user.nama} telah disetujui sebagai Admin.`, type: 'success' });
                                    setTimeout(() => setActionStatus(null), 3000);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all active:scale-95 shadow-sm shadow-emerald-100"
                                >
                                  <ShieldCheck className="w-4 h-4 mr-1" /> Terima
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmAction({
                                      title: 'Tolak Pendaftaran',
                                      message: `Apakah Anda yakin ingin menolak pendaftaran ${user.nama}?`,
                                      onConfirm: async () => {
                                        deleteUser(user.id);
                                        addActivityLog({
                                          userId: currentUser.id,
                                          username: currentUser.username,
                                          nama: currentUser.nama,
                                          action: 'Reject User',
                                          details: `Admin ${currentUser.nama} menolak pendaftaran ${user.nama}.`
                                        });
                                        setActionStatus({ message: `Pendaftaran ${user.nama} telah ditolak.`, type: 'success' });
                                        setTimeout(() => setActionStatus(null), 3000);
                                      }
                                    });
                                    setIsConfirmModalOpen(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-all active:scale-95"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" /> Tolak
                                </button>
                              </div>
                            )}
                            {!showAccept && user.role === 'admin' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setConfirmAction({
                                      title: 'Cabut Akses Admin',
                                      message: `Apakah Anda yakin ingin mencabut akses Admin dari ${user.nama}?`,
                                      onConfirm: async () => {
                                        updateUserRole(user.id, 'anggota');
                                        addActivityLog({
                                          userId: currentUser.id,
                                          username: currentUser.username,
                                          nama: currentUser.nama,
                                          action: 'Revoke Admin',
                                          details: `Admin ${currentUser.nama} mencabut akses Admin dari ${user.nama}.`
                                        });
                                        setActionStatus({ message: `Akses Admin ${user.nama} telah dicabut.`, type: 'success' });
                                        setTimeout(() => setActionStatus(null), 3000);
                                      }
                                    });
                                    setIsConfirmModalOpen(true);
                                  }}
                                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Turunkan ke Anggota"
                                >
                                  <ShieldAlert className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmAction({
                                      title: 'Hapus Akun',
                                      message: `Apakah Anda yakin ingin menghapus akun ${user.nama}?`,
                                      onConfirm: async () => {
                                        deleteUser(user.id);
                                        addActivityLog({
                                          userId: currentUser.id,
                                          username: currentUser.username,
                                          nama: currentUser.nama,
                                          action: 'Delete User',
                                          details: `Admin ${currentUser.nama} menghapus akun ${user.nama}.`
                                        });
                                        setActionStatus({ message: `Akun ${user.nama} telah dihapus.`, type: 'success' });
                                        setTimeout(() => setActionStatus(null), 3000);
                                      }
                                    });
                                    setIsConfirmModalOpen(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus Akun"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                            {!showAccept && user.role === 'anggota' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setConfirmAction({
                                      title: 'Reset Password',
                                      message: `Apakah Anda yakin ingin mereset password ${user.nama} ke default (NIM)?`,
                                      onConfirm: () => {
                                        resetUserPassword(user.id);
                                        addActivityLog({
                                          userId: currentUser.id,
                                          username: currentUser.username,
                                          nama: currentUser.nama,
                                          action: 'Reset Password',
                                          details: `Admin ${currentUser.nama} mereset password ${user.nama}.`
                                        });
                                        setActionStatus({ message: `Password ${user.nama} telah direset ke NIM.`, type: 'success' });
                                        setTimeout(() => setActionStatus(null), 3000);
                                      }
                                    });
                                    setIsConfirmModalOpen(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all active:scale-95"
                                >
                                  Reset Password
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmAction({
                                      title: 'Hapus Akun',
                                      message: `Apakah Anda yakin ingin menghapus akun ${user.nama}?`,
                                      onConfirm: async () => {
                                        deleteUser(user.id);
                                        addActivityLog({
                                          userId: currentUser.id,
                                          username: currentUser.username,
                                          nama: currentUser.nama,
                                          action: 'Delete User',
                                          details: `Admin ${currentUser.nama} menghapus akun ${user.nama}.`
                                        });
                                        setActionStatus({ message: `Akun ${user.nama} telah dihapus.`, type: 'success' });
                                        setTimeout(() => setActionStatus(null), 3000);
                                      }
                                    });
                                    setIsConfirmModalOpen(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus Akun"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500 mt-1">Kelola hak akses admin dan verifikasi pendaftaran anggota baru</p>
        </div>
        <AnimatePresence>
          {actionStatus && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                actionStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
              }`}
            >
              {actionStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <UserTable 
        users={pendingUsers} 
        title="Menunggu Persetujuan" 
        showAccept={true} 
      />

      <UserTable 
        users={activeUsers} 
        title="Pengguna Aktif" 
      />

      <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
        <Shield className="w-5 h-5 text-orange-600 shrink-0" />
        <div className="text-sm text-orange-800">
          <p className="font-bold mb-1">Panduan Keamanan:</p>
          <ul className="list-disc list-inside space-y-1 opacity-90">
            <li>Hanya berikan akses <strong>Admin</strong> kepada pengurus yang berwenang.</li>
            <li>Member yang baru mendaftar (Menunggu Persetujuan) tidak dapat mengakses dashboard ini.</li>
            <li>Anda dapat menghapus akun yang tidak dikenal atau mencurigakan.</li>
          </ul>
        </div>
      </div>
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction.onConfirm();
          }
        }}
        title={confirmAction?.title || 'Konfirmasi'}
        message={confirmAction?.message || 'Apakah Anda yakin?'}
      />
    </div>
  );
}
