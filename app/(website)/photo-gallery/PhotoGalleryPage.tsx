"use client";
import { useState } from "react";
import {
  FaImages, FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight,
  FaTimes, FaCalendar, FaMapMarkerAlt,
} from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryItem {
  id: number; title: string; date: string; location: string;
  category: string; tags: string[]; image: string; imageAlt: string; description: string;
}

const ALL_GALLERY: GalleryItem[] = [
  { id: 1, title: "National Parent Conclave 2026 — Photo Highlights", date: "March 15, 2026", location: "New Delhi", category: "Events", tags: ["Conference", "Parents"], image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop", imageAlt: "Schoolfee National Parent Conclave 2026 venue at India Habitat Centre New Delhi", description: "Photos from the National Parent Conclave 2026 will be available after the event." },
  { id: 2, title: "CarePay Community Camp — South Delhi", date: "February 8, 2026", location: "Saket, Delhi", category: "Community", tags: ["Camp", "Delhi"], image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop", imageAlt: "CarePay community awareness camp held at Saket Community Hall South Delhi", description: "Photos from our South Delhi community awareness camp will be published here." },
  { id: 3, title: "School Partnership Onboarding Drive — Delhi", date: "February 25, 2026", location: "Lucknow, UP", category: "Outreach", tags: ["Schools", "UP"], image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop", imageAlt: "Schoolfee school partnership onboarding drive event in Lucknow Uttar Pradesh", description: "School onboarding drive photos from Lucknow, UP — to be published after the event." },
  { id: 4, title: "Community Points Launch — Mumbai", date: "January 20, 2026", location: "Mumbai", category: "Launch", tags: ["Launch", "Mumbai"], image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop", imageAlt: "Schoolfee Community Points Program launch event at NSCI Dome Mumbai", description: "Photos from the Community Points launch event in Mumbai will be added here." },
  { id: 5, title: "CHM Education Summit 2025 - New Delhi", date: "December 2025", location: "New Delhi", category: "Events", tags: ["Summit", "CHM"], image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop", imageAlt: "Community Health Mission CHM Education Summit 2025 in New Delhi", description: "CHM Education Summit 2025 gallery photos — coming soon." },
  { id: 6, title: "Schoolfee Team — Office & Culture", date: "January 2026", location: "New Delhi HQ", category: "Team", tags: ["Team", "Culture"], image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop", imageAlt: "Schoolfee team at the New Delhi headquarters office working on education support platform", description: "Behind the scenes with the Schoolfee team — photos coming soon." },
];

const CATEGORIES = ["All", "Events", "Community", "Outreach", "Launch", "Team"];
const TAGS = ["All", "Conference", "Camp", "Schools", "Launch", "Summit", "Team", "Delhi", "Mumbai"];

function MediaModal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[95vw] lg:w-[80vw] max-w-[1400px] h-[95vh] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button]:hidden">
        <div className="h-full overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default function PhotoGalleryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [modal, setModal] = useState<GalleryItem | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ALL_GALLERY.filter(g => {
    if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && g.category !== category) return false;
    if (tag !== "All" && !g.tags.includes(tag)) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const resetFilters = () => { setSearch(""); setCategory("All"); setTag("All"); setPage(1); };

  const Sidebar = () => (
    <nav aria-label="Gallery filters" className="space-y-6">
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Search</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
          <label htmlFor="gal-search" className="sr-only">Search photo gallery</label>
          <input id="gal-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search gallery..." className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00468e]/20 focus:border-[#00468e]" />
        </div>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Category</h2>
        <ul className="space-y-1.5">
          {CATEGORIES.map(c => <li key={c}><button onClick={() => { setCategory(c); setPage(1); }} aria-pressed={category === c} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${category === c ? "bg-[#00468e] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>{c}</button></li>)}
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => <button key={t} onClick={() => { setTag(t); setPage(1); }} aria-pressed={tag === t} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${tag === t ? "bg-[#0cab47] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>)}
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-4 text-center">
        <FaImages className="text-3xl text-[#00468e] mx-auto mb-2 opacity-60" aria-hidden="true" />
        <p className="text-sm text-gray-600 font-medium">Gallery photos will be added as events are completed.</p>
      </div>
      <button onClick={resetFilters} aria-label="Reset all filters" className="w-full py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">Reset Filters</button>
    </nav>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* H1 Hero */}
      <header className="relative bg-[#111827] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" role="presentation" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00468e]/90 to-[#111827]/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">Photo Gallery</h1>
            <span className="text-xs font-bold uppercase bg-[#f4951d] text-white px-3 py-1.5 rounded-full animate-pulse">Coming Soon</span>
          </div>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li aria-hidden="true"><FaChevronRight className="text-xs text-gray-500" /></li>
              <li><span className="text-[#f4951d] font-medium" aria-current="page">Photo Gallery</span></li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="relative flex-1 min-w-[140px]">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
            <label htmlFor="gal-search-mob" className="sr-only">Search gallery</label>
            <input id="gal-search-mob" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <div className="relative flex-shrink-0">
            <label htmlFor="cat-gal-mob" className="sr-only">Filter by category</label>
            <select id="cat-gal-mob" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="appearance-none pl-3 pr-7 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none cursor-pointer font-medium text-gray-700">
              {CATEGORIES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" aria-hidden="true" />
          </div>
          <button onClick={resetFilters} className="flex-shrink-0 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold border border-red-100">Reset</button>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3" role="note">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <FaImages className="text-[#00468e] flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-[#00468e] font-medium">Our photo gallery is being curated. Photos from upcoming and completed events will be published here.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Filters">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6"><Sidebar /></div>
          </aside>

          <section className="flex-1 min-w-0" aria-label="Photo gallery albums">
            <p className="text-sm text-gray-500 mb-6"><span className="font-bold text-[#00468e]">{filtered.length}</span> albums found</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" role="list">
              {paged.map(g => (
                <li key={g.id}>
                  <article onClick={() => setModal(g)} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group">
                    <div className="relative h-44 overflow-hidden">
                      <img src={g.image} alt={g.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75" loading="lazy" width={400} height={176} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center" aria-hidden="true">
                        <div className="text-center text-white">
                          <FaImages className="text-4xl mx-auto mb-2 opacity-70" />
                          <span className="text-xs font-bold uppercase bg-[#f4951d]/90 px-3 py-1 rounded-full">Coming Soon</span>
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-[#00468e] text-white px-2 py-0.5 rounded-full">{g.category}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#00468e] text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#f4951d] transition-colors">{g.title}</h3>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500"><FaCalendar className="text-[#0cab47]" aria-hidden="true" /><time dateTime={g.date}>{g.date}</time></div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500"><FaMapMarkerAlt className="text-[#0cab47]" aria-hidden="true" />{g.location}</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">{g.tags.map(t => <span key={t} className="text-[10px] bg-blue-50 text-[#00468e] px-2 py-0.5 rounded-full">{t}</span>)}</div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#00468e] hover:text-white disabled:opacity-40 transition-all"><FaChevronLeft className="text-xs" aria-hidden="true" /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => <button key={n} onClick={() => setPage(n)} aria-label={`Page ${n}`} aria-current={page === n ? "page" : undefined} className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${page === n ? "bg-[#00468e] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>{n}</button>)}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#00468e] hover:text-white disabled:opacity-40 transition-all"><FaChevronRight className="text-xs" aria-hidden="true" /></button>
              </nav>
            )}
          </section>
        </div>
      </main>

      {/* Modal — 90vw × 90vh */}
      <MediaModal isOpen={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <article>
            <div className="relative h-64 md:h-80">
              <img src={modal.image} alt={modal.imageAlt} className="w-full h-full object-cover filter brightness-50" width={1200} height={400} />
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <div className="text-center text-white">
                  <FaImages className="text-6xl mx-auto mb-3 opacity-60" />
                  <span className="text-lg font-bold uppercase bg-[#f4951d]/90 px-5 py-2 rounded-full">Photos Coming Soon</span>
                </div>
              </div>
              <button onClick={() => setModal(null)} aria-label="Close gallery album" className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"><FaTimes aria-hidden="true" /></button>
              <h2 className="absolute bottom-5 left-5 right-5 text-white font-extrabold text-xl md:text-3xl leading-tight">{modal.title}</h2>
            </div>
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4"><h3 className="text-[#00468e] font-semibold text-xs mb-1 flex items-center gap-1.5"><FaCalendar aria-hidden="true" />Date</h3><p className="text-gray-700 text-sm font-medium"><time dateTime={modal.date}>{modal.date}</time></p></div>
                <div className="bg-green-50 rounded-xl p-4"><h3 className="text-[#0cab47] font-semibold text-xs mb-1 flex items-center gap-1.5"><FaMapMarkerAlt aria-hidden="true" />Location</h3><p className="text-gray-700 text-sm font-medium">{modal.location}</p></div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <FaImages className="text-4xl text-yellow-400 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-bold text-gray-700 mb-2 text-base">Photos Coming Soon</h3>
                <p className="text-gray-600 text-base leading-relaxed">{modal.description} Check back after the event for a full photo gallery.</p>
              </div>
            </div>
          </article>
        )}
      </MediaModal>
    </div>
  );
}