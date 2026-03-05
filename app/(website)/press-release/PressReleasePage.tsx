"use client";
import { useState } from "react";
import {
  FaNewspaper, FaSearch, FaCalendar, FaTag, FaClock, FaShare,
  FaLink, FaArrowRight, FaChevronDown, FaChevronLeft, FaChevronRight, FaTimes,
} from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PressRelease {
  id: number; title: string; date: string; source: string; category: string;
  excerpt: string; fullContent: string; image: string; imageAlt: string; tags: string[]; readTime: string;
}

const ALL_PRESS: PressRelease[] = [
  {
    id: 1,
    title: "Schoolfee Launches India's First Interest-Free School Fee Support Platform for Middle-Class Families",
    date: "February 10, 2026",
    source: "Press Trust of India",
    category: "Launch",
    excerpt: "Community Health Mission and India Health Fund Limited jointly introduce Schoolfee.in — a pioneering fee-support platform enabling parents to pay school fees on time, without interest or hidden charges.",
    fullContent: `Community Health Mission (CHM) and India Health Fund Limited have officially launched Schoolfee.in, a first-of-its-kind fee-support platform designed to remove financial barriers in school education for India's middle-class families.

The platform empowers parents of students from Nursery to Class 9 to receive timely fee support and repay the amount completely interest-free, with no hidden charges, processing fees, or penalties.

"Every child deserves uninterrupted access to quality educ  ation. A temporary financial shortfall should never be the reason a child misses school or falls behind on fees," said the Founding Director of Schoolfee at the launch event held in New Delhi.

The platform is built on three core pillars — accessibility, dignity, and community. Families can apply for support within minutes, receive approvals quickly, and repay at a pace that works for them — without the anxiety of mounting interest.

Schoolfee's launch marks a meaningful shift in how education finance is approached in India. Rather than burdening families with traditional loan structures, the platform operates as a community-backed support system where members help each other stay financially stable during the academic year.

The launch was attended by representatives from leading educational institutions, social sector organisations, and officials from the Ministry of Education, who expressed strong support for the initiative's vision and potential for national scale.`,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
    imageAlt: "Indian parents and school children at an education support platform launch event in New Delhi",
    tags: ["Launch", "Education Finance", "CHM", "CarePay"],
    readTime: "4 min read"
  },
  {
    id: 2,
    title: "Schoolfee Onboards Leading Schools Across Delhi-NCR Under its School Partnership Programme",
    date: "January 28, 2026",
    source: "Education Times",
    category: "Partnership",
    excerpt: "In a landmark step toward uninterrupted education, Schoolfee has formalized partnerships with a growing number of schools across Delhi-NCR, bringing its interest-free fee support directly to school communities.",
    fullContent: `Schoolfee has formalized partnerships with a growing number of schools across Delhi-NCR under its flagship School Partnership Programme, bringing its interest-free fee support model directly into the heart of school communities.

Under the programme, partner schools gain access to a dedicated fee management dashboard, priority support for student and parent queries, and direct integration with Schoolfee's emergency support pool for families facing sudden financial hardship.

"We believe that a strong school-parent relationship should never be strained by fee delays. Our platform exists to protect that relationship and keep children in classrooms," said a senior official from Schoolfee's School Relationship team.

Partner schools benefit from reduced administrative burden around fee follow-ups, improved on-time collections, and access to Schoolfee's family counseling resources — tools that help schools focus on education rather than collections.

Each partner school is assigned a dedicated Schoolfee relationship manager who conducts monthly reviews and provides impact reports, helping school administrators understand how the programme is supporting their parent community.

Schoolfee plans to rapidly expand its school network beyond Delhi-NCR over the coming months, with onboarding already underway in select cities across Uttar Pradesh, Haryana, and Rajasthan.`,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    imageAlt: "Indian school classroom with students and teacher, partner school of Schoolfee programme in Delhi-NCR",
    tags: ["Partnership", "Schools", "Delhi-NCR"],
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Schoolfee's Community Points Programme Gains Strong Early Traction Among Indian Families",
    date: "January 15, 2026",
    source: "Financial Express",
    category: "Milestone",
    excerpt: "Schoolfee's Community Points reward system has generated enthusiastic early uptake from families across its pilot cities, establishing itself as one of the platform's most popular features.",
    fullContent: `Schoolfee's Community Points Programme has seen strong early adoption among families across its pilot cities, significantly exceeding the team's initial expectations and validating the community-driven model at the heart of the platform.

The programme rewards families for active participation in the Schoolfee ecosystem — from referring other families to completing their repayment on time. Points can be redeemed to offset future fee support amounts, creating a virtuous cycle of community benefit.

The four-tier membership structure — Bronze, Silver, Gold, and Life Member — has resonated deeply with families, who see advancement through tiers as both a financial benefit and a mark of trust within their community.

"We designed Community Points not just as a loyalty programme but as a reflection of how Indian families have always supported each other during difficult times. We're simply formalising that spirit," explained Schoolfee's Product Head.

Families in the pilot have praised the simplicity of earning and redeeming points, with many reporting that the programme has encouraged them to bring other parents into the Schoolfee community — organically growing the platform's reach without traditional marketing spend.

The Emergency Support Pool, which members can contribute to and draw from in times of acute need, has also seen meaningful participation, reflecting genuine community ownership of the platform's mission.`,
    image: "https://images.unsplash.com/photo-1593100126453-19b562a800c1?w=800&auto=format&fit=crop",
    imageAlt: "Indian family with school-age children reviewing education support options on a mobile phone",
    tags: ["Community Points", "Milestone", "Pilot"],
    readTime: "3 min read"
  },
  {
    id: 4,
    title: "Schoolfee, CHM, and India Health Fund Sign MOU to Establish NBFC-Backed Education Credit Line",
    date: "December 20, 2025",
    source: "Business Standard",
    category: "Finance",
    excerpt: "A landmark Memorandum of Understanding has been signed to create a dedicated NBFC-backed credit facility that will power Schoolfee's interest-free fee support infrastructure at national scale.",
    fullContent: `Schoolfee, Community Health Mission (CHM), and India Health Fund Limited have signed a Memorandum of Understanding (MOU) to establish a dedicated NBFC-backed education credit line — a foundational step in scaling the platform's reach to millions of families across India.

The credit facility will enable Schoolfee to sustainably expand its fee support operations while maintaining its core commitment of zero interest and zero hidden costs for parent families. The NBFC partnership ensures that all operations are conducted within a regulated, compliant lending framework.

"This MOU is not just a financial agreement. It is a commitment to the idea that education financing in India must evolve — away from exploitative interest structures and toward community-centered, dignified support systems," said the CEO of Community Health Mission at the signing ceremony.

Key elements of the MOU include the establishment of a structured credit facility, a zero-cost EMI framework for all participating families, rigorous quarterly audits, and a multi-state expansion roadmap targeting significant presence across India by 2027.

The agreement also includes provisions for an impact measurement framework, ensuring that disbursements are tracked not just financially but in terms of educational outcomes — measuring attendance continuity, reduced dropout risk, and family financial health.

The MOU was signed in the presence of financial regulators, education sector stakeholders, and representatives from the social enterprise community, all of whom expressed confidence in the model's long-term viability and replicability.`,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
    imageAlt: "MOU signing ceremony for Schoolfee NBFC education credit line with Indian education and finance officials",
    tags: ["MOU", "NBFC", "Finance", "Scale"],
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "NITI Aayog Recognises Schoolfee as an Emerging Social Enterprise in Education Finance",
    date: "November 30, 2025",
    source: "The Hindu",
    category: "Recognition",
    excerpt: "NITI Aayog's education vertical has formally acknowledged Schoolfee as one of India's notable Emerging Social Enterprises, recognising its innovative approach to education financial inclusion.",
    fullContent: `Schoolfee has received formal recognition from NITI Aayog's Education and Social Sector vertical as one of India's Emerging Social Enterprises in Education Finance — an acknowledgement that underscores the platform's growing significance in India's education ecosystem.

The recognition was based on a comprehensive evaluation of Schoolfee's approach to financial inclusion in education, its Section 8 social enterprise structure, its demonstrated impact during the pilot phase, and the scalability of its model across India's diverse urban and semi-urban landscapes.

"Being acknowledged by NITI Aayog reaffirms what we have always believed — that there is a genuine, urgent gap in the market when it comes to dignified, interest-free financial support for middle-class families managing school fees," said the CEO of Community Health Mission.

The NITI Aayog recognition opens new doors for Schoolfee in terms of government partnerships, policy dialogue, and potential inclusion in national education financing frameworks. Schoolfee has already begun preliminary conversations with state government bodies interested in integrating the platform's model into their education welfare programmes.

The platform's Section 8 structure — which legally binds it to operate for social benefit rather than profit — was a key factor in the recognition, distinguishing Schoolfee from commercial edtech lending products that often carry high interest and predatory terms.

Schoolfee joins a small cohort of social enterprises recognised in this cycle, each selected for addressing a critical gap in India's social infrastructure with a scalable, sustainable, and community-rooted solution.`,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop",
    imageAlt: "Indian student reading a book representing education equity and social enterprise recognition",
    tags: ["NITI Aayog", "Recognition", "Award"],
    readTime: "3 min read"
  },
  {
    id: 6,
    title: "Schoolfee's Emergency Education Support Fund Maintains Perfect Repayment Record in Early Operations",
    date: "November 10, 2025",
    source: "Hindustan Times",
    category: "Finance",
    excerpt: "Schoolfee's Emergency Education Support Fund has successfully supported families in financial crisis during its early operations, recording a remarkable repayment compliance rate and reaffirming the community trust model.",
    fullContent: `Schoolfee's Emergency Education Support Fund (EESF) has demonstrated strong early performance, supporting families facing acute financial distress during the school year while maintaining an impressive repayment compliance record that validates the platform's trust-based approach.

The EESF is designed for families who face sudden, unexpected financial hardship — such as a medical emergency, job loss, or family crisis — that puts their child's school fee payment at risk. Rather than penalising families in their most vulnerable moments, the fund steps in quickly with zero-interest support and a compassionate repayment approach.

"The repayment record of our early participants speaks to something profound — when families are treated with dignity and trust, they reciprocate with integrity. This is the foundation of everything we are building at Schoolfee," said the platform's Operations Director.

Families supported through the EESF complete a simple online application, receive a decision within a short turnaround, and work with a Schoolfee family counselor to determine a repayment timeline that fits their situation. There is no pressure, no penalty, and no shame attached to accessing the fund.

The fund is sustained by a combination of the platform's operational reserves, contributions from Community Points members who choose to donate points to the pool, and support from CHM and India Health Fund Limited.

As Schoolfee scales nationally, the EESF is expected to become one of its most impactful arms — a genuine safety net for the lakhs of Indian middle-class families who currently have no formal recourse when a temporary financial crisis threatens their child's education.`,
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&auto=format&fit=crop",
    imageAlt: "Indian school children in uniform representing the families supported by Schoolfee's Emergency Education Support Fund",
    tags: ["Fund", "Finance", "Milestone"],
    readTime: "3 min read"
  },
];

const CATEGORIES = ["All", "Launch", "Partnership", "Milestone", "Finance", "Recognition"];
const SOURCES = ["All", "Press Trust of India", "Education Times", "Financial Express", "Business Standard", "The Hindu", "Hindustan Times"];
const TAGS = ["All", "Launch", "Partnership", "Schools", "Finance", "NBFC", "Community Points", "Recognition", "CHM", "CarePay"];

function MediaModal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-none w-[95vw] lg:w-[80vw] max-w-[1400px] h-[95vh] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button]:hidden">
        <div className="h-full overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default function PressReleasePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [source, setSource] = useState("All");
  const [tag, setTag] = useState("All");
  const [modal, setModal] = useState<PressRelease | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ALL_PRESS.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && p.category !== category) return false;
    if (source !== "All" && p.source !== source) return false;
    if (tag !== "All" && !p.tags.includes(tag)) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const resetFilters = () => { setSearch(""); setCategory("All"); setSource("All"); setTag("All"); setPage(1); };

  const Sidebar = () => (
    <nav aria-label="Press release filters" className="space-y-6">
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Search</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
          <label htmlFor="pr-search" className="sr-only">Search press releases</label>
          <input id="pr-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search keywords..." className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00468e]/20 focus:border-[#00468e]" />
        </div>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Category</h2>
        <ul className="space-y-1.5">
          {CATEGORIES.map(c => <li key={c}><button onClick={() => { setCategory(c); setPage(1); }} aria-pressed={category === c} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${category === c ? "bg-[#00468e] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>{c}</button></li>)}
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Source</h2>
        <ul className="space-y-1.5">
          {SOURCES.map(s => <li key={s}><button onClick={() => { setSource(s); setPage(1); }} aria-pressed={source === s} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${source === s ? "bg-[#0cab47] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>{s}</button></li>)}
        </ul>
      </div>
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => <button key={t} onClick={() => { setTag(t); setPage(1); }} aria-pressed={tag === t} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${tag === t ? "bg-[#0cab47] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>)}
        </div>
      </div>
      <button onClick={resetFilters} aria-label="Reset all filters" className="w-full py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">Reset Filters</button>
    </nav>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* SEO Hero — H1 */}
      <header className="relative bg-[#111827] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" role="presentation" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00468e]/90 to-[#111827]/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3">Press Releases</h1>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li aria-hidden="true"><FaChevronRight className="text-xs text-gray-500" /></li>
              <li><span className="text-[#f4951d] font-medium" aria-current="page">Press Releases</span></li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="relative flex-1 min-w-[140px]">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
            <label htmlFor="pr-search-mob" className="sr-only">Search press releases</label>
            <input id="pr-search-mob" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          {[{ id: "cat-mob", label: "Category", value: category, options: CATEGORIES, setter: setCategory }, { id: "src-mob", label: "Source", value: source, options: SOURCES, setter: setSource }].map(f => (
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

          <section className="flex-1 min-w-0" aria-label="Press release listing">
            <p className="text-sm text-gray-500 mb-6"><span className="font-bold text-[#00468e]">{filtered.length}</span> results found</p>
            {paged.length === 0 ? (
              <div className="text-center py-20 text-gray-400" role="status">
                <FaNewspaper className="text-5xl mx-auto mb-4 opacity-30" aria-hidden="true" />
                <h3 className="font-semibold text-lg">No press releases found</h3>
                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="mt-4 text-[#f4951d] underline text-sm">Clear filters</button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" role="list">
                {paged.map(pr => (
                  <li key={pr.id}>
                    <article onClick={() => setModal(pr)} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group h-full flex flex-col">
                      <div className="relative h-44 overflow-hidden flex-shrink-0">
                        <img src={pr.image} alt={pr.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={176} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-[#0cab47] text-white px-2 py-0.5 rounded-full">{pr.category}</span>
                        <span className="absolute bottom-3 right-3 text-[10px] text-white/80 bg-black/30 px-2 py-0.5 rounded-full">{pr.readTime}</span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <FaCalendar className="text-[#f4951d]" aria-hidden="true" />
                          <time dateTime={pr.date}>{pr.date}</time>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-[#00468e] truncate">{pr.source}</span>
                        </div>
                        <h3 className="font-bold text-[#00468e] text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#f4951d] transition-colors">{pr.title}</h3>
                        <p className="text-gray-600 text-base leading-relaxed line-clamp-2 mb-3 flex-1">{pr.excerpt}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex gap-1.5 flex-wrap">{pr.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] bg-blue-50 text-[#00468e] px-2 py-0.5 rounded-full">{t}</span>)}</div>
                          <button className="inline-flex items-center gap-1 text-xs font-bold text-[#f4951d] flex-shrink-0 ml-2" aria-label={`Read: ${pr.title}`}>View <FaArrowRight className="text-[10px]" aria-hidden="true" /></button>
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

      {/* Modal */}
      <MediaModal isOpen={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <article>
            <div className="relative h-64 md:h-80">
              <img src={modal.image} alt={modal.imageAlt} className="w-full h-full object-cover" width={1200} height={400} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" aria-hidden="true" />
              <button onClick={() => setModal(null)} aria-label="Close press release" className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"><FaTimes aria-hidden="true" /></button>
              <span className="absolute top-4 left-4 text-xs font-bold uppercase bg-[#0cab47] text-white px-3 py-1.5 rounded-full">{modal.category}</span>
              <h2 className="absolute bottom-5 left-5 right-5 text-white font-extrabold text-xl md:text-3xl leading-tight">{modal.title}</h2>
            </div>
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><FaCalendar className="text-[#f4951d]" aria-hidden="true" /><time dateTime={modal.date}>{modal.date}</time></span>
                <span className="flex items-center gap-1.5"><FaNewspaper className="text-[#00468e]" aria-hidden="true" />{modal.source}</span>
                <span className="flex items-center gap-1.5"><FaClock className="text-[#0cab47]" aria-hidden="true" />{modal.readTime}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {modal.tags.map(t => <span key={t} className="text-xs bg-blue-50 text-[#00468e] border border-blue-100 px-3 py-1 rounded-full"><FaTag className="inline mr-1 text-[9px]" aria-hidden="true" />{t}</span>)}
              </div>
              <div className="space-y-4">
                {modal.fullContent.split("\n\n").map((para, i) => <p key={i} className="text-gray-700 text-base leading-relaxed">{para}</p>)}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 flex-wrap">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4951d] text-white font-semibold rounded-full text-sm hover:bg-[#e07d0a] transition-colors"><FaShare aria-hidden="true" />Share Release</button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-full text-sm hover:bg-gray-50 transition-colors"><FaLink aria-hidden="true" />Copy Link</button>
              </div>
            </div>
          </article>
        )}
      </MediaModal>
    </div>
  );
}   