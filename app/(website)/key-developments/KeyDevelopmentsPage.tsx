"use client";
import { useState } from "react";
import {
  FaChartLine, FaSearch, FaCalendar, FaArrowRight, FaChevronDown,
  FaChevronLeft, FaChevronRight, FaTimes, FaShare,
} from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface KeyDevelopment {
  id: number; title: string; date: string; category: string;
  summary: string; fullContent: string; image: string; imageAlt: string; impact: string; tags: string[];
}

const ALL_DEVS: KeyDevelopment[] = [
  { id: 1, title: "Schoolfee Receives Recognition as a Section 8 Social Enterprise Under Companies Act 2013", date: "November 2025", category: "Legal & Compliance", summary: "Schoolfee has been formally incorporated as a Section 8 company, affirming its not-for-profit social mission and enabling it to receive CSR funding and grants.", fullContent: `The formal incorporation of Schoolfee under Section 8 of the Companies Act, 2013 marks a pivotal legal and operational milestone. Section 8 status is granted to companies that operate with charitable or educational objectives and reinvest all surpluses back into the mission.\n\nThis designation enables Schoolfee to:\n- Receive CSR contributions from corporates\n- Apply for government grants and education ministry schemes\n- Attract philanthropic capital from impact investors\n- Partner with international NGOs and foundations\n- Issue tax exemption certificates (80G) to donors\n\nThe Registrar of Companies (RoC) recognition was received after a rigorous review of Schoolfee's governance structure, management team, and operational plan.\n\n"The Section 8 status is not just a legal designation — it is a commitment. It binds us permanently to our mission of education-first, profit-never," said the Legal Advisor to Schoolfee's Board.`, image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop", imageAlt: "Schoolfee Section 8 company registration certificate under Companies Act 2013", impact: "Enables CSR funding, 80G certification & grant eligibility", tags: ["Legal", "Section 8", "Compliance"] },
  { id: 2, title: "CarePay® Trademark Registered — Schoolfee's Fee Support Brand Gets IP Protection", date: "December 2025", category: "Brand & IP", summary: "The CarePay® brand has been officially trademarked, protecting the platform's core identity across financial and educational service classes.", fullContent: `Schoolfee's National Health Financial Inclusion Initiative Program, branded as CarePay®, has received formal trademark registration from the Controller General of Patents, Designs & Trade Marks of India.\n\nCarePay® serves as the financial infrastructure layer of the Schoolfee platform — managing the interest-free credit flow from India Health Fund Limited to families and schools.\n\nWhat CarePay® covers under the trademark:\n- The CarePay payment processing system\n- The CarePay family dashboard and app interface\n- All CarePay-branded communications and materials\n- The CarePay Community Points Program brand identity\n\nThe trademark was registered in Class 36 (Financial and Insurance Services) and Class 41 (Educational Services), providing comprehensive IP protection.\n\n"CarePay is what families see when they trust Schoolfee with their children's future. Protecting that brand is protecting that trust," said Schoolfee's Brand and Communications Director.`, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop", imageAlt: "CarePay trademark registration certificate — Schoolfee brand and IP protection", impact: "Brand protection across 2 trademark classes", tags: ["Brand", "Trademark", "CarePay", "IP"] },
  { id: 3, title: "Full-Stack Web Platform Deployed — Schoolfee.in Goes Live with Multi-Portal Architecture", date: "January 2026", category: "Technology", summary: "Schoolfee.in has been developed and deployed as a production-ready Next.js 14 web application with parent, school, and admin portals.", fullContent: `After six months of development, Schoolfee.in has officially launched as a production-ready, full-stack web application built on Next.js 14 with TypeScript, Tailwind CSS, and a robust backend powered by Node.js.\n\nKey technical features:\n- Parent Portal: Registration, fee support application, EMI tracking, Community Points dashboard\n- School Portal: Student fee management, partner dashboard, application review\n- Admin Portal: Full case management, analytics, reporting, and support fund controls\n- CarePay Integration: Secure, encrypted fee processing with real-time status updates\n- Mobile Responsive: Optimized for all screen sizes\n- Accessibility: Screen reader support, multilingual UI (Hindi + English)\n\nTechnology stack:\n- Frontend: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui\n- Backend: Node.js, Express, PostgreSQL, Prisma ORM\n- Hosting: AWS (EC2 + RDS + S3 + CloudFront CDN)\n\nPerformance: Page load under 1.5 seconds on 4G, 99.9% uptime SLA.`, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop", imageAlt: "Schoolfee.in web platform development — Next.js 14 multi-portal architecture for parents and schools", impact: "Full platform live; mobile app in beta for Q2 2026", tags: ["Technology", "Platform", "Next.js", "Launch"] },
  { id: 4, title: "Emergency Education Support Fund Established — ₹25 Lakh Corpus Operational", date: "January 2026", category: "Program", summary: "Schoolfee has established a dedicated Emergency Education Support Fund with an initial corpus of ₹25 lakh for families facing sudden financial crises.", fullContent: `Schoolfee has formally established the Emergency Education Support Fund (EESF) with an initial corpus of ₹25 lakh, sourced from founding contributions by India Health Fund Limited and early community donor partners.\n\nThe EESF is designed to provide immediate fee support to families facing sudden, unexpected financial hardships — such as job loss, medical emergencies, or natural disasters.\n\nHow the EESF works:\n- Families in crisis apply through the Schoolfee platform or any partner school\n- Applications reviewed within 24–48 hours\n- Approved families receive immediate fee payment to their school\n- Repayment is structured flexibly with zero interest\n\nFirst month of operations:\n- 67 emergency applications received\n- 54 approved and processed\n- ₹4.2 lakh disbursed\n- Average processing time: 31 hours\n\nDonations to the EESF are eligible for 80G tax exemption.`, image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop", imageAlt: "Schoolfee Emergency Education Support Fund helping families in sudden financial crisis", impact: "₹4.2 lakh disbursed in Month 1 — 54 families supported", tags: ["Fund", "Emergency", "Program", "Support"] },
  { id: 5, title: "NBFC Partnership Finalized — ₹100 Crore School Credit Facility Structured", date: "December 2025", category: "Finance", summary: "India Health Fund Limited finalises an NBFC-backed ₹100 crore credit facility to power Schoolfee's zero-interest fee support at national scale.", fullContent: `India Health Fund Limited has finalized a partnership with a leading NBFC to create a dedicated ₹100 crore school fee credit facility — the financial backbone that will power Schoolfee's operations at scale.\n\nThe facility enables:\n- Interest-free fee disbursements to partner schools on behalf of families\n- Rolling credit line that grows as repayments come in\n- Zero cost to parent families — all platform and financing costs absorbed\n- Regulatory compliance under RBI's NBFC framework\n\nThis structure makes Schoolfee one of the few organizations globally to offer a self-sustaining, trust-based education credit model with zero interest to end beneficiaries.\n\nThe credit facility is expected to support over 1 lakh families annually by 2027.`, image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop", imageAlt: "India Health Fund NBFC partnership for Schoolfee 100 crore school credit facility", impact: "₹100 Cr credit facility; 1 lakh families target by 2027", tags: ["NBFC", "Finance", "Credit", "Scale"] },
  { id: 6, title: "Community Points Program — 4-Tier Membership System Launched", date: "January 2026", category: "Program", summary: "The Community Points Program's four-tier membership system (Bronze, Silver, Gold, Life) launched with multiplier rewards and 100+ earning pathways.", fullContent: `Schoolfee's Community Points Program has been designed and deployed with a sophisticated four-tier membership architecture that incentivizes long-term participation, community support, and responsible financial behavior.\n\nTier structure:\n- Bronze (0-500 pts): Basic earning (1x multiplier), fee support access after 6 months\n- Silver (500-1,500 pts): Enhanced earning (1.25x), priority support, free counseling\n- Gold (1,500-3,000 pts): Premium earning (1.5x), express processing, unlimited workshops\n- Life Member (3,000+ pts): Maximum earning (2x), lifetime benefits, mentorship, founding privileges\n\nEarning pathways (100+):\n- Regular fee payments: 10-50 points per transaction\n- Referrals: 100-200 points per successful enrollment\n- Community participation: 25-100 points\n- Helping other families: 50-150 points\n\nFirst month: 10,247 enrollments, ₹12 lakh worth of fee support redeemed through points.`, image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop", imageAlt: "Schoolfee Community Points Program four-tier membership system Bronze Silver Gold Life Member", impact: "10,247 members; ₹12L redeemed in month 1", tags: ["Community Points", "Membership", "Program", "Rewards"] },
];

const CATEGORIES = ["All", "Legal & Compliance", "Brand & IP", "Technology", "Program", "Finance"];
const TAGS = ["All", "Legal", "Brand", "CarePay", "Technology", "Fund", "NBFC", "Finance", "Program", "Platform"];

function MediaModal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[95vw] lg:w-[80vw] max-w-[1400px] h-[95vh] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button]:hidden">
        <div className="h-full overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default function KeyDevelopmentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [modal, setModal] = useState<KeyDevelopment | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ALL_DEVS.filter(d => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && d.category !== category) return false;
    if (tag !== "All" && !d.tags.includes(tag)) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const resetFilters = () => { setSearch(""); setCategory("All"); setTag("All"); setPage(1); };

  const Sidebar = () => (
    <nav aria-label="Key development filters" className="space-y-6">
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Search</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
          <label htmlFor="kd-search" className="sr-only">Search key developments</label>
          <input id="kd-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search developments..." className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00468e]/20 focus:border-[#00468e]" />
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
      <button onClick={resetFilters} aria-label="Reset all filters" className="w-full py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">Reset Filters</button>
    </nav>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* H1 Hero */}
      <header className="relative bg-[#111827] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" role="presentation" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00468e]/90 to-[#111827]/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3">Key Developments</h1>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li aria-hidden="true"><FaChevronRight className="text-xs text-gray-500" /></li>
              <li><span className="text-[#f4951d] font-medium" aria-current="page">Key Developments</span></li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="relative flex-1 min-w-[140px]">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
            <label htmlFor="kd-search-mob" className="sr-only">Search developments</label>
            <input id="kd-search-mob" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <div className="relative flex-shrink-0">
            <label htmlFor="cat-kd-mob" className="sr-only">Filter by category</label>
            <select id="cat-kd-mob" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="appearance-none pl-3 pr-7 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none cursor-pointer font-medium text-gray-700">
              {CATEGORIES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" aria-hidden="true" />
          </div>
          <button onClick={resetFilters} className="flex-shrink-0 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold border border-red-100">Reset</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Filters">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6"><Sidebar /></div>
          </aside>

          <section className="flex-1 min-w-0" aria-label="Key developments listing">
            <p className="text-sm text-gray-500 mb-6"><span className="font-bold text-[#00468e]">{filtered.length}</span> developments found</p>
            {paged.length === 0 ? (
              <div className="text-center py-20 text-gray-400" role="status">
                <FaChartLine className="text-5xl mx-auto mb-4 opacity-30" aria-hidden="true" />
                <h3 className="font-semibold text-lg">No developments found</h3>
                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="mt-4 text-[#f4951d] underline text-sm">Clear filters</button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" role="list">
                {paged.map(dev => (
                  <li key={dev.id}>
                    <article onClick={() => setModal(dev)} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group h-full flex flex-col">
                      <div className="relative h-44 overflow-hidden flex-shrink-0">
                        <img src={dev.image} alt={dev.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={176} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-[#00468e] text-white px-2 py-0.5 rounded-full">{dev.category}</span>
                        <span className="absolute bottom-3 left-3 text-[10px] text-white/80 bg-black/30 px-2 py-0.5 rounded-full">{dev.date}</span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-[#00468e] text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#f4951d] transition-colors">{dev.title}</h3>
                        <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mb-3 flex-1">{dev.summary}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[10px] text-[#0cab47] font-medium bg-green-50 px-2.5 py-1 rounded-full line-clamp-1 flex-1 mr-2">{dev.impact}</span>
                          <button className="inline-flex items-center gap-1 text-xs font-bold text-[#f4951d] flex-shrink-0" aria-label={`Read more about: ${dev.title}`}>More <FaArrowRight className="text-[10px]" aria-hidden="true" /></button>
                        </div>
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
              <button onClick={() => setModal(null)} aria-label="Close development details" className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"><FaTimes aria-hidden="true" /></button>
              <span className="absolute top-4 left-4 text-xs font-bold uppercase bg-[#00468e] text-white px-3 py-1.5 rounded-full">{modal.category}</span>
              <h2 className="absolute bottom-5 left-5 right-5 text-white font-extrabold text-xl md:text-3xl leading-tight">{modal.title}</h2>
            </div>
            <div className="p-6 md:p-10">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4"><FaCalendar className="text-[#f4951d]" aria-hidden="true" /><time dateTime={modal.date}>{modal.date}</time></div>
              <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                <FaChartLine className="text-[#0cab47] text-lg mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-xs font-bold text-[#0cab47] uppercase tracking-wider mb-0.5">Impact</h3>
                  <p className="text-gray-700 text-base font-medium">{modal.impact}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">{modal.tags.map(t => <span key={t} className="text-xs bg-blue-50 text-[#00468e] border border-blue-100 px-3 py-1 rounded-full">{t}</span>)}</div>
              <div className="space-y-4">
                {modal.fullContent.split("\n\n").map((p, i) => <p key={i} className="text-gray-700 text-base leading-relaxed">{p}</p>)}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 flex-wrap">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4951d] text-white font-semibold rounded-full text-sm hover:bg-[#e07d0a] transition-colors"><FaShare aria-hidden="true" />Share</button>
              </div>
            </div>
          </article>
        )}
      </MediaModal>
    </div>
  );
}