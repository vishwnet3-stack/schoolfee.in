// app/invitation/InvitationSchoolfee.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    FaCheckCircle,
    FaShieldAlt,
    FaBell,
    FaMobileAlt,
    FaLock,
    FaCreditCard,
    FaChartBar,
    FaGlobe,
    FaTimes,
    FaChevronDown,
    FaBars,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaInstagram,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

// Indian Flag SVG Component
const IndiaFlag = () => (
    <svg width="24" height="16" viewBox="0 0 225 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="225" height="150" fill="#fff" />
        <rect width="225" height="50" fill="#FF9933" />
        <rect y="50" width="225" height="50" fill="#fff" />
        <rect y="100" width="225" height="50" fill="#138808" />
        <circle cx="112.5" cy="75" r="20" fill="#000080" />
        <circle cx="112.5" cy="75" r="17.5" fill="#fff" />
        <circle cx="112.5" cy="75" r="3.5" fill="#000080" />
        {[...Array(24)].map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 112.5 + 17.5 * Math.cos(angle);
            const y1 = 75 + 17.5 * Math.sin(angle);
            const x2 = 112.5 + 3.5 * Math.cos(angle);
            const y2 = 75 + 3.5 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="0.5" />;
        })}
    </svg>
);

export default function LandingPage() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [bottomMobileNumber, setBottomMobileNumber] = useState('');
    const [queryEmail, setQueryEmail] = useState('');
    const [errors, setErrors] = useState({ mobile: '', terms: '', bottomMobile: '', queryEmail: '' });
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [queryText, setQueryText] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Main Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [modalData, setModalData] = useState({
        role: 'Parent Member',
        name: '',
        city: '',
        mobile: '',
        email: '',
        optIn: false,
    });

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 5000);
    };

    // ===== UPDATE showError FUNCTION =====
    const showError = (field: 'mobile' | 'bottomMobile' | 'terms' | 'queryEmail', message: string) => {
        setErrors(prev => ({ ...prev, [field]: message }));
        setTimeout(() => {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }, 5000);
    };

    // Quick signup for hero section
    const handleGetStarted = async () => {
        const newErrors = { mobile: '', terms: '', bottomMobile: '' };
        let isValid = true;

        if (!mobileNumber) {
            newErrors.mobile = 'Mobile number is required';
            isValid = false;
        } else if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }

        // if (!isValid) {
        //     setErrors(newErrors);
        //     return;
        // }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/invitation/quick-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: mobileNumber,
                    source: 'hero',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setModalData({ ...modalData, mobile: mobileNumber });
                setIsModalOpen(true);
                setModalStep(1);
                setMobileNumber('');
                // setErrors({ mobile: '', terms: '', bottomMobile: '' });
            } else {
                showError('mobile', data.error || 'Failed to save mobile number');
            }
        } catch (error) {
            console.error('Quick signup error:', error);
            showError('mobile', 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Quick signup for bottom CTA
    const handleBottomCTA = async () => {
        const newErrors = { mobile: '', terms: '', bottomMobile: '' };
        let isValid = true;

        if (!bottomMobileNumber) {
            newErrors.bottomMobile = 'Mobile number is required';
            isValid = false;
        } else if (!/^[6-9]\d{9}$/.test(bottomMobileNumber)) {
            newErrors.bottomMobile = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }

        // if (!isValid) {
        //     setErrors(newErrors);
        //     return;
        // }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/invitation/quick-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: bottomMobileNumber,
                    source: 'cta_bottom',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setModalData({ ...modalData, mobile: bottomMobileNumber });
                setIsModalOpen(true);
                setModalStep(1);
                setBottomMobileNumber('');
                // setErrors({ mobile: '', terms: '', bottomMobile: '' });
            } else {
                showError('bottomMobile', data.error || 'Failed to save mobile number');
            }
        } catch (error) {
            console.error('Quick signup error:', error);
            showError('bottomMobile', 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };  

    // Handle query submission
    const handleQuerySubmit = async () => {
        // Validation - Email is REQUIRED
        if (!queryEmail || queryEmail.trim().length === 0) {
            showError('queryEmail', 'Email address is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(queryEmail)) {
            showError('queryEmail', 'Please enter a valid email address');
            return;
        }

        // Validation - Query text
        if (!queryText || queryText.trim().length < 10) {
            showError('queryEmail', 'Please enter at least 10 characters in your query');
            return;
        }

        if (queryText.trim().length > 5000) {
            showError('queryEmail', 'Query is too long. Maximum 5000 characters allowed.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/invitation/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: queryText.trim(),
                    email: queryEmail.trim()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ SUCCESS - Show success toast
                showSuccess(data.message || 'Your query has been submitted successfully! We will contact you within 2 working days.');
                setQueryText('');
                setQueryEmail('');
            } else {
                // ❌ ERROR - Show error toast
                showError('queryEmail', data.error || 'Failed to submit query. Please try again.');
            }
        } catch (error) {
            console.error('Query submission error:', error);
            // ❌ NETWORK ERROR - Show error toast
            showError('queryEmail', 'Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openModal = (prefRole = 'Parent Member') => {
        setModalData({
            role: prefRole,
            name: '',
            city: '',   
            mobile: modalData.mobile || '',     
            email: '',
            optIn: false
        });
        setIsModalOpen(true);
        setModalStep(1);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalStep(1);
    };

    const handleFormSubmit = async () => {
        if (modalStep === 1) {
            const { name, city, mobile, email } = modalData;

            // Validation
            if (!name || name.trim().length < 2) {
                alert('Please enter a valid name (at least 2 characters)');
                return;
            }

            if (!city || city.trim().length < 2) {
                alert('Please enter a valid city name');
                return;
            }

            if (!/^[6-9]\d{9}$/.test(mobile)) {
                alert('Please enter a valid 10-digit Indian mobile number');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            setIsSubmitting(true);

            try {
                const response = await fetch('/api/invitation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        role: modalData.role,
                        name: name.trim(),
                        city: city.trim(),
                        mobile,
                        email: email.trim().toLowerCase(),
                        optIn: modalData.optIn,
                        source: 'modal',
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setModalStep(2);
                    showSuccess(data.message || 'Registration successful!');
                } else {
                    alert(data.error || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Network error. Please check your connection and try again.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            closeModal();
        }
    };

    const handleModalInputChange = (field: keyof typeof modalData, value: string | boolean) => {
        setModalData({ ...modalData, [field]: value });
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    // ... (rest of your existing constants like successStories, goals, partnerTypes, etc. remain the same)
    const successStories = [
        {
            name: 'Vikram Rawat',
            business: 'Parent',
            category: 'Sanitaryware Dealers',
            description: 'An inspiring program aligning families, schools, and society to protect academic stability without turning distress into profit.',
            bgColor: 'bg-pink-50',
            image: '/landing-page/vikram-rawat.webp',
        },
        {
            name: 'Shikha Munjal',
            business: 'Teacher',
            category: 'Makeup Artist',
            description: 'Schoolfee is a breakthrough social security model protecting children education with dignity, speed, and zero financial exploitation.',
            bgColor: 'bg-blue-50',
            image: '/landing-page/shikha munjal.webp',
        },
        {
            name: 'Gourab Neogi',
            business: 'Parent',
            category: 'Computer Training Institute',
            description: 'This model strengthens educational stability by preventing fee-related disruptions and sustainable support ecosystem.',
            bgColor: 'bg-blue-50',
            image: '/landing-page/suresh-sharma.webp',
        },
    ];

    const goals = [
        {
            svg: '/landing-page/Protect Education Continuity.webp',
            title: 'Protect Education\nContinuity',
        },
        {
            svg: '/landing-page/Support Families in Distress.webp',
            title: 'Support Families\nin Distress',
        },
        {
            svg: '/landing-page/Build Community Resilience.webp',
            title: 'Build Community\nResilience',
        },
    ];

    const partnerTypes = [
        {
            title: 'Partner School',
            benefits: [
                'Timely payments and stronger relationships',
                'Simple student verification workflow',
                'Reduced dropouts and classroom disruption',
            ],
            cta: 'Partner School',
            image: '/landing-page/partner-school.webp',
        },
        {
            title: 'CSR / Corporate Partner',
            benefits: [
                'Impact reporting and city/zone targeting',
                'Transparent governance framework',
                'Visible social security contribution',
            ],
            cta: 'CSR Partner',
            image: '/landing-page/csr-corporate-partner.webp',
        },
        {
            title: 'Donor / Community Partner',
            benefits: [
                'Support verified students with dignity',
                'Monthly updates and outcomes',
                'Help expand the resilience pool',
            ],
            cta: 'Donor/Community',
            image: '/landing-page/donor-community-partner.webp',
        },
    ];

    const steps = [
        {
            num: 1,
            title: 'Become a Member',
            points: [
                'Join Schoolfee.in',
                'Choose your role (Parent/School/CSR/Donor)',
                'Access the single-window system',
            ],
        },
        {
            num: 2,
            title: 'Participate for 6 Months',
            points: [
                'Pay regular school fees via platform',
                'Build contribution discipline',
                'Strengthen community pool',
            ],
        },
        {
            num: 3,
            title: 'Unlock Emergency Support',
            points: [
                'Temporary distress occurs',
                'Confidential verification within 48 hours',
                'Fee paid directly to school',
            ],
        },
        {
            num: 4,
            title: 'Earn Community Points',
            points: [
                'Points support books, uniforms',
                'Donate points to help others',
                'Recognition for founding contributors',
            ],
        },
    ];

    const features = [
        {
            icon: MdDashboard,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-100',
            title: '0% Interest Support',
            description: 'No profit-linked distress support - pure community assistance',
        },
        {
            icon: FaShieldAlt,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-100',
            title: '48 Hours Verification',
            description: 'Confidential, respectful verification process within 2 working days',
        },
        {
            icon: FaGlobe,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-100',
            title: 'Direct School Payment',
            description: 'Fee is paid directly to school ensuring education continuity',
        },
        {
            icon: FaCheckCircle,
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            title: 'Dignified Process',
            description: 'Humanless, single-window, simple process maintaining dignity',
        },
        {
            icon: FaCreditCard,
            iconColor: 'text-teal-600',
            bgColor: 'bg-teal-100',
            title: 'Community Points',
            description: 'Earn points for participation, redeem for educational support',
        },
        {
            icon: FaMobileAlt,
            iconColor: 'text-orange-500',
            bgColor: 'bg-orange-100',
            title: 'Tech-Driven Platform',
            description: 'Modern technology ensuring transparency and efficiency',
        },
        {
            icon: FaChartBar,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-100',
            title: 'Transparent Governance',
            description: 'Every support event is verifiable and school-directed',
        },
        {
            icon: FaBell,
            iconColor: 'text-indigo-500',
            bgColor: 'bg-indigo-100',
            title: 'Emergency Activation',
            description: 'Quick activation after 6 months of participation',
        },
    ];

    const faqs = [
        {
            question: 'What is Schoolfee.in and how does it work?',
            answer: "Schoolfee.in is India's first community-based education social security system. It protects families from education disruption during temporary distress events by providing dignified, interest-free support through a community resilience Fund.",
        },
        {
            question: 'How can I become a member?',
            answer: 'Join as a Parent, School, CSR Partner, or Community Donor. After 6 months of regular participation, members unlock emergency support benefits. The process is simple, dignified, and maintains complete confidentiality.',
        },
        {
            question: 'What is the verification process?',
            answer: 'We conduct confidential verification within 48 hours of distress notification. The process is respectful and humanless where possible, maintaining the dignity of families while ensuring genuine need.',
        },
        {
            question: 'How are Community Points earned and used?',
            answer: 'Points are earned through regular participation and can be redeemed for books, uniforms, and other educational support. Members can also donate points to help other families, strengthening community bonds.',
        },
        {
            question: 'Is this a loan or commercial service?',
            answer: 'No. Schoolfee is a social security layer with 0% interest. It is not a profit-linked service, loan, or deposit scheme. Support is community-funded and focused solely on education continuity.',
        },
        {
            question: 'How does the 6-month participation work?',
            answer: 'Members participate by paying regular school fees through the platform for 6 months. This builds discipline and strengthens the community pool. From the 7th month, emergency support becomes available if needed.',
        },
    ];

    const menuItems = [
        { label: 'Public Opinion', id: 'success-stories' },
        { label: 'Goals', id: 'goals' },
        { label: 'Chief Guest', id: 'chief-guest' },
        { label: 'Features', id: 'features' },
        { label: 'Participation', id: 'participation' },
        { label: 'How It Works', id: 'how-it-works' },
        { label: 'FAQ', id: 'faq' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* ===== HEADER ===== */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="#" className="flex-shrink-0">
                            <img
                                src="https://schoolfee.in/logo/schoolfee%20logo.webp"
                                alt="Schoolfee Logo"
                                className="h-10 w-auto"
                            />
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-sm font-medium text-gray-700 hover:text-[#0B4C8A] transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* Desktop CTA */}
                        <button
                            onClick={() => scrollToSection('participation')}
                            className="hidden lg:block bg-[#0B4C8A] hover:bg-[#094076] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
                        >
                            Accept Invitation
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-700"
                        >
                            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-4 px-2 border-t border-gray-200">
                            <nav className="flex flex-col gap-3">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="text-left text-sm font-medium text-gray-700 hover:text-[#0B4C8A] py-2 transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => scrollToSection('participation')}
                                    className="bg-[#0B4C8A] hover:bg-[#094076] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors mt-2"
                                >
                                    Accept Invitation
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* ===== HERO ===== */}
            <section className="relative bg-white pt-8 pb-6 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9A11B]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0B4C8A]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 text-gray-900">
                                An <span className="text-[#0B4C8A]">Invitation</span> to Protect India's Future
                            </h1>

                            <p className="text-base md:text-lg text-gray-600 mb-4">
                                Activate a dignified, tech-driven, community-powered education continuity model. Because one unpaid school fee can silently damage a child's confidence, learning, and future.
                            </p>

                            <div className="mb-4">
                                <div className="flex flex-col sm:flex-row gap-3 mb-2">
                                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2.5 flex-1 shadow-sm focus-within:border-[#0B4C8A] transition-colors">
                                        <IndiaFlag />
                                        <span className="text-gray-700 ml-2 mr-2 font-medium">+91</span>
                                        <input
                                            type="tel"
                                            placeholder="Enter Mobile No"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            className="outline-none flex-1 text-gray-700 bg-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <button
                                        onClick={handleGetStarted}
                                        disabled={isSubmitting}
                                        className="bg-[#0B4C8A] hover:bg-[#094076] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Please wait...' : 'Get Started →'}
                                    </button>
                                </div>
                                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                            </div>

                            <div className="space-y-2">
                                {[
                                    'No profit-linked distress support',
                                    'Direct payment to School for continuity',
                                    'Humanless + simple process',
                                ].map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <FaCheckCircle className="text-[#0B4C8A] text-lg flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex justify-center lg:justify-center">
                            <img
                                src="/landing-page/education-continuity.jpg"
                                alt="SchoolFee Hero"
                                className="w-full max-w-lg h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SUCCESS STORIES ===== */}
            <section id="success-stories" className="py-8 px-4 bg-[#F7F4EF] lg:scroll-mt-18 scroll-mt-88">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="lg:w-56 flex-shrink-0 flex flex-col justify-center pt-3">
                            <div className="text-[100px] leading-none text-gray-200 font-serif select-none mb-2">&ldquo;</div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-1 -mt-4">Public Opinion & View on program</h2>
                            <p className="text-sm text-gray-500 mb-4">Schoolfee Program</p>
                            <Link href='/how-it-works' className="bg-[#0B4C8A] hover:bg-[#094076] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors w-fit">
                                Learn More
                            </Link>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {successStories.map((story, index) => (
                                <div
                                    key={index}
                                    className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${story.bgColor}`}
                                >
                                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                                        <img
                                            src={story.image}
                                            alt={story.name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    </div>
                                    <div className="p-4 bg-white">
                                        <h3 className="font-bold text-gray-900 text-base">{story.name}</h3>
                                        <p className="text-gray-800 text-sm font-medium">{story.business}</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {story.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PLATFORM ADVOCATE ===== */}
            <section id='chief-guest' className="py-6 px-4 bg-white overflow-hidden lg:scroll-mt-18 scroll-mt-118">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-teal-50 via-white to-blue-50 rounded-2xl border border-gray-200 overflow-hidden relative">
                        <div className="absolute top-4 right-4 bg-[#0B4C8A] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            HON'BLE CM DELHI
                        </div>

                        <div className="grid md:grid-cols-2 gap-5 items-center p-5">
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-40"></div>
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
                                <img
                                    src="https://images.indianexpress.com/2025/08/rekha-gupta-5.jpg"
                                    alt="Hon'ble Chief Minister Rekha Gupta"
                                    className="w-full h-auto rounded-xl shadow-lg relative z-10 object-cover"
                                />
                            </div>

                            <div className="space-y-3 px-4">
                                <div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                                    OUR CHIEF GUEST – DELHI SEMINAR
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    CM <span className="text-[#0B4C8A] italic">Rekha Gupta </span>
                                    Supporting Schoolfee Health Financial Inclusion Program
                                </h2>

                                <p className="text-md text-gray-600 leading-relaxed">
                                    We are honoured to invite the Hon'ble Chief Minister of Delhi, Rekha Gupta, to guide and support the launch of a Schoolfee Health Financial Inclusion Program to protect families from sudden school fee distress caused by job loss, illness, or temporary financial emergencies.
                                </p>

                                <div className="pt-0">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        Seminar Focus & Initiative Highlights:
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-[#0B4C8A] text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                Delhi Pilot Resolution Model
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-[#0B4C8A] text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                0% Interest Distress Support
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-[#0B4C8A] text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                48-Hour Confidential Verification
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-[#0B4C8A] text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                Direct Fee Payment to Schools
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-[#0B4C8A] text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                Transparent Governance
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-[#0B4C8A] text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                Community Participation Drive
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== GOALS ===== */}
            <section id="goals" className="py-8 px-4 bg-white lg:scroll-mt-18 scroll-mt-118">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">
                        Schoolfee Aid Help You Achieve Your Goals
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {goals.map((goal, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-full flex items-end justify-center h-48 mb-3">
                                    <img
                                        src={goal.svg}
                                        alt={goal.title.replace('\n', ' ')}
                                        className="h-full w-auto max-w-full object-contain"
                                    />
                                </div>
                                <div className="w-full border-t border-gray-200 mb-3"></div>
                                <p className="text-sm md:text-base text-gray-700 text-center leading-snug whitespace-pre-line">
                                    {goal.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="py-8 px-4 bg-white border-t border-gray-100 lg:scroll-mt-18 scroll-mt-118">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className={`${feature.iconColor} text-2xl`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-gray-900 mb-1">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== THE PROBLEM ===== */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                        The Missing Social Security Gap
                    </h2>
                    <p className="text-center text-gray-600 max-w-4xl mx-auto mb-8">
                        Citizens face multiple daily-life issues. But when there is no quick, dignified and single-window safety net, the smallest unit of the country — <strong>a family</strong> — carries the entire burden.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-pink-50 to-blue-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">What happens in real life?</h3>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                A short-term income break can trigger a chain reaction: school fee delay → pressure from school → student anxiety → learning disruption → reduced outcomes → weaker future citizens and workforce.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-white/80 rounded-xl p-3 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-1">Education gets hit first</h4>
                                    <p className="text-sm text-gray-600">Because it&apos;s recurring and time-bound.</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-3 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-1">Dignity is lost</h4>
                                    <p className="text-sm text-gray-600">Families feel stigma in asking for help.</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-3 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-1">Institutions struggle</h4>
                                    <p className="text-sm text-gray-600">Schools need timely fees to operate.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Why existing tools fall short</h3>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Many options are fragmented, paperwork-heavy, and not built for micro distress events. Schoolfee exists to create a clean bridge between <strong>parents, schools, donors/CSR</strong> and a <strong>community resilience pool</strong>.
                            </p>
                            <div className="space-y-2">
                                {[
                                    'Tech-driven platform',
                                    'Simple verification process',
                                    'Single window access',
                                    'Humanless where possible',
                                    'Respectful and dignified',
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 bg-white/80 rounded-lg p-2.5 border border-gray-200">
                                        <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                                        <span className="text-gray-700 font-medium text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CHOOSE YOUR PARTICIPATION ===== */}
            <section id="participation" className="py-8 px-4 bg-[#F7F4EF] lg:scroll-mt-18 scroll-mt-118">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3">
                        Choose Your Participation
                    </h2>
                    <p className="text-gray-600 mb-4 max-w-3xl">
                        Schoolfee is a civic-tech layer where different stakeholders play different roles — but one shared goal: protect education continuity for families.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {partnerTypes.map((partner, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                <div className="relative w-full aspect-[2/1] overflow-hidden">
                                    <img
                                        src={partner.image}
                                        alt={partner.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-xl text-gray-900 mb-3">{partner.title}</h3>
                                    <ul className="space-y-2 mb-4">
                                        {partner.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                <FaCheckCircle className="text-[#0B4C8A] mt-0.5 flex-shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex gap-3 flex-wrap">
                                        <button
                                            onClick={() => openModal(partner.cta)}
                                            disabled={isSubmitting}
                                            className="flex-1 bg-[#0B4C8A] hover:bg-[#094076] text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                                        >
                                            Join Now
                                        </button>
                                        <Link
                                            href="/how-it-works"
                                            className="flex-1 bg-white hover:bg-gray-50 text-[#0B4C8A] border border-[#0B4C8A] px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors text-center"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="py-8 px-4 bg-white lg:scroll-mt-18 scroll-mt-118">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                        How Community Education Social Security Works
                    </h2>
                    <p className="text-center text-gray-600 max-w-4xl mx-auto mb-8">
                        Membership + disciplined participation creates a resilience pool. Verified distress triggers emergency support while maintaining dignity and continuity.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {steps.map((step) => (
                            <div
                                key={step.num}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="w-12 h-12 bg-[#F9A11B] rounded-xl flex items-center justify-center text-white font-black text-xl mb-3">
                                    {step.num}
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2 text-lg">{step.title}</h4>
                                <ul className="space-y-2">
                                    {step.points.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <FaCheckCircle className="text-[#0B4C8A] mt-0.5 flex-shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section id="faq" className="py-8 px-4 bg-white lg:scroll-mt-18 scroll-mt-118">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`rounded-xl border transition-all overflow-hidden ${expandedFaq === index ? 'border-gray-400 shadow-sm' : 'border-gray-200'
                                    }`}
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full px-4 py-3 text-left font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors text-sm md:text-base"
                                >
                                    <span>{faq.question}</span>
                                    <div
                                        className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ml-3 transition-transform duration-200 ${expandedFaq === index ? 'rotate-180' : ''
                                            }`}
                                    >
                                        <FaChevronDown className="text-[#0B4C8A] text-xs" />
                                    </div>
                                </button>
                                {expandedFaq === index && (
                                    <div className="px-4 pb-3 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA 1 (Query Form) ===== */}
            <section className="py-5 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#D6E8FF] rounded-2xl border border-[#C0D9F5] overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
                            <div className="flex items-end justify-center sm:justify-start px-5 pt-5 sm:pt-0 sm:w-72 sm:self-end">
                                <img
                                    src="https://assets.streamlinehq.com/image/private/w_800,h_800,ar_1/f_auto/v1/icons/illustrations-brooklyn/customer-support/customer-support/asking-question-4-okqx6zszrdpaf42cye4cpc.png?_a=DATAiZAAZAA0"
                                    alt="Still Having Questions"
                                    className="h-40 w-auto object-contain"
                                />
                            </div>

                            <div className="flex-1 px-5 py-5 sm:pl-2">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Still Having Questions?</h3>
                                <p className="text-sm text-gray-600 mb-3">We'll get back to you within 2 working days</p>

                                {/* Email Input - REQUIRED and shown FIRST */}
                                <input
                                    type="email"
                                    value={queryEmail}
                                    onChange={(e) => setQueryEmail(e.target.value)}
                                    placeholder="Your email address *"
                                    className="w-full bg-white border border-gray-300 rounded-lg p-3 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4C8A]"
                                    disabled={isSubmitting}
                                    required
                                />
                                {errors.queryEmail && <p className="text-red-500 text-xs mb-2">{errors.queryEmail}</p>}

                                {/* Query Textarea */}
                                <textarea
                                    value={queryText}
                                    onChange={(e) => setQueryText(e.target.value)}
                                    placeholder="Write your query here... (minimum 10 characters)"
                                    className="w-full bg-white border border-gray-300 rounded-lg p-3 mb-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4C8A]"
                                    rows={4}
                                    disabled={isSubmitting}
                                    required
                                />

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleQuerySubmit}
                                        disabled={isSubmitting}
                                        className="bg-[#0B4C8A] hover:bg-[#094076] text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Query'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA 2 (Bottom Mobile Signup) ===== */}
            <section className="py-6 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
                            <div className="flex-1 px-6 py-6">
                                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                                    <span className="text-[#0B4C8A]">PROTECT</span> India&apos;s Future
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Join India&apos;s First Community-Based Education Social Security System
                                </p>

                                <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-gray-300 shadow-sm max-w-lg">
                                    <div className="flex items-center bg-white px-3 py-2.5 flex-1 min-w-0">
                                        <IndiaFlag />
                                        <span className="text-gray-700 ml-2 mr-2 font-medium text-sm whitespace-nowrap">+91</span>
                                        <input
                                            type="tel"
                                            placeholder="Enter Mobile No"
                                            value={bottomMobileNumber}
                                            onChange={(e) => setBottomMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            className="outline-none flex-1 text-gray-700 bg-transparent text-sm min-w-0"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <button
                                        onClick={handleBottomCTA}
                                        disabled={isSubmitting}
                                        className="bg-[#0B4C8A] hover:bg-[#094076] text-white px-6 py-2.5 font-semibold text-sm whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Please wait...' : 'Accept Invitation →'}
                                    </button>
                                </div>
                                {errors.bottomMobile && <p className="text-red-500 text-xs mt-2">{errors.bottomMobile}</p>}

                                <div className="flex items-center mt-2 max-w-lg">
                                    <input
                                        type="checkbox"
                                        id="terms3"
                                        defaultChecked
                                        className="mr-2 accent-[#0B4C8A] flex-shrink-0"
                                    />
                                    <label htmlFor="terms3" className="text-xs text-gray-500">
                                        By providing your email and mobile number, you opt-in to receive promotional email, WhatsApp, and Google RCS Messaging from Vishwnet India.
                                    </label>
                                </div>
                            </div>

                            <div className="flex-shrink-0 flex items-end justify-center sm:justify-end px-5 pb-0 sm:w-72 overflow-hidden">
                                <img
                                    src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/list.svg"
                                    alt="Protect India's Future"
                                    className="h-48 sm:h-56 w-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-gray-900 text-white pb-4 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="pt-5 flex flex-col md:flex-row items-center justify-center gap-3 text-sm text-gray-400 text-center">
                        <p>&copy; 2025 Schoolfee.in. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/privacy-policy" className="hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <a href="/terms-condition" className="hover:text-white transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ===== SUCCESS TOAST ===== */}
            {showSuccessMessage && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out animate-slide-down">
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-green-200 px-5 py-3 flex items-center gap-3 max-w-md">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaCheckCircle className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Success!</h4>
                            <p className="text-xs text-gray-600">{successMessage}</p>
                        </div>
                        <button
                            onClick={() => setShowSuccessMessage(false)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ===== MODAL ===== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0B4C8A] to-[#094076] text-white px-4 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-lg">Join Schoolfee.in</h3>
                            <button
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="px-4 pt-4 flex gap-2">
                            {[1, 2].map((num) => (
                                <div key={num} className="h-1.5 bg-gray-200 rounded-full flex-1 overflow-hidden">
                                    <div
                                        className="h-full bg-[#0B4C8A] rounded-full transition-all duration-300"
                                        style={{ width: modalStep >= num ? '100%' : '0%' }}
                                    ></div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {modalStep === 1 && (
                                <div className="space-y-1">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Join as a Member</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Provide your details to get started with the registration process
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                                            Choose Your Role <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={modalData.role}
                                            onChange={(e) => handleModalInputChange('role', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4C8A] focus:border-transparent outline-none bg-white"
                                            disabled={isSubmitting}
                                        >
                                            <option value="Parent Member">Parent Member</option>
                                            <option value="Partner School">Partner School</option>
                                            <option value="CSR Partner">CSR Partner</option>
                                            <option value="Donor/Community">Donor/Community</option>
                                            <option value="Educationist/Policy Advocate">Educationist/Policy Advocate</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                                                Name / Organisation <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={modalData.name}
                                                onChange={(e) => handleModalInputChange('name', e.target.value)}
                                                placeholder="Enter full name"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4C8A] focus:border-transparent outline-none"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={modalData.city}
                                                onChange={(e) => handleModalInputChange('city', e.target.value)}
                                                placeholder="Enter city"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4C8A] focus:border-transparent outline-none"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                                                Mobile <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={modalData.mobile}
                                                onChange={(e) =>
                                                    handleModalInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))
                                                }
                                                placeholder="10-digit mobile number"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4C8A] focus:border-transparent outline-none"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={modalData.email}
                                                onChange={(e) => handleModalInputChange('email', e.target.value)}
                                                placeholder="name@email.com"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4C8A] focus:border-transparent outline-none"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start mt-3">
                                        <input
                                            type="checkbox"
                                            id="modalOptIn"
                                            checked={modalData.optIn}
                                            onChange={(e) => handleModalInputChange('optIn', e.target.checked)}
                                            className="mt-1 mr-2 accent-[#0B4C8A] flex-shrink-0"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="modalOptIn" className="text-xs text-gray-600">
                                            By providing your email and mobile number, you opt-in to receive promotional email, WhatsApp, and Google RCS Messaging from Vishwnet India.
                                        </label>
                                    </div>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaCheckCircle className="text-green-600 text-4xl" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2 text-2xl">Thank You for Joining!</h4>
                                    <p className="text-gray-600 mb-5 max-w-md mx-auto leading-relaxed">
                                        Your invitation has been accepted. Our team will reach out to you within 24-48 hours to complete the onboarding process.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="bg-[#0B4C8A] hover:bg-[#094076] text-white px-8 py-2.5 rounded-lg font-semibold transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>

                        {modalStep === 1 && (
                            <div className="px-5 pb-5 flex justify-end gap-3 border-t border-gray-100 pt-3">
                                <button
                                    onClick={handleFormSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 bg-[#0B4C8A] hover:bg-[#094076] text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}   