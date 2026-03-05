"use client";
import { useState } from "react";
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSearch, FaArrowRight,
  FaChevronDown, FaCalendar, FaShare, FaChevronLeft, FaChevronRight,
  FaBullhorn, FaTimes,
} from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Event {
  id: number; title: string; date: string; time: string; location: string;
  type: string; category: string; description: string; fullDescription: string;
  image: string; imageAlt: string; registrationLink?: string;
  status: "upcoming" | "ongoing" | "completed"; tags: string[];
}

const ALL_EVENTS: Event[] = [
  { id: 1, title: "Schoolfee National Parent Conclave 2026", date: "March 15, 2026", time: "10:00 AM – 5:00 PM", location: "India Habitat Centre, New Delhi", type: "Conference", category: "Events", description: "A landmark gathering of parents, educators, and policymakers to discuss the future of accessible, affordable school education in India.", fullDescription: `The Schoolfee National Parent Conclave 2026 is a landmark one-day event bringing together parents, school administrators, education policymakers, mental health professionals, and community leaders.\n\nThis year's theme: "Every Child, Every Day — Building Resilient Education Ecosystems"\n\nAgenda Highlights:\n- Inaugural Address by Founding Team, Schoolfee\n- Panel Discussion: Financial Stress and Children's Mental Health\n- Workshop: Using the Schoolfee Platform Step-by-Step\n- Keynote: Role of NBFCs in Education Finance\n- Community Stories: Families Sharing Their Journeys\n- Launch of Schoolfee Mobile App (Beta)\n- Awards Ceremony: Recognizing Champion Schools and Parents\n\nRegistration is FREE for all parents. Limited seats available. Lunch and refreshments will be provided.`, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop", imageAlt: "Schoolfee National Parent Conclave 2026 — parents and educators at education conference in New Delhi", registrationLink: "/registration/parent", status: "upcoming", tags: ["Conference", "Parents", "Education"] },
  { id: 2, title: "School Partnership Onboarding Drive – Uttar Pradesh", date: "February 25–28, 2026", time: "9:00 AM – 6:00 PM", location: "Lucknow, Agra & Varanasi", type: "Outreach", category: "Events", description: "A four-day school onboarding drive across three major UP cities to expand Schoolfee's school partner network.", fullDescription: `Schoolfee's School Relations team is conducting an intensive four-day onboarding drive across Lucknow, Agra, and Varanasi targeting 100+ schools for enrollment into the School Partnership Program.\n\nThe drive includes:\n- School-level presentations for principals and management\n- Live demo of Schoolfee's school admin dashboard\n- One-on-one onboarding sessions\n- Parent awareness sessions at select campuses\n\nCity-wise Schedule:\n- Feb 25–26: Lucknow (Gomti Nagar Convention Hall)\n- Feb 27: Agra (Hotel Clarks Shiraz)\n- Feb 28: Varanasi (BHU Convention Centre)`, image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop", imageAlt: "Schoolfee school partnership onboarding drive in Uttar Pradesh — Lucknow Agra Varanasi schools", registrationLink: "/registration/school", status: "upcoming", tags: ["Outreach", "Schools", "UP"] },
  { id: 3, title: "CarePay Community Awareness Camp – South Delhi", date: "February 8, 2026", time: "8:00 AM – 2:00 PM", location: "Saket Community Hall, New Delhi", type: "Community Camp", category: "Events", description: "A free community awareness camp in South Delhi to introduce families to Schoolfee and the CarePay fee support system.", fullDescription: `Schoolfee organized a free community awareness camp in South Delhi's Saket neighborhood. The camp was attended by over 400 families and provided hands-on guidance on using the Schoolfee platform.\n\nEvent highlights:\n- 412 families registered on Schoolfee during the camp\n- Free health check-up for children (CHM collaboration)\n- On-the-spot fee support applications processed for 38 families\n- 250+ parents enrolled in the Community Points Program\n\nTestimonial: "I had no idea something like this existed. Schoolfee feels like a lifeline." — Parent, South Delhi`, image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop", imageAlt: "CarePay community awareness camp in Saket South Delhi — families learning about Schoolfee", status: "completed", tags: ["Community", "Delhi", "Awareness"] },
  { id: 4, title: "Webinar: Fee Security in the Age of Economic Uncertainty", date: "March 5, 2026", time: "7:00 PM – 8:30 PM", location: "Online (Zoom)", type: "Webinar", category: "Events", description: "An expert-led online session exploring how families can protect their children's education during economic downturns.", fullDescription: `Join Schoolfee for a FREE live webinar featuring education finance experts, mental health counselors, and community leaders.\n\nTopics covered:\n- Understanding the psychological impact of fee stress on children\n- How Schoolfee's interest-free support works end to end\n- Using the Community Points Program strategically\n- Fee Shield: Protecting education during job loss\n\nSpeakers:\n- Dr. Priya Sharma — Child Psychologist, AIIMS Delhi\n- Mr. Rajiv Menon — Financial Inclusion Expert, India Health Fund\n- Ms. Ananya Krishnan — Parent Community Lead, Schoolfee\n\nLanguage: Hindi and English. Duration: 90 minutes including 30-minute Q&A.`, image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop", imageAlt: "Schoolfee online webinar on education fee security during economic uncertainty", registrationLink: "/registration/parent", status: "upcoming", tags: ["Webinar", "Finance", "Online"] },
  { id: 5, title: "Schoolfee Community Points Launch Event – Mumbai", date: "January 20, 2026", time: "11:00 AM – 3:00 PM", location: "NSCI Dome, Mumbai", type: "Launch", category: "Announcements", description: "The official launch event of the Community Points Program in Mumbai, attended by 500+ parents and school representatives.", fullDescription: `The Community Points Program launch event in Mumbai brought together over 500 parents, school leaders, and community members to celebrate a new era of reward-based education support.\n\nHighlights:\n- Live demonstration of the points earning system\n- Interactive Q&A with Schoolfee's founding team\n- On-the-spot enrollment — 300+ families joined\n- Prize distribution for early beta testers\n- Media coverage from 8 news outlets\n\nThe event marked the beginning of Schoolfee's expansion into Maharashtra.`, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop", imageAlt: "Schoolfee Community Points launch event at NSCI Dome Mumbai attended by 500+ parents", status: "completed", tags: ["Launch", "Mumbai", "Community Points"] },
  { id: 6, title: "Annual Education Finance Summit 2026 — Schoolfee as Featured Speaker", date: "April 10, 2026", time: "9:00 AM – 6:00 PM", location: "Taj Hotel, Bengaluru", type: "Summit", category: "Announcements", description: "Schoolfee's founding team will present the CarePay model at India's leading education finance summit.", fullDescription: `Schoolfee has been selected as a featured speaker at the Annual Education Finance Summit 2026 in Bengaluru — one of India's premier gatherings of education finance professionals, policy makers, and impact investors.\n\nSchoolFee's presentation: "Community-Driven Fee Support: A Replicable Model for Education Financial Inclusion"\n\nThe session will cover:\n- The Schoolfee operational model and CarePay infrastructure\n- Community Points Program outcomes and data\n- Scalability roadmap and NBFC credit line framework\n\nAttendees include representatives from Ministry of Education, RBI, NITI Aayog, and 20+ impact investment firms.`, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop", imageAlt: "Annual Education Finance Summit 2026 Bengaluru — Schoolfee featured speaker presenting CarePay model", registrationLink: "/registration/parent", status: "upcoming", tags: ["Summit", "Finance", "Bengaluru"] },
];

const CATEGORIES = ["All", "Events", "Announcements"];
const TYPES = ["All", "Conference", "Outreach", "Community Camp", "Webinar", "Launch", "Summit"];
const STATUSES = ["All", "Upcoming", "Completed"];
const TAGS = ["All", "Parents", "Education", "Schools", "Community", "Finance", "Online", "Webinar"];

function StatusBadge({ status }: { status: Event["status"] }) {
  const cfg = { upcoming: "bg-blue-100 text-blue-700 border border-blue-200", ongoing: "bg-green-100 text-green-700 border border-green-200", completed: "bg-gray-100 text-gray-600 border border-gray-200" };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg[status]}`}>{status}</span>;
}

function MediaModal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[95vw] lg:w-[80vw] max-w-[1400px] h-[95vh] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button]:hidden">
        <div className="h-full overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default function NewEventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [tag, setTag] = useState("All");
  const [modal, setModal] = useState<Event | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ALL_EVENTS.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && e.category !== category) return false;
    if (type !== "All" && e.type !== type) return false;
    if (status !== "All" && e.status !== status.toLowerCase()) return false;
    if (tag !== "All" && !e.tags.includes(tag)) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const resetFilters = () => { setSearch(""); setCategory("All"); setType("All"); setStatus("All"); setTag("All"); setPage(1); };

  const Sidebar = () => (
    <nav aria-label="Event filters" className="space-y-6">
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Search</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
          <label htmlFor="ev-search" className="sr-only">Search events</label>
          <input id="ev-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search keywords..." className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00468e]/20 focus:border-[#00468e]" />
        </div>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Category</h2>
        <ul className="space-y-1.5">
          {CATEGORIES.map(c => <li key={c}><button onClick={() => { setCategory(c); setPage(1); }} aria-pressed={category === c} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${category === c ? "bg-[#00468e] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>{c}</button></li>)}
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Status</h2>
        <ul className="space-y-1.5">
          {STATUSES.map(s => <li key={s}><button onClick={() => { setStatus(s); setPage(1); }} aria-pressed={status === s} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${status === s ? "bg-[#f4951d] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>{s}</button></li>)}
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => <button key={t} onClick={() => { setTag(t); setPage(1); }} aria-pressed={tag === t} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${tag === t ? "bg-[#0cab47] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>)}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Event Type</h2>
        <ul className="space-y-1.5">
          {TYPES.map(t => <li key={t}><button onClick={() => { setType(t); setPage(1); }} aria-pressed={type === t} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${type === t ? "bg-[#00468e] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>{t}</button></li>)}
        </ul>
      </div>
      <button onClick={resetFilters} aria-label="Reset all filters" className="w-full py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">Reset Filters</button>
    </nav>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* H1 Hero */}
      <header className="relative bg-[#111827] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" role="presentation" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00468e]/90 to-[#111827]/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3">News &amp; Events</h1>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li aria-hidden="true"><FaChevronRight className="text-xs text-gray-500" /></li>
              <li><span className="text-[#f4951d] font-medium" aria-current="page">News &amp; Events</span></li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="relative flex-1 min-w-[140px]">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
            <label htmlFor="ev-search-mob" className="sr-only">Search events</label>
            <input id="ev-search-mob" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          {[{ id: "cat-mob", label: "Category", value: category, options: CATEGORIES, setter: setCategory }, { id: "st-mob", label: "Status", value: status, options: STATUSES, setter: setStatus }, { id: "tp-mob", label: "Type", value: type, options: TYPES, setter: setType }].map(f => (
            <div key={f.id} className="relative flex-shrink-0">
              <label htmlFor={f.id} className="sr-only">Filter by {f.label}</label>
              <select id={f.id} value={f.value} onChange={e => { f.setter(e.target.value); setPage(1); }} className="appearance-none pl-3 pr-7 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none cursor-pointer font-medium text-gray-700">
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" aria-hidden="true" />
            </div>
          ))}
          <button onClick={resetFilters} className="flex-shrink-0 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold border border-red-100">Reset</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Filters">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6"><Sidebar /></div>
          </aside>

          <section className="flex-1 min-w-0" aria-label="Events listing">
            <p className="text-sm text-gray-500 mb-6"><span className="font-bold text-[#00468e]">{filtered.length}</span> results found</p>
            {paged.length === 0 ? (
              <div className="text-center py-20 text-gray-400" role="status">
                <FaBullhorn className="text-5xl mx-auto mb-4 opacity-30" aria-hidden="true" />
                <h3 className="font-semibold text-lg">No events found</h3>
                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="mt-4 text-[#f4951d] underline text-sm">Clear filters</button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" role="list">
                {paged.map(ev => (
                  <li key={ev.id}>
                    <article onClick={() => setModal(ev)} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group h-full flex flex-col">
                      <div className="relative h-44 overflow-hidden flex-shrink-0">
                        <img src={ev.image} alt={ev.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={176} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase bg-[#f4951d] text-white px-2 py-0.5 rounded-full">{ev.type}</span>
                          <StatusBadge status={ev.status} />
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-[#00468e] text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#f4951d] transition-colors">{ev.title}</h3>
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500"><FaCalendar className="text-[#0cab47] flex-shrink-0" aria-hidden="true" /><time dateTime={ev.date}>{ev.date}</time></div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500"><FaMapMarkerAlt className="text-[#0cab47] flex-shrink-0" aria-hidden="true" /><span className="line-clamp-1">{ev.location}</span></div>
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed line-clamp-2 mb-3 flex-1">{ev.description}</p>
                        <button className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f4951d] mt-auto" aria-label={`View details for: ${ev.title}`}>View Details <FaArrowRight className="text-[10px]" aria-hidden="true" /></button>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
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
              <img src={modal.image} alt={modal.imageAlt} className="w-full h-full object-cover" width={1200} height={400} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" aria-hidden="true" />
              <button onClick={() => setModal(null)} aria-label="Close event details" className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"><FaTimes aria-hidden="true" /></button>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] font-bold uppercase bg-[#f4951d] text-white px-2.5 py-1 rounded-full">{modal.type}</span>
                <StatusBadge status={modal.status} />
              </div>
              <h2 className="absolute bottom-5 left-5 right-5 text-white font-extrabold text-xl md:text-2xl leading-tight">{modal.title}</h2>
            </div>
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4"><h3 className="flex items-center gap-2 text-[#00468e] font-semibold text-xs mb-1"><FaCalendar aria-hidden="true" />Date</h3><p className="text-gray-700 text-sm font-medium"><time dateTime={modal.date}>{modal.date}</time></p></div>
                <div className="bg-green-50 rounded-xl p-4"><h3 className="flex items-center gap-2 text-[#0cab47] font-semibold text-xs mb-1"><FaClock aria-hidden="true" />Time</h3><p className="text-gray-700 text-sm font-medium">{modal.time}</p></div>
                <div className="bg-orange-50 rounded-xl p-4"><h3 className="flex items-center gap-2 text-[#f4951d] font-semibold text-xs mb-1"><FaMapMarkerAlt aria-hidden="true" />Venue</h3><p className="text-gray-700 text-sm font-medium">{modal.location}</p></div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">{modal.tags.map(t => <span key={t} className="text-xs bg-blue-50 text-[#00468e] border border-blue-100 px-3 py-1 rounded-full">{t}</span>)}</div>
              <div className="space-y-4">
                {modal.fullDescription.split("\n\n").map((p, i) => <p key={i} className="text-gray-700 text-base leading-relaxed">{p}</p>)}
              </div>
              {modal.registrationLink && modal.status === "upcoming" && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 flex-wrap">
                  <a href={modal.registrationLink} className="inline-flex items-center gap-2 px-6 py-3 bg-[#f4951d] text-white font-bold rounded-full shadow-lg hover:bg-[#e07d0a] transition-colors text-sm">Register Now <FaArrowRight aria-hidden="true" /></a>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-full text-sm hover:bg-gray-50"><FaShare aria-hidden="true" />Share Event</button>
                </div>
              )}
            </div>
          </article>
        )}
      </MediaModal>
    </div>
  );
}