import { FC, useEffect, useState } from "react";
import { 
  X, PlayCircle, Loader2, User, Building2, MapPin, Briefcase, 
  AlertCircle, CheckCircle2, ChevronLeft 
} from "lucide-react";
import useTicketDetail from "../../../../hooks/ticket/useTicketDetail";
import useUpdateTicketStatus from "../../../../hooks/ticket/useUpdateTicketStatus";
import useSubmitComment from "../../../../hooks/comment/useSubmitComment";

// IMPORT 3 HOOKS BARU DI SINI (Sesuaikan path-nya)
import useCategories from "../../../../hooks/category/useCategories";
import useSubCategories from "../../../../hooks/subCategory/useSubCategories";
import useItems from "../../../../hooks/item/useItems";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string | null;
}

const TicketDetailModal: FC<ModalProps> = ({ isOpen, onClose, ticketNumber }) => {
  // Hooks Data Tiket
  const { data: ticket, isLoading, isError } = useTicketDetail(ticketNumber || "");
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTicketStatus();
  const { mutate: submitComment, isPending: isSubmitting } = useSubmitComment();
  
  // State Navigasi Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // State Form Penyelesaian
  const [formData, setFormData] = useState({
    category_id: 0,
    sub_category_id: 0,
    item_id: 0,
    type: "", 
    description: ""
  });

  // --- HOOKS FETCH DATA DROPDOWN ---
  const { data: categories, isLoading: isLoadingCats } = useCategories();
  const { data: subCategories, isLoading: isLoadingSubCats } = useSubCategories(String(formData.category_id));
const { data: items, isLoading: isLoadingItems } = useItems(String(formData.category_id), String(formData.sub_category_id));
  // ---------------------------------

  // Reset state saat modal ditutup atau ganti tiket
  useEffect(() => {
    if (!isOpen) {
      setIsFinishing(false);
      setIsConfirmOpen(false);
      setFormData({ category_id: 0, sub_category_id: 0, item_id: 0, type: "", description: "" });
    }
  }, [isOpen, ticketNumber]);

  // Efek tombol Escape (Sama seperti sebelumnya)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUpdating && !isSubmitting) {
        if (isConfirmOpen) setIsConfirmOpen(false);
        else if (isFinishing) setIsFinishing(false);
        else onClose();
      }
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isUpdating, isSubmitting, isConfirmOpen, isFinishing]);

  if (!isOpen) return null;

  // Handler Process & Complete (Sama seperti sebelumnya)
  const executeProcess = () => {
    if (!ticketNumber) return;
    updateStatus(
      { ticket_number: ticketNumber, status: "PROCESS" },
      {
        onSuccess: () => { setIsConfirmOpen(false); onClose(); },
        onError: () => { alert("Gagal memperbarui status."); setIsConfirmOpen(false); }
      }
    );
  };

  const handleCompleteTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || formData.category_id === 0 || formData.type === "") {
      alert("Mohon lengkapi data kategori dan jenis kendala!");
      return;
    }
    submitComment(
      {
        ticket_id: ticket.id,
        category_id: Number(formData.category_id),
        sub_category_id: Number(formData.sub_category_id),
        item_id: Number(formData.item_id),
        type: formData.type,
        description: formData.description
      },
      {
        onSuccess: () => { onClose(); alert("Tiket berhasil diselesaikan!"); },
        onError: (error) => { console.error(error); alert("Gagal menyelesaikan tiket."); }
      }
    );
  };

  const isWorking = isUpdating || isSubmitting;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={!isWorking && !isConfirmOpen ? onClose : undefined} />
      <div className="relative bg-gray-900 border border-gray-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header - SAMA SEPERTI SEBELUMNYA */}
        <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div className="flex items-center gap-3">
            {isFinishing ? (
              <button onClick={() => setIsFinishing(false)} className="text-gray-400 hover:text-white mr-2 transition-colors"><ChevronLeft size={20} /></button>
            ) : (
              <span className="text-[10px] font-mono text-yellow-600 font-bold bg-yellow-600/10 px-2 py-0.5 rounded border border-yellow-600/20">#{ticketNumber}</span>
            )}
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">{isFinishing ? "Form Penyelesaian Tiket" : "Detail Informasi Tiket"}</h3>
          </div>
          <button onClick={onClose} disabled={isWorking} className="p-1 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors disabled:opacity-50"><X size={18} /></button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3"><Loader2 className="animate-spin text-yellow-600" size={32} /></div>
          ) : isError ? (
            <div className="py-10 text-center text-red-400 text-sm font-medium bg-red-500/10 rounded-lg border border-red-500/20">Gagal memuat detail tiket.</div>
          ) : ticket && !isFinishing ? (
            
            /* --- TAMPILAN DETAIL TIKET (SAMA SEPERTI SEBELUMNYA) --- */
            <div className="space-y-6">
              {/* ... Bagian ini sama persis dengan kode Anda sebelumnya ... */}
              <div>
                <h2 className="text-lg font-bold text-white mb-2 leading-snug">{ticket.title}</h2>
                <div className="bg-gray-800/30 border border-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2 tracking-tighter">Deskripsi Masalah</p>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800/20 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-3"><User size={14} className="text-yellow-600" /><span className="text-[11px] font-bold text-gray-400 uppercase">Pelapor</span></div>
                    <p className="text-sm text-white font-semibold">{ticket.employee.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{ticket.created_by?.email || "Email tidak tersedia"}</p>
                </div>

                <div className="p-3 bg-gray-800/20 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-2"><Building2 size={14} className="text-yellow-600" /><span className="text-[11px] font-bold text-gray-400 uppercase">Lokasi & Divisi</span></div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[12px] text-gray-300"><MapPin size={12} className="text-gray-600" /> {ticket.branch?.name || "-"}</div>
                        <div className="flex items-center gap-2 text-[12px] text-gray-300"><Briefcase size={12} className="text-gray-600" /> {ticket.division?.name || "-"}</div>
                    </div>
                </div>
              </div>
            </div>

          ) : ticket && isFinishing ? (

            /* --- TAMPILAN FORM PENYELESAIAN (DIUBAH MENJADI DYNAMIC) --- */
            <form id="complete-form" onSubmit={handleCompleteTicket} className="space-y-5">
               <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg mb-2">
                  <p className="text-xs text-emerald-400 font-medium">Silakan isi laporan perbaikan. Tiket akan otomatis ditutup setelah disimpan.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* KATEGORI */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Kategori</label>
                    <select 
                      required 
                      value={formData.category_id} 
                      onChange={e => setFormData({
                        ...formData, 
                        category_id: Number(e.target.value),
                        sub_category_id: 0, // Reset sub & item saat kategori berubah
                        item_id: 0
                      })} 
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value={0} disabled>{isLoadingCats ? "Memuat Kategori..." : "Pilih Kategori"}</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* SUB KATEGORI */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Sub Kategori</label>
                    <select 
                      required 
                      disabled={formData.category_id === 0 || isLoadingSubCats}
                      value={formData.sub_category_id} 
                      onChange={e => setFormData({
                        ...formData, 
                        sub_category_id: Number(e.target.value),
                        item_id: 0 // Reset item saat sub kategori berubah
                      })} 
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                    >
                      <option value={0} disabled>{isLoadingSubCats ? "Memuat..." : "Pilih Sub Kategori"}</option>
                      {subCategories?.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* ITEM */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Item Spesifik</label>
                    <select 
                      required 
                      disabled={formData.sub_category_id === 0 || isLoadingItems}
                      value={formData.item_id} 
                      onChange={e => setFormData({...formData, item_id: Number(e.target.value)})} 
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                    >
                      <option value={0} disabled>{isLoadingItems ? "Memuat..." : "Pilih Item"}</option>
                      {items?.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* TYPE (Tetap Hardcode Sesuai Enum Golang) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Jenis Kendala</label>
                    <select 
                      required 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})} 
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="" disabled>Pilih Jenis</option>
                      <option value="Malfunction">Malfunction (Kerusakan)</option>
                      <option value="Human_Error">Human Error</option>
                      <option value="Install">Install / Setup</option>
                      <option value="Other">Lainnya (Other)</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Deskripsi Penanganan</label>
                  <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Contoh: Mengganti komponen..." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none resize-none custom-scrollbar transition-all" />
               </div>
            </form>

          ) : null}
        </div>

        {/* Footer Area & Popup Konfirmasi - SAMA SEPERTI SEBELUMNYA */}
        {/* ... (Biarkan sama persis seperti kode Anda yang sudah berhasil tadi) ... */}
        <div className="px-5 py-4 bg-gray-900 border-t border-gray-800 flex justify-end items-center gap-3">
          <button onClick={() => { if (isFinishing) { setIsFinishing(false); } else { onClose(); } }} disabled={isWorking} className="text-[11px] font-bold text-gray-500 hover:text-white px-4 py-2 transition-colors uppercase disabled:opacity-50">
            {isFinishing ? "Batal" : "Tutup"}
          </button>
          {ticket?.status.toUpperCase() === "OPEN" && !isFinishing && (
            <button onClick={() => setIsConfirmOpen(true)} disabled={isWorking} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-600/50 text-black font-black text-[11px] uppercase tracking-tighter px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-yellow-600/10">
              <PlayCircle size={16} /> MULAI KERJAKAN
            </button>
          )}
          {ticket?.status.toUpperCase() === "PROCESS" && !isFinishing && (
            <button onClick={() => setIsFinishing(true)} disabled={isWorking} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-black text-[11px] uppercase tracking-tighter px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={16} /> SELESAIKAN TIKET
            </button>
          )}
          {isFinishing && (
            <button form="complete-form" type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[11px] uppercase tracking-tighter px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/10">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> MENGIRIM...</> : <><CheckCircle2 size={16} /> SIMPAN & TUTUP TIKET</>}
            </button>
          )}
        </div>
      </div>
      
      {/* POPUP KONFIRMASI MULAI KERJAKAN */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => !isUpdating && setIsConfirmOpen(false)} />
          <div className="relative bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/20"><AlertCircle className="text-yellow-500" size={24} /></div>
              <h3 className="text-lg font-bold text-white mb-2">Mulai Kerjakan Tiket?</h3>
              <p className="text-sm text-gray-400 mb-6">Status tiket <span className="text-white font-mono bg-gray-800 px-1 rounded">{ticketNumber}</span> akan diubah menjadi <strong className="text-yellow-500">PROCESS</strong>.</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setIsConfirmOpen(false)} disabled={isUpdating} className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase rounded-xl transition-colors disabled:opacity-50">Batal</button>
                <button onClick={executeProcess} disabled={isUpdating} className="flex-1 py-2.5 px-4 bg-yellow-600 hover:bg-yellow-500 text-black text-xs font-bold uppercase rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                  {isUpdating ? <><Loader2 size={14} className="animate-spin" /> Proses...</> : "Ya, Kerjakan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailModal;