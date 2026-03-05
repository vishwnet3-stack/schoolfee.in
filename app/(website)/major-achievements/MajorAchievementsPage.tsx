"use client";
import { useState } from "react";
import {
  FaAward, FaTrophy, FaStar, FaUsers, FaHandHoldingHeart, FaGraduationCap, FaShieldAlt,
  FaSearch, FaCalendar, FaArrowRight, FaChevronDown, FaChevronLeft, FaChevronRight,
  FaTimes, FaShare,
} from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Achievement {
  id: number; title: string; date: string; category: string; award?: string;
  description: string; fullDescription: string; image: string; imageAlt: string;
  metric?: string; icon: "trophy" | "star" | "users" | "heart" | "graduation" | "shield"; tags: string[];
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "Thousands of Families Enrolled in First Month — Far Exceeding Initial Targets",
    date: "February 2026",
    category: "Growth",
    description: "Schoolfee's launch month saw extraordinary early adoption, with families across multiple Indian states enrolling at a pace that far outpaced initial projections — driven entirely by word-of-mouth and community trust.",
    fullDescription: `Schoolfee's launch month far exceeded all expectations, with families registering on the platform at a pace nobody on the team had anticipated. What began as a modest pilot quickly transformed into a movement, as parents across Delhi-NCR, Uttar Pradesh, Rajasthan, and Maharashtra spread the word to one another.

The overwhelming response validated a deeply held belief that India's middle-class families have long lacked access to a dignified, interest-free solution for school fee management. Traditional options — personal loans, credit card debt, fee delays — carry shame and financial burden. Schoolfee offered something different: community-backed support with no interest and no judgment.

A significant share of all enrollments came through direct referrals from existing members, a testament to the genuine enthusiasm families felt about the platform. Many members reported sharing the platform with three or more other parents within days of joining.

"We prepared for a strong response, but what we received was a wave of families who had been waiting for exactly this kind of support for years," said Schoolfee's Founding Director. "The trust families placed in us during our very first month is something we carry with immense responsibility."

Enrollment continued to accelerate week over week through the launch period, with no signs of plateau — suggesting that word-of-mouth momentum within school communities and residential societies is still building. The team has responded by expanding onboarding capacity and support staff to ensure every family receives the attention they deserve.`,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    imageAlt: "Indian school children in classroom representing thousands of families enrolled in Schoolfee",
    metric: "Record Enrollment",
    icon: "users",
    tags: ["Growth", "Enrollment", "Launch"]
  },
  {
    id: 2,
    title: "Recognised by NITI Aayog as an Emerging Social Enterprise in Education Finance",
    date: "January 2026",
    category: "Recognition",
    award: "NITI Aayog Emerging Social Enterprise 2026",
    description: "Schoolfee received formal recognition from NITI Aayog's education vertical as a promising social enterprise in the education finance space, acknowledging its innovative community-driven model.",
    fullDescription: `Schoolfee has been formally recognised by NITI Aayog's Education and Social Sector vertical as one of India's Emerging Social Enterprises in Education Finance for 2026 — a landmark acknowledgement from one of India's most influential policy bodies.

The recognition was the result of a rigorous evaluation process that assessed Schoolfee across several dimensions: its innovative approach to education financial inclusion, its Section 8 social enterprise structure that legally binds it to community benefit over profit, its demonstrated impact during the pilot phase, and its scalability potential across Tier 1, Tier 2, and Tier 3 cities.

NITI Aayog's selection process also considered governance quality, compliance frameworks, and the long-term sustainability of the operating model — all areas in which Schoolfee received strong assessments.

"Being recognised by NITI Aayog validates what thousands of families have already told us with their trust — that Schoolfee fills a real, urgent gap in India's education ecosystem," said the CEO of Community Health Mission. "It is both a validation of our past work and a responsibility for what lies ahead."

The recognition opens new pathways for Schoolfee in terms of government partnerships, policy dialogue, and potential integration into national education welfare frameworks. Preliminary conversations with several state education bodies are already underway.

Schoolfee was selected alongside a small cohort of organisations recognised in this cycle — each chosen for addressing a critical gap in India's social infrastructure with a scalable, sustainable, and community-rooted approach.`,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop",
    imageAlt: "Indian student reading representing NITI Aayog recognition of Schoolfee as emerging social enterprise",
    metric: "National Recognition",
    icon: "trophy",
    tags: ["Recognition", "NITI Aayog", "Award"]
  },
  {
    id: 3,
    title: "Substantial Fee Support Disbursed in Early Operations — With Zero Defaults Recorded",
    date: "February 2026",
    category: "Financial Impact",
    description: "Within the first weeks of operations, Schoolfee disbursed meaningful fee support to hundreds of families — and recorded a perfect repayment compliance rate, affirming the power of community trust.",
    fullDescription: `In a remarkable early demonstration of community trust and financial integrity, Schoolfee disbursed substantial interest-free fee support to families across India in its first months of operations — recording a perfect repayment compliance rate with zero defaults.

This outcome challenges a common assumption in financial services: that lower-income and middle-income households are high-risk borrowers. Schoolfee's experience has shown the opposite — when families are treated with dignity, offered genuine support with no exploitative terms, and given repayment timelines that work for them, they repay consistently and with gratitude.

The disbursement covered both regular fee support requests and emergency fund disbursements for families facing sudden crises such as job loss, medical emergencies, or other unexpected hardships. Each case was reviewed with care, and every family received personalised guidance from a Schoolfee family counselor.

"The zero-default record is not something we achieved through rigid enforcement or penalties. We achieved it by trusting families and treating them as partners, not debtors," said Schoolfee's Operations Head. "That is the philosophy at the heart of everything we do."

The average repayment period has been well within expected ranges, with many families choosing to repay ahead of schedule — and immediately re-enrolling for continued platform membership. Several families have written to Schoolfee expressing how the support prevented their children from missing school during a particularly difficult period.

As the platform scales, Schoolfee is confident that the zero-default track record will hold — because it is built not on financial pressure, but on community belonging and shared purpose.`,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop",
    imageAlt: "Indian mother and child representing families supported by Schoolfee interest-free fee disbursement",
    metric: "Zero Defaults",
    icon: "shield",
    tags: ["Finance", "Impact", "Milestone"]
  },
  {
    id: 4,
    title: "Rapidly Growing School Partnership Network Established Across Multiple Indian States",
    date: "January 2026",
    category: "Partnerships",
    description: "Schoolfee has built a strong and rapidly growing school partnership network spanning Delhi-NCR and neighbouring states, with more schools joining the programme every week.",
    fullDescription: `Schoolfee's School Partnership Programme has seen strong and accelerating uptake, with schools across Delhi, Uttar Pradesh, Haryana, Rajasthan, and Maharashtra joining the network in the weeks following the platform's launch.

Partner schools span a range of types and affiliations — from English-medium private schools to Hindi-medium community institutions — reflecting Schoolfee's commitment to serving the full breadth of India's middle-class education landscape rather than only the premium segment.

Each school that joins the Schoolfee partnership network receives access to a dedicated fee management dashboard, a designated relationship manager, and tools that help administrators communicate transparently and compassionately with parents about fee timelines. The goal is to transform fee conversations from sources of tension into moments of collaborative problem-solving.

"Schoolfee has fundamentally changed how we approach fee discussions with parents," said the principal of a partner school in Delhi-NCR. "We no longer have to be the bad guy. We can point families toward a genuine solution, and they come back to us with gratitude instead of resentment."

Partner schools have also reported meaningful improvements in fee collection timeliness and a significant reduction in the administrative burden associated with following up on delayed payments. More importantly, partner schools report that student attendance has improved — because children are no longer held back or sent home due to fee arrears.

The partnership network is expected to grow substantially over the coming months as Schoolfee expands its school onboarding team and extends its reach into new cities and states across India.`,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    imageAlt: "Indian school classroom with students representing Schoolfee's growing school partnership network",
    metric: "Growing Network",
    icon: "graduation",
    tags: ["Schools", "Partnership", "Growth"]
  },
  {
    id: 5,
    title: "Exceptional Parent Satisfaction Rates Recorded Across All Post-Interaction Surveys",
    date: "February 2026",
    category: "Quality",
    description: "Post-interaction surveys conducted across Schoolfee's registered families show consistently high satisfaction rates, with parents citing ease, transparency, and respectful service as key reasons for their trust.",
    fullDescription: `Schoolfee's post-interaction surveys, conducted across registered families in its pilot cities, have returned consistently high satisfaction scores — placing the platform among the highest-rated services in India's emerging education finance category.

Families most frequently cited three factors for their positive experience: the simplicity and speed of the application process, the genuine absence of any hidden charges or interest, and the tone and quality of support provided by Schoolfee's team members.

Many parents — particularly those from semi-urban backgrounds or those encountering a formal financial platform for the first time — noted that they had expected complexity, jargon, or pressure. Instead, they found clarity, patience, and genuine care. Several respondents used the Hindi word "izzat" (respect) to describe how they felt treated by the platform.

"We designed every step of the Schoolfee experience to feel like a conversation between equals — between a trusted community and a family that is doing its best," said Schoolfee's Head of Customer Experience. "These survey results tell us we are on the right path."

Multilingual support — with staff fluent in Hindi, Hinglish, and regional languages — was cited repeatedly as a key differentiator. Parents reported feeling more confident asking questions and understanding their repayment options when they could communicate in their preferred language.

The likelihood-to-recommend scores have been particularly notable, with the vast majority of surveyed families indicating they had already referred or planned to refer Schoolfee to other parents in their school community. This organic advocacy is one of the clearest indicators that Schoolfee is building genuine trust — not just users.`,
    image: "https://images.unsplash.com/photo-1593100126453-19b562a800c1?w=800&auto=format&fit=crop",
    imageAlt: "Indian family with school children reviewing education support on mobile phone representing high satisfaction rates",
    metric: "Highest Satisfaction",
    icon: "star",
    tags: ["Quality", "Survey", "Parents"]
  },
  {
    id: 6,
    title: "Emergency Education Support Fund Successfully Assists Families in Acute Financial Crisis",
    date: "February 2026",
    category: "Social Impact",
    description: "Schoolfee's Emergency Education Support Fund has delivered compassionate, rapid financial assistance to families facing sudden crises — ensuring no child misses school due to circumstances beyond their family's control.",
    fullDescription: `The Emergency Education Support Fund (EESF), one of the most distinct and human features of the Schoolfee platform, has delivered on its founding promise — ensuring that children from families facing sudden, acute financial hardship do not lose their place in school.

In its first weeks of operation, the EESF responded to families navigating some of the most difficult moments a household can face: sudden job losses, serious medical emergencies within the family, the death of an earning member, and the aftermath of local disasters. In every case, the fund moved quickly, disbursed support with minimal friction, and paired financial assistance with compassionate counseling.

Applications to the EESF are reviewed on a priority basis. Unlike standard fee support, emergency cases are assessed within hours, and successful applicants typically receive disbursement the same day or the following morning. The speed of response has been one of the most praised aspects of the fund by recipient families.

"My husband lost his job suddenly. I had no idea how I would pay my son's fees for the month. A neighbour told me about Schoolfee. Within two days, the fees were paid. My son never knew there was a problem," shared a mother from Delhi-NCR who accessed the emergency fund.

Every family that has received EESF support has expressed an intention to repay and continue as active Schoolfee community members — many also expressing a desire to contribute back to the fund once their own situation stabilises, embodying the pay-it-forward spirit the platform was built on.

The EESF is sustained through a combination of Schoolfee's operational corpus, contributions from community members who choose to donate points or funds to the pool, and support from Community Health Mission and India Health Fund Limited.`,
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&auto=format&fit=crop",
    imageAlt: "Indian school children in uniform representing families protected by Schoolfee's Emergency Education Support Fund",
    metric: "Families Protected",
    icon: "heart",
    tags: ["Emergency", "Fund", "Impact", "Social"]
  },
];

const CATEGORIES = ["All", "Growth", "Recognition", "Financial Impact", "Partnerships", "Quality", "Social Impact"];
const TAGS = ["All", "Growth", "Recognition", "Finance", "Schools", "Quality", "Impact", "Emergency", "Award", "Launch"];

function AchievementIcon({ type }: { type: Achievement["icon"] }) {
  const map = { trophy: <FaTrophy />, star: <FaStar />, users: <FaUsers />, heart: <FaHandHoldingHeart />, graduation: <FaGraduationCap />, shield: <FaShieldAlt /> };
  return <>{map[type]}</>;
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

export default function MajorAchievementsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [modal, setModal] = useState<Achievement | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ALL_ACHIEVEMENTS.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && a.category !== category) return false;
    if (tag !== "All" && !a.tags.includes(tag)) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const resetFilters = () => { setSearch(""); setCategory("All"); setTag("All"); setPage(1); };

  const Sidebar = () => (
    <nav aria-label="Achievement filters" className="space-y-6">
      <div>
        <h2 className="font-bold text-[#00468e] text-sm uppercase tracking-wider mb-3">Search</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
          <label htmlFor="ach-search" className="sr-only">Search achievements</label>
          <input id="ach-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search achievements..." className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00468e]/20 focus:border-[#00468e]" />
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
          {TAGS.map(t => <button key={t} onClick={() => { setTag(t); setPage(1); }} aria-pressed={tag === t} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${tag === t ? "bg-[#f4951d] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>)}
        </div>
      </div>
      {/* Impact Summary Widget — qualitative */}
      <div className="bg-gradient-to-br from-[#00468e] to-[#003366] rounded-xl p-4 text-white">
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-blue-200">Impact at a Glance</h3>
        <dl className="space-y-2">
          {[["Record", "Family Enrollments"], ["Zero", "Defaults Recorded"], ["Growing", "School Network"], ["National", "NITI Aayog Recognition"]].map(([val, lbl]) => (
            <div key={lbl} className="flex items-center justify-between">
              <dt className="text-xs text-blue-200">{lbl}</dt>
              <dd className="text-sm font-extrabold text-[#f4951d]">{val}</dd>
            </div>
          ))}
        </dl>
      </div>
      <button onClick={resetFilters} aria-label="Reset all filters" className="w-full py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">Reset Filters</button>
    </nav>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* H1 Hero */}
      <header className="relative bg-[#111827] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" role="presentation" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00468e]/90 to-[#111827]/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3">Major Achievements</h1>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li aria-hidden="true"><FaChevronRight className="text-xs text-gray-500" /></li>
              <li><span className="text-[#f4951d] font-medium" aria-current="page">Major Achievements</span></li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="relative flex-1 min-w-[140px]">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true" />
            <label htmlFor="ach-search-mob" className="sr-only">Search achievements</label>
            <input id="ach-search-mob" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          {[{ id: "cat-ach-mob", label: "Category", value: category, options: CATEGORIES, setter: setCategory }, { id: "tag-ach-mob", label: "Tag", value: tag, options: TAGS, setter: setTag }].map(f => (
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

          <section className="flex-1 min-w-0" aria-label="Major achievements listing">
            <p className="text-sm text-gray-500 mb-6"><span className="font-bold text-[#00468e]">{filtered.length}</span> achievements found</p>
            {paged.length === 0 ? (
              <div className="text-center py-20 text-gray-400" role="status">
                <FaAward className="text-5xl mx-auto mb-4 opacity-30" aria-hidden="true" />
                <h3 className="font-semibold text-lg">No achievements found</h3>
                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="mt-4 text-[#f4951d] underline text-sm">Clear filters</button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" role="list">
                {paged.map(ach => (
                  <li key={ach.id}>
                    <article onClick={() => setModal(ach)} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group h-full flex flex-col">
                      <div className="relative h-44 overflow-hidden flex-shrink-0">
                        <img src={ach.image} alt={ach.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={176} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                        <div className="absolute top-3 left-3 w-9 h-9 bg-[#f4951d] rounded-xl flex items-center justify-center text-white text-sm shadow-lg" aria-hidden="true">
                          <AchievementIcon type={ach.icon} />
                        </div>
                        {ach.metric && (
                          <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg px-2.5 py-1 shadow">
                            <p className="text-[#00468e] font-extrabold text-xs">{ach.metric}</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        {ach.award && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#f4951d] font-bold uppercase tracking-wider mb-2 bg-orange-50 px-2 py-0.5 rounded-full w-fit">
                            <FaTrophy className="text-[9px]" aria-hidden="true" />{ach.award}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <FaCalendar className="text-[#0cab47]" aria-hidden="true" />
                          <time dateTime={ach.date}>{ach.date}</time>
                        </div>
                        <h3 className="font-bold text-[#00468e] text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#f4951d] transition-colors">{ach.title}</h3>
                        <p className="text-gray-600 text-base leading-relaxed line-clamp-2 mb-3 flex-1">{ach.description}</p>
                        <button className="inline-flex items-center gap-1 text-xs font-bold text-[#f4951d] mt-auto" aria-label={`View achievement details: ${ach.title}`}>
                          View Achievement <FaArrowRight className="text-[10px]" aria-hidden="true" />
                        </button>
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
              <button onClick={() => setModal(null)} aria-label="Close achievement details" className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"><FaTimes aria-hidden="true" /></button>
              <div className="absolute top-4 left-4 w-11 h-11 bg-[#f4951d] rounded-xl flex items-center justify-center text-white text-lg shadow-lg" aria-hidden="true"><AchievementIcon type={modal.icon} /></div>
              {modal.metric && (
                <div className="absolute top-4 right-16 bg-white/95 rounded-xl px-3 py-2 shadow-lg">
                  <p className="text-[#00468e] font-extrabold text-sm">{modal.metric}</p>
                </div>
              )}
              <h2 className="absolute bottom-5 left-5 right-5 text-white font-extrabold text-xl md:text-3xl leading-tight">{modal.title}</h2>
            </div>
            <div className="p-6 md:p-10">
              {modal.award && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 mb-5 w-fit">
                  <FaTrophy className="text-[#f4951d]" aria-hidden="true" />
                  <span className="text-sm font-bold text-[#f4951d]">{modal.award}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <FaCalendar className="text-[#0cab47]" aria-hidden="true" />
                <time dateTime={modal.date}>{modal.date}</time>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">{modal.tags.map(t => <span key={t} className="text-xs bg-blue-50 text-[#00468e] border border-blue-100 px-3 py-1 rounded-full">{t}</span>)}</div>
              <div className="space-y-4">
                {modal.fullDescription.split("\n\n").map((p, i) => <p key={i} className="text-gray-700 text-base leading-relaxed">{p}</p>)}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 flex-wrap">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4951d] text-white font-semibold rounded-full text-sm hover:bg-[#e07d0a] transition-colors"><FaShare aria-hidden="true" />Share Achievement</button>
              </div>
            </div>
          </article>
        )}
      </MediaModal>
    </div>
  );
}