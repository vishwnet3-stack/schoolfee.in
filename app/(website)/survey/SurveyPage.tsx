"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, CheckCircle2, AlertCircle, MapPin, Printer, User, Users, IndianRupee, Heart, Building2, CreditCard, Clock, MessageSquare, DollarSign, Loader2 } from "lucide-react";
import { HiClipboardList } from "react-icons/hi";
import { FaIndianRupeeSign } from "react-icons/fa6";

interface SchoolTypeData {
  [key: string]: number;
}

interface BorrowingDetails {
  [key: string]: string;
}

interface FormData {
  // Basic Info
  fatherName: string;
  motherName: string;
  guardianName: string;
  address: string;
  state: string;
  mobileNumber: string;
  alternateMobile: string;
  email: string;

  // Family Info
  familyType: string;
  numberOfChildren: string;
  schoolTypeQuantity: SchoolTypeData;

  // Financial
  monthlyIncome: string;
  incomeSource: string;
  delayInFee: string;
  reasonForDelay: string;
  reasonForDelayOther?: string;

  // Support
  supportSource: string;
  supportSourceOther?: string;
  communitySupport: string;
  schoolIncidents: string[];
  schoolIncidentsOther?: string;
  socialIsolation: string;
  isolationReason?: string;

  // Government Aid
  govAssistance: string;
  govApplication?: string;
  govHelpReasons: string;
  govHelpReasonsOther?: string;
  bankShortTerm: string;
  bankReasons?: string;
  bankReasonsOther?: string;

  // Borrowing
  borrowingSource: string;
  borrowingDetails: BorrowingDetails;
  interestRate: string;
  interestRateOther?: string;

  // Support Model
  preferredDuration: string;
  confidentialSupport: string;
  recommend: string;

  // Open Feedback
  educationFear: string;
  supportNeeded: string;
  communityNetwork: string;
}

const INITIAL_FORM_DATA: FormData = {
  fatherName: "",
  motherName: "",
  guardianName: "",
  address: "",
  state: "Delhi",
  mobileNumber: "",
  alternateMobile: "",
  email: "",
  familyType: "",
  numberOfChildren: "",
  schoolTypeQuantity: {},
  monthlyIncome: "",
  incomeSource: "",
  delayInFee: "",
  reasonForDelay: "",
  supportSource: "",
  communitySupport: "",
  schoolIncidents: [],
  socialIsolation: "",
  govAssistance: "",
  govHelpReasons: "",
  bankShortTerm: "",
  borrowingSource: "",
  borrowingDetails: {},
  interestRate: "",
  preferredDuration: "",
  confidentialSupport: "",
  recommend: "",
  educationFear: "",
  supportNeeded: "",
  communityNetwork: "",
};

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep",
  "Puducherry"
];

export default function SurveyPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const sections = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Family Details" },
    { number: 3, title: "Financial Stress" },
    { number: 4, title: "Community Support" },
    { number: 5, title: "Government Aid" },
    { number: 6, title: "Borrowing Patterns" },
    { number: 7, title: "Support Model" },
    { number: 8, title: "Feedback" },
  ];
  

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('surveyFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (formData.email || formData.mobileNumber) {
      localStorage.setItem('surveyFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const current = Array.isArray(prev[field]) ? prev[field] as string[] : [];
      let updated: string[];

      if (field === "schoolIncidents" && value === "Other") {
        updated = ["Other"];
      } else if (field === "schoolIncidents" && current.includes("Other")) {
        updated = [value];
      } else {
        updated = current.includes(value)
          ? current.filter(item => item !== value)
          : [...current, value];
      }
      return { ...prev, [field]: updated };
    });
  };

  const handleBorrowingSourceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      borrowingSource: value,
      borrowingDetails: {}
    }));

    if (errors.borrowingSource) {
      setErrors(prev => ({ ...prev, borrowingSource: "" }));
    }
  };

  const handleBorrowingDetailChange = (source: string, detail: string) => {
    setFormData(prev => ({
      ...prev,
      borrowingDetails: {
        ...prev.borrowingDetails,
        [source]: detail
      }
    }));

    if (errors.borrowingDetails) {
      setErrors(prev => ({ ...prev, borrowingDetails: "" }));
    }
  };

  const handleSchoolTypeQuantity = (schoolType: string, quantity: number) => {
    setFormData(prev => {
      const numChildren = parseInt(formData.numberOfChildren) || 0;

      if (numChildren === 1) {
        if (quantity > 0) {
          return {
            ...prev,
            schoolTypeQuantity: {
              [schoolType]: Math.min(quantity, 1)
            }
          };
        } else {
          const newData = { ...prev.schoolTypeQuantity };
          delete newData[schoolType];
          return { ...prev, schoolTypeQuantity: newData };
        }
      } else {
        const newData = { ...prev.schoolTypeQuantity };
        if (quantity > 0) {
          newData[schoolType] = Math.min(quantity, numChildren);
        } else {
          delete newData[schoolType];
        }

        const total = Object.values(newData).reduce((a, b) => a + b, 0);
        if (total > numChildren) {
          return prev;
        }

        return { ...prev, schoolTypeQuantity: newData };
      }
    });
  };

  const validateSection = (section: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (section === 1) {
      if (!formData.fatherName && !formData.motherName && !formData.guardianName) {
        newErrors.parentGuardian = "Please enter at least one: Father Name, Mother Name, or Guardian Name";
      }
      // if (!formData.address.trim()) newErrors.address = "Address is required";  
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.mobileNumber.match(/^\d{10}$/)) newErrors.mobileNumber = "Valid 10-digit mobile required";
      if (formData.alternateMobile && !formData.alternateMobile.match(/^\d{10}$/)) {
        newErrors.alternateMobile = "Valid 10-digit mobile required";
      }
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email required";
    }

    if (section === 2) {
      if (!formData.familyType) newErrors.familyType = "Please select family type";
      if (!formData.numberOfChildren) newErrors.numberOfChildren = "Please select number of children";
      const numChildren = parseInt(formData.numberOfChildren) || 0;
      const selectedSchools = Object.entries(formData.schoolTypeQuantity)
        .filter(([, qty]) => qty > 0);

      if (selectedSchools.length === 0) {
        newErrors.schoolType = "Please specify school types with quantities";
      } else if (numChildren === 1 && selectedSchools.length > 1) {
        newErrors.schoolType = "Only one school type allowed for 1 child";
      } else {
        const total = selectedSchools.reduce((sum, [, qty]) => sum + qty, 0);
        if (total !== numChildren) {
          newErrors.schoolType = `Total children across schools must equal ${numChildren}`;
        }
      }
    }

    if (section === 3) {
      if (!formData.monthlyIncome) newErrors.monthlyIncome = "Please select income range";
      if (!formData.incomeSource) newErrors.incomeSource = "Please select income source";
      if (!formData.delayInFee) newErrors.delayInFee = "Please answer about fee delay";
      if (formData.delayInFee === "yes" && !formData.reasonForDelay) {
        newErrors.reasonForDelay = "Please select a reason";
      }
    }

    if (section === 4) {
      if (!formData.supportSource) newErrors.supportSource = "Please select who supports you";
      if (!formData.socialIsolation) newErrors.socialIsolation = "Please answer this question";
      if (formData.schoolIncidents.length === 0) newErrors.schoolIncidents = "Please select at least one option";
    }

    if (section === 5) {
      if (!formData.govAssistance) newErrors.govAssistance = "Please answer this question";
      if (formData.govAssistance === "yes" && !formData.govApplication) {
        newErrors.govApplication = "Please answer this question";
      }
      if (formData.govAssistance === "no" && !formData.govHelpReasons) {
        newErrors.govHelpReasons = "Please select a reason";
      }
      if (!formData.bankShortTerm) newErrors.bankShortTerm = "Please answer this question";
      if (formData.bankShortTerm === "no" && !formData.bankReasons) {
        newErrors.bankReasons = "Please select a reason";
      }
    }

    if (section === 6) {
      if (!formData.borrowingSource) newErrors.borrowingSource = "Please select an option";
      if (formData.borrowingSource && formData.borrowingSource !== "Never") {
        if (formData.borrowingSource === "Bank" && !formData.borrowingDetails.Bank) {
          newErrors.borrowingDetails = "Please enter which bank";
        }
        if (formData.borrowingSource === "Relatives" && !formData.borrowingDetails.Relatives) {
          newErrors.borrowingDetails = "Please specify the relation";
        }
      }
    }

    if (section === 7) {
      if (!formData.preferredDuration) newErrors.preferredDuration = "Please select preferred duration";
      if (!formData.confidentialSupport) newErrors.confidentialSupport = "Please answer this question";
      if (!formData.recommend) newErrors.recommend = "Please answer this question";
    }

    if (section === 8) {
      if (!formData.communityNetwork) newErrors.communityNetwork = "Please answer this question";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllSections = (): boolean => {
    let allValid = true;
    for (let i = 1; i <= sections.length; i++) {
      if (!validateSection(i)) {
        allValid = false;
      }
    }
    return allValid;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < sections.length) {
        setCurrentSection(currentSection + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateAllSections()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit survey');
      }

      // Success!
      setSubmitSuccess(true);
      setShowPreview(true);

      // Clear localStorage
      localStorage.removeItem('surveyFormData');

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "An error occurred while submitting your survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewSurvey = () => {
    if (window.confirm("Are you sure you want to start a new survey? Current data will be cleared.")) {
      localStorage.removeItem('surveyFormData');
      setFormData(INITIAL_FORM_DATA);
      setCurrentSection(1);
      setShowPreview(false);
      setSubmitSuccess(false);
      setSubmitError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const QuestionLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <label className="block text-xs sm:text-sm md:text-base font-bold from-blue-100 via-indigo-100 to-blue-100 border-blue-600 px-1 py-1 rounded-lg text-blue-900">
      <HiClipboardList className="inline mr-1" /> {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const DataItem = ({ icon: Icon, label, value }: { icon?: any; label: string; value: string | string[] | React.ReactNode }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <div className="flex gap-2 items-start">
        {Icon && <Icon className="w-4 h-4 text-[#00468e] mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <dt className="text-xs font-semibold text-[#00468e]">{label}</dt>
          <dd className="text-sm text-slate-700 mt-0.5">
            {Array.isArray(value) ? (
              <ul className="space-y-0.5">
                {value.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#ECB604] text-xs mt-1">●</span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="break-words">{value}</span>
            )}
          </dd>
        </div>
      </div>
    );
  };

  // Preview Component
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-3 sm:py-4 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {submitSuccess && (
            <div className="mb-4 bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center print:hidden">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-800 mb-1">Survey Submitted Successfully!</h3>
              <p className="text-sm text-green-700">Thank you for your time. Our team will contact you within 24-48 hours.</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-xl overflow-hidden print:shadow-none">
            <div className="bg-gradient-to-r from-[#00468e] to-[#0056a8] text-white px-4 sm:px-6 py-4 sm:py-5">
              <h1 className="text-xl sm:text-2xl font-bold text-center mb-1">Family Survey for Student Fee Support</h1>
              <p className="text-xs sm:text-sm text-blue-100 text-center">Submit the survey form for student support</p>
              <p className="text-xs text-center mt-2 bg-white/10 inline-block px-3 py-1 rounded-full mx-auto block w-fit">
                Submitted: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 print:hidden flex justify-end gap-2">
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-xs sm:text-sm">
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <button onClick={handleNewSurvey} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#00468e] hover:opacity-90 text-white rounded-lg font-medium transition text-xs sm:text-sm">
                New Survey
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-6">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Basic Information
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem icon={User} label="Father's Name" value={formData.fatherName} />
                  <DataItem icon={User} label="Mother's Name" value={formData.motherName} />
                  <DataItem icon={User} label="Guardian's Name" value={formData.guardianName} />
                  <DataItem icon={MapPin} label="Address" value={formData.address} />
                  <DataItem icon={MapPin} label="State" value={formData.state} />
                  <DataItem label="Mobile Number" value={formData.mobileNumber} />
                  <DataItem label="Alternate Mobile" value={formData.alternateMobile} />
                  <DataItem label="Email Address" value={formData.email} />
                </dl>
              </div>

              {/* SECTION 2: FAMILY DETAILS */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Family Details
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem icon={Users} label="Family Type" value={formData.familyType} />
                  <DataItem label="Number of School-going Children" value={formData.numberOfChildren} />
                  <DataItem
                    label="School Type Distribution"
                    value={Object.entries(formData.schoolTypeQuantity).map(([type, qty]) =>
                      `${type}: ${qty} ${qty === 1 ? 'child' : 'children'}`
                    )}
                  />
                </dl>
              </div>

              {/* SECTION 3: FINANCIAL STRESS */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <FaIndianRupeeSign className="w-4 h-4" />
                    Financial Stress
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem icon={FaIndianRupeeSign} label="Monthly Family Income" value={formData.monthlyIncome} />
                  <DataItem label="Primary Income Source" value={formData.incomeSource} />
                  <DataItem label="Delays in School Fee Payments" value={formData.delayInFee === 'yes' ? 'Yes' : formData.delayInFee === 'no' ? 'No' : ''} />
                  {formData.delayInFee === 'yes' && (
                    <DataItem
                      label="Main Reason for Delay"
                      value={formData.reasonForDelay === 'other' && formData.reasonForDelayOther ? formData.reasonForDelayOther : formData.reasonForDelay}
                    />
                  )}
                </dl>
              </div>

              {/* SECTION 4: COMMUNITY SUPPORT */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">4</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Community Support
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem
                    icon={Heart}
                    label="Primary Support in Financial Crisis"
                    value={formData.supportSource === 'other' && formData.supportSourceOther ? formData.supportSourceOther : formData.supportSource}
                  />
                  <DataItem
                    label="Feel Socially Isolated"
                    value={formData.socialIsolation === 'yes' ? `Yes${formData.isolationReason ? ` - ${formData.isolationReason}` : ''}` : formData.socialIsolation === 'no' ? 'No' : ''}
                  />
                  <DataItem
                    label="School Incidents"
                    value={formData.schoolIncidents.includes('Other') && formData.schoolIncidentsOther
                      ? [...formData.schoolIncidents.filter(i => i !== 'Other'), formData.schoolIncidentsOther]
                      : formData.schoolIncidents}
                  />
                </dl>
              </div>

              {/* SECTION 5: GOVERNMENT AID */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">5</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Government Aid
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem icon={Building2} label="Received Govt. Financial Assistance" value={formData.govAssistance === 'yes' ? 'Yes' : formData.govAssistance === 'no' ? 'No' : ''} />
                  {formData.govAssistance === 'yes' && formData.govApplication && (
                    <DataItem label="Application Status" value={formData.govApplication} />
                  )}
                  {formData.govAssistance === 'no' && (
                    <DataItem label="Reason for No Support" value={formData.govHelpReasons === 'other' && formData.govHelpReasonsOther ? formData.govHelpReasonsOther : formData.govHelpReasons} />
                  )}
                  <DataItem label="Banks/NBFCs Short-term Help" value={formData.bankShortTerm === 'yes' ? 'Yes' : formData.bankShortTerm === 'no' ? 'No' : ''} />
                  {formData.bankShortTerm === 'no' && formData.bankReasons && (
                    <DataItem label="Reason" value={formData.bankReasons === 'other' && formData.bankReasonsOther ? formData.bankReasonsOther : formData.bankReasons} />
                  )}
                </dl>
              </div>

              {/* SECTION 6: BORROWING PATTERNS */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">6</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Borrowing Patterns
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem
                    icon={CreditCard}
                    label="Borrowing Source"
                    value={formData.borrowingSource}
                  />
                  {formData.borrowingSource === "Bank" && formData.borrowingDetails.Bank && (
                    <DataItem label="Bank Name" value={formData.borrowingDetails.Bank} />
                  )}
                  {formData.borrowingSource === "Relatives" && formData.borrowingDetails.Relatives && (
                    <DataItem label="Relation" value={formData.borrowingDetails.Relatives} />
                  )}
                  {formData.borrowingSource && formData.borrowingSource !== "Never" && formData.interestRate && (
                    <DataItem label="Average Interest Rate" value={formData.interestRate === 'other' && formData.interestRateOther ? formData.interestRateOther : formData.interestRate} />
                  )}
                </dl>
              </div>

              {/* SECTION 7: SUPPORT MODEL */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">7</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Support Model
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem icon={Clock} label="Preferred Support Duration" value={formData.preferredDuration} />
                  <DataItem label="Confidential Support Preference" value={formData.confidentialSupport} />
                  <DataItem label="Would Recommend to Others" value={formData.recommend} />
                </dl>
              </div>

              {/* SECTION 8: OPEN FEEDBACK */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">8</div>
                  <h2 className="text-base sm:text-lg font-bold text-[#00468e] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Open Feedback
                  </h2>
                </div>
                <dl className="space-y-3">
                  <DataItem icon={MessageSquare} label="Biggest Education Concern" value={formData.educationFear} />
                  <DataItem label="Support Needed Most" value={formData.supportNeeded} />
                  <DataItem label="Community Network Interest" value={formData.communityNetwork} />
                </dl>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-100 to-blue-50 px-4 sm:px-6 py-4 text-center border-t border-slate-200">
              <p className="text-sm font-semibold text-[#00468e] mb-1">Thank you for completing the survey</p>
              <p className="text-xs text-slate-600">Your responses help us support families in need</p>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .print\\:hidden { display: none !important; }
            .print\\:shadow-none { box-shadow: none !important; }
            @page { margin: 1cm; size: A4; }
          }
          
          input[type="checkbox"] {
            appearance: none !important;
            -webkit-appearance: none !important;
            width: 1.25rem !important;
            height: 1.25rem !important;
            border: 2.5px solid #94a3b8 !important;
            border-radius: 0.25rem !important;
            background-color: white !important;
            cursor: pointer !important;
          }
          
          input[type="checkbox"]:hover {
            border-color: #00468e !important;
            box-shadow: 0 0 0 3px rgba(0, 70, 142, 0.1) !important;
          }
          
          input[type="checkbox"]:checked {
            border-color: #00468e !important;
            background-color: #00468e !important;
          }
          
          input[type="checkbox"]:checked::before {
            content: '' !important;
            position: absolute !important;
            top: 2px !important;
            left: 5.5px !important;
            width: 5px !important;
            height: 10px !important;
            border: solid white !important;
            border-width: 0 2.5px 2.5px 0 !important;
            transform: rotate(45deg) !important;
            display: block !important;
          }

          input[type="radio"] {
            appearance: none !important;
            -webkit-appearance: none !important;
            width: 1.25rem !important;
            height: 1.25rem !important;
            border: 2.5px solid #94a3b8 !important;
            border-radius: 50% !important;
            background-color: white !important;
            cursor: pointer !important;
          }

          input[type="radio"]:hover {
            border-color: #ECB604 !important;
            box-shadow: 0 0 0 3px rgba(236, 182, 4, 0.1) !important;
          }

          input[type="radio"]:checked {
            border-color: #ECB604 !important;
          }

          input[type="radio"]:checked::before {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 10px !important;
            height: 10px !important;
            border-radius: 50% !important;
            background-color: #ECB604 !important;
            display: block !important;
          }
        `}</style>
      </div>
    );
  }

  // SINGLE FORM VIEW - Continue with rest of the form sections...
  // Due to character limits, I'll provide the complete file in the next section

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-2 sm:py-3 md:py-6 px-2 sm:px-3 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-2 sm:mb-3 md:mb-6 animate-fadeIn">
          <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-[#00468e] mb-0.5">
            Family Survey for Student Fee Support
          </h1>
          <p className="text-xs text-slate-600">
            Submit the survey form for student support
          </p>
        </div>

        {submitError && (
          <div className="mb-4 bg-red-50 border-2 border-red-500 rounded-lg p-4 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4">
          {/* LEFT SIDEBAR - Desktop Only */}
          <div className="hidden lg:block lg:w-72">
            <div className="bg-white rounded-xl p-3 sticky top-4 shadow-md">
              <div className="mb-3">
                <h2 className="text-lg font-bold text-slate-800">Progress</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Section {currentSection} of {sections.length}
                </p>
              </div>

              <div className="space-y-1.5">
                {sections.map((section) => (
                  <button
                    key={section.number}
                    onClick={() => currentSection > section.number && setCurrentSection(section.number)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${section.number === currentSection
                      ? "bg-[#00468e] text-white shadow-md"
                      : section.number < currentSection
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {section.number < currentSection ? (
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border-2 border-current flex items-center justify-center text-[9px]">
                          {section.number}
                        </div>
                      )}
                      <span className="truncate text-xs">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-600 mb-1.5">
                  {Math.round((currentSection / sections.length) * 100)}% Complete
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#00468e] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(currentSection / sections.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN FORM CONTENT */}
          {/* MAIN FORM CONTENT */}
          <div className="flex-1">
            <div className="lg:bg-white lg:rounded-xl lg:p-2 sm:lg:p-3 md:lg:p-5 lg:shadow-md">
              {/* Mobile/Tablet View - Single Form */}
              <div className="lg:hidden">
                <div className="space-y-4 sm:space-y-6">
                  {/* SECTION 1: BASIC INFORMATION */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Basic Information</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel required>Parent/Guardian Names (At least one required)</QuestionLabel>
                        <div className="grid grid-cols-1 gap-2">
                          <input
                            type="text"
                            placeholder="Father Name"
                            value={formData.fatherName}
                            onChange={(e) => handleInputChange("fatherName", e.target.value)}
                            className="px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 text-xs sm:text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Mother Name"
                            value={formData.motherName}
                            onChange={(e) => handleInputChange("motherName", e.target.value)}
                            className="px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 text-xs sm:text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Guardian Name (Optional)"
                            value={formData.guardianName}
                            onChange={(e) => handleInputChange("guardianName", e.target.value)}
                            className="px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 text-xs sm:text-sm"
                          />
                        </div>
                        {errors.parentGuardian && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.parentGuardian}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>State</QuestionLabel>
                        <select
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select State</option>
                          {STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.state}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Address</QuestionLabel>
                        <textarea
                          placeholder="Enter your complete address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                        />
                        {errors.address && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <QuestionLabel required>Mobile Number</QuestionLabel>
                          <input
                            type="tel"
                            placeholder="10-digit number"
                            maxLength={10}
                            value={formData.mobileNumber}
                            onChange={(e) => handleInputChange("mobileNumber", e.target.value.replace(/\D/g, ''))}
                            className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                          />
                          {errors.mobileNumber && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.mobileNumber}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <QuestionLabel>Alternate Mobile (Optional)</QuestionLabel>
                          <input
                            type="tel"
                            placeholder="10-digit number"
                            maxLength={10}
                            value={formData.alternateMobile}
                            onChange={(e) => handleInputChange("alternateMobile", e.target.value.replace(/\D/g, ''))}
                            className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                          />
                          {errors.alternateMobile && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.alternateMobile}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Email Address</QuestionLabel>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: FAMILY DETAILS */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Family Details</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel required>Family Type</QuestionLabel>
                        <div className="grid grid-cols-2 gap-1.5">
                          {["Nuclear Family", "Joint Family", "Single Parent", "Migrant Family"].map(type => (
                            <button
                              key={type}
                              onClick={() => handleInputChange("familyType", type)}
                              className={`px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.familyType === type
                                ? "bg-[#ECB604] text-white border-[#ECB604]"
                                : "bg-slate-50 text-slate-700 border-slate-300 hover:border-[#ECB604]"
                                }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        {errors.familyType && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.familyType}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Number of School-going Children</QuestionLabel>
                        <select
                          value={formData.numberOfChildren}
                          onChange={(e) => {
                            handleInputChange("numberOfChildren", e.target.value);
                            handleInputChange("schoolTypeQuantity", {});
                          }}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select number of children</option>
                          <option value="1">1 Child</option>
                          <option value="2">2 Children</option>
                          <option value="3">3 Children</option>
                          <option value="4">4 Children</option>
                          <option value="5">More than 4 Children</option>
                        </select>
                        {errors.numberOfChildren && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.numberOfChildren}</p>}
                      </div>

                      {formData.numberOfChildren && (
                        <div className="space-y-1.5">
                          <QuestionLabel required>School Types and Number of Children</QuestionLabel>
                          <p className="text-xs text-slate-600">
                            {formData.numberOfChildren === "1"
                              ? "Select the school type your child attends:"
                              : formData.numberOfChildren === "5"
                                ? "Distribute your children across school types (you can select multiple options):"
                                : `Distribute your ${formData.numberOfChildren} children across school types:`}
                          </p>
                          <div className="space-y-1.5">
                            {["Private School", "Government School", "Missionary/Trust School"].map(schoolType => (
                              <div key={schoolType} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                <label className="flex items-center gap-2 cursor-pointer flex-1">
                                  <input
                                    type={formData.numberOfChildren === "1" ? "checkbox" : "checkbox"}
                                    name={formData.numberOfChildren === "1" ? "schoolTypeRadio" : undefined}
                                    checked={(formData.schoolTypeQuantity[schoolType] || 0) > 0}
                                    onChange={(e) => {
                                      if (formData.numberOfChildren === "1") {
                                        if (e.target.checked) {
                                          handleInputChange("schoolTypeQuantity", { [schoolType]: 1 });
                                        }
                                      } else {
                                        if (e.target.checked) {
                                          handleSchoolTypeQuantity(schoolType, 1);
                                        } else {
                                          const newData = { ...formData.schoolTypeQuantity };
                                          delete newData[schoolType];
                                          handleInputChange("schoolTypeQuantity", newData);
                                        }
                                      }
                                    }}
                                    className="w-4 h-4 text-[#ECB604] rounded"
                                  />
                                  <span className="text-xs sm:text-sm text-slate-700">{schoolType}</span>
                                </label>
                                {(formData.schoolTypeQuantity[schoolType] || 0) > 0 && (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min="1"
                                      max={formData.numberOfChildren === "1" ? "1" : formData.numberOfChildren === "5" ? "99" : formData.numberOfChildren}
                                      value={formData.schoolTypeQuantity[schoolType] || 0}
                                      onChange={(e) => handleSchoolTypeQuantity(schoolType, parseInt(e.target.value) || 0)}
                                      className="w-12 px-1.5 py-1 border border-slate-300 rounded text-center text-xs font-semibold focus:ring-2 focus:ring-[#ECB604] outline-none"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {errors.schoolType && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.schoolType}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 3: FINANCIAL STRESS */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Financial Stress</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel required>Monthly Family Income</QuestionLabel>
                        <select
                          value={formData.monthlyIncome}
                          onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select income range</option>
                          <option value="below-10000">Below ₹10,000</option>
                          <option value="10000-25000">₹10,000 - ₹25,000</option>
                          <option value="25000-50000">₹25,000 - ₹50,000</option>
                          <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                          <option value="above-100000">Above ₹1,00,000</option>
                        </select>
                        {errors.monthlyIncome && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.monthlyIncome}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Primary Income Source</QuestionLabel>
                        <select
                          value={formData.incomeSource}
                          onChange={(e) => handleInputChange("incomeSource", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select income source</option>
                          <option value="salary">Salary/Wages</option>
                          <option value="self-employed">Self-Employed</option>
                          <option value="daily-wage">Daily Wage</option>
                          <option value="pension">Small Business</option>
                        </select>
                        {errors.incomeSource && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.incomeSource}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Do you face delays in school fee payments?</QuestionLabel>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleInputChange("delayInFee", "yes");
                              handleInputChange("reasonForDelay", "");
                            }}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.delayInFee === "yes"
                              ? "bg-[#ECB604] text-white border-[#ECB604]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => {
                              handleInputChange("delayInFee", "no");
                              handleInputChange("reasonForDelay", "");
                            }}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.delayInFee === "no"
                              ? "bg-[#ECB604] text-white border-[#ECB604]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            No
                          </button>
                        </div>
                        {errors.delayInFee && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.delayInFee}</p>}
                      </div>

                      {formData.delayInFee === "yes" && (
                        <div className="space-y-1.5">
                          <QuestionLabel required>Main Reason for Delay</QuestionLabel>
                          <select
                            value={formData.reasonForDelay}
                            onChange={(e) => handleInputChange("reasonForDelay", e.target.value)}
                            className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                          >
                            <option value="">Select main reason</option>
                            <option value="insufficient-income">Insufficient Income</option>
                            <option value="unexpected-expense">Unexpected Expense</option>
                            <option value="job-loss">Job Loss</option>
                            <option value="multiple-children">Multiple Children Fees</option>
                            <option value="other">Other</option>
                          </select>
                          {formData.reasonForDelay === "other" && (
                            <textarea
                              placeholder="Please specify..."
                              value={formData.reasonForDelayOther || ""}
                              onChange={(e) => handleInputChange("reasonForDelayOther", e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                            />
                          )}
                          {errors.reasonForDelay && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.reasonForDelay}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 4: COMMUNITY SUPPORT */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">4</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Community Support</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel required>In Financial Crisis, Who Supports You?</QuestionLabel>
                        <select
                          value={formData.supportSource}
                          onChange={(e) => handleInputChange("supportSource", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select primary support</option>
                          <option value="family">Family Members</option>
                          <option value="friends">Friends</option>
                          <option value="school">School</option>
                          <option value="ngo">NGO/Community Organization</option>
                          <option value="government">Government Program</option>
                          <option value="none">None - I manage alone</option>
                          <option value="other">Other</option>
                        </select>
                        {formData.supportSource === "other" && (
                          <textarea
                            placeholder="Please specify..."
                            value={formData.supportSourceOther || ""}
                            onChange={(e) => handleInputChange("supportSourceOther", e.target.value)}
                            className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                          />
                        )}
                        {errors.supportSource && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.supportSource}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Do you feel socially isolated during financial stress?</QuestionLabel>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleInputChange("socialIsolation", "yes")}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.socialIsolation === "yes"
                              ? "bg-[#ECB604] text-white border-[#ECB604]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleInputChange("socialIsolation", "no")}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.socialIsolation === "no"
                              ? "bg-[#ECB604] text-white border-[#ECB604]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            No
                          </button>
                        </div>
                        {errors.socialIsolation && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.socialIsolation}</p>}
                      </div>

                      {formData.socialIsolation === "yes" && (
                        <div className="space-y-1.5">
                          <label className="block text-xs sm:text-sm font-semibold text-slate-700">Please explain briefly:</label>
                          <textarea
                            placeholder="Share your experience..."
                            value={formData.isolationReason || ""}
                            onChange={(e) => handleInputChange("isolationReason", e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <QuestionLabel required>Has School Ever Done Any of These?</QuestionLabel>
                        <div className="space-y-1.5">
                          {[
                            "Humiliated child in class about fees",
                            "Restricted participation in activities",
                            "Forced to sit separately",
                            "Denied access to school facilities",
                            "None of these",
                            "Other"
                          ].map(incident => (
                            <label key={incident} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="checkbox"
                                checked={formData.schoolIncidents.includes(incident)}
                                onChange={() => handleCheckboxChange("schoolIncidents", incident)}
                                className="w-4 h-4 text-[#00468e] rounded"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{incident}</span>
                            </label>
                          ))}
                        </div>
                        {formData.schoolIncidents.includes("Other") && (
                          <textarea
                            placeholder="Please specify..."
                            value={formData.schoolIncidentsOther || ""}
                            onChange={(e) => handleInputChange("schoolIncidentsOther", e.target.value)}
                            className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                          />
                        )}
                        {errors.schoolIncidents && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.schoolIncidents}</p>}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: GOVERNMENT AID */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">5</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Government Aid</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel required>Received Educational Financial Assistance from Government?</QuestionLabel>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleInputChange("govAssistance", "yes")}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.govAssistance === "yes"
                              ? "bg-[#00468e] text-white border-[#00468e]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleInputChange("govAssistance", "no")}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.govAssistance === "no"
                              ? "bg-[#00468e] text-white border-[#00468e]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            No
                          </button>
                        </div>
                        {errors.govAssistance && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.govAssistance}</p>}
                      </div>

                      {formData.govAssistance === "yes" && (
                        <div className="space-y-1.5">
                          <QuestionLabel required>Have you ever Applied for Government Scholarship/Aid?</QuestionLabel>
                          <select
                            value={formData.govApplication || ""}
                            onChange={(e) => handleInputChange("govApplication", e.target.value)}
                            className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                          >
                            <option value="">Select option</option>
                            <option value="applied-approved">Applied and Approved</option>
                            <option value="applied-rejected">Applied but Rejected</option>
                            <option value="never-applied">Never Applied</option>
                          </select>
                          {errors.govApplication && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.govApplication}</p>}
                        </div>
                      )}

                      {formData.govAssistance === "no" && (
                        <div className="space-y-1.5">
                          <QuestionLabel required>Why No Government Support?</QuestionLabel>
                          <div className="space-y-1.5">
                            {[
                              { value: "not-aware", label: "Not Aware of Schemes" },
                              { value: "not-eligible", label: "Don't Meet Eligibility" },
                              { value: "complex-process", label: "Process Too Complex" },
                              { value: "don't-need", label: "Don't Need It" },
                              { value: "other", label: "Other" }
                            ].map(option => (
                              <label key={option.value} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                                <input
                                  type="radio"
                                  name="govHelpReasons"
                                  value={option.value}
                                  checked={formData.govHelpReasons === option.value}
                                  onChange={(e) => handleInputChange("govHelpReasons", e.target.value)}
                                  className="w-4 h-4 text-[#ECB604]"
                                />
                                <span className="text-xs sm:text-sm text-slate-700">{option.label}</span>
                              </label>
                            ))}
                          </div>
                          {formData.govHelpReasons === "other" && (
                            <textarea
                              placeholder="Please specify..."
                              value={formData.govHelpReasonsOther || ""}
                              onChange={(e) => handleInputChange("govHelpReasonsOther", e.target.value)}
                              className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                            />
                          )}
                          {errors.govHelpReasons && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.govHelpReasons}</p>}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <QuestionLabel required>Banks/NBFCs Provided Short-term Zero-interest Help?</QuestionLabel>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleInputChange("bankShortTerm", "yes")}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.bankShortTerm === "yes"
                              ? "bg-[#ECB604] text-white border-[#ECB604]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleInputChange("bankShortTerm", "no")}
                            className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.bankShortTerm === "no"
                              ? "bg-[#ECB604] text-white border-[#ECB604]"
                              : "bg-slate-50 text-slate-700 border-slate-300"
                              }`}
                          >
                            No
                          </button>
                        </div>
                        {errors.bankShortTerm && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bankShortTerm}</p>}
                      </div>

                      {formData.bankShortTerm === "no" && (
                        <div className="space-y-1.5">
                          <QuestionLabel required>Why Not from Banks?</QuestionLabel>
                          <div className="space-y-1.5">
                            {[
                              { value: "not-eligible", label: "Not Eligible" },
                              { value: "high-interest", label: "Interest Rates Too High" },
                              { value: "collateral", label: "No Collateral" },
                              { value: "documentation", label: "Documentation Issues" },
                              { value: "didn't-apply", label: "Didn't Apply" },
                              { value: "other", label: "Other" }
                            ].map(option => (
                              <label key={option.value} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                                <input
                                  type="checkbox"
                                  name="bankReasons"
                                  value={option.value}
                                  checked={formData.bankReasons === option.value}
                                  onChange={(e) => handleInputChange("bankReasons", e.target.value)}
                                  className="w-4 h-4 text-[#ECB604]"
                                />
                                <span className="text-xs sm:text-sm text-slate-700">{option.label}</span>
                              </label>
                            ))}
                          </div>
                          {formData.bankReasons === "other" && (
                            <textarea
                              placeholder="Please specify..."
                              value={formData.bankReasonsOther || ""}
                              onChange={(e) => handleInputChange("bankReasonsOther", e.target.value)}
                              className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                            />
                          )}
                          {errors.bankReasons && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bankReasons}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 6: BORROWING PATTERNS */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">6</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Borrowing Patterns</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel required>Ever Borrowed for School Fees?</QuestionLabel>
                        <div className="space-y-1.5">
                          {[
                            "Never",
                            "Bank",
                            "NBFC",
                            "Relatives",
                            "Friends",
                            "Employer",
                            "Moneylender",
                          ].map(source => (
                            <div key={source}>
                              <label className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={formData.borrowingSource === source}
                                  onChange={() => handleBorrowingSourceChange(source)}
                                  className="w-4 h-4 text-[#ECB604]"
                                />
                                <span className="text-xs sm:text-sm text-slate-700">{source}</span>
                              </label>

                              {source === "Bank" && formData.borrowingSource === "Bank" && (
                                <div className="ml-6 mt-1.5">
                                  <input
                                    type="text"
                                    placeholder="Enter bank name"
                                    value={formData.borrowingDetails.Bank || ""}
                                    onChange={(e) => handleBorrowingDetailChange("Bank", e.target.value)}
                                    className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                                  />
                                </div>
                              )}

                              {source === "Relatives" && formData.borrowingSource === "Relatives" && (
                                <div className="ml-6 mt-1.5">
                                  <input
                                    type="text"
                                    placeholder="Enter relation (e.g., Uncle, Brother, Cousin)"
                                    value={formData.borrowingDetails.Relatives || ""}
                                    onChange={(e) => handleBorrowingDetailChange("Relatives", e.target.value)}
                                    className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {errors.borrowingSource && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.borrowingSource}</p>}
                        {errors.borrowingDetails && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.borrowingDetails}</p>}
                      </div>

                      {formData.borrowingSource && formData.borrowingSource !== "Never" && (
                        <div className="space-y-1.5">
                          <QuestionLabel required>Average Interest Rate Paid</QuestionLabel>
                          <select
                            value={formData.interestRate}
                            onChange={(e) => handleInputChange("interestRate", e.target.value)}
                            className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                          >
                            <option value="">Select rate</option>
                            <option value="0">0% (Interest-free)</option>
                            <option value="0-5">0-5%</option>
                            <option value="5-10">5-10%</option>
                            <option value="10-20">10-20%</option>
                            <option value="above-20">Above 20%</option>
                            <option value="don't-know">Don't know</option>
                            <option value="other">Other</option>
                          </select>
                          {formData.interestRate === "other" && (
                            <textarea
                              placeholder="Please specify the interest rate..."
                              value={formData.interestRateOther || ""}
                              onChange={(e) => handleInputChange("interestRateOther", e.target.value)}
                              className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                            />
                          )}
                          {errors.interestRate && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.interestRate}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 7: SUPPORT MODEL */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">7</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Support Model</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel required>Preferred Support Duration</QuestionLabel>
                        <div className="space-y-1.5">
                          {["Short-term (1-3 months)", "Medium-term (3-6 months)", "Long-term (6-12 months)", "Ongoing support"].map(duration => (
                            <label key={duration} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="checkbox"
                                name="preferredDuration"
                                value={duration}
                                checked={formData.preferredDuration === duration}
                                onChange={(e) => handleInputChange("preferredDuration", e.target.value)}
                                className="w-4 h-4 text-[#ECB604]"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{duration}</span>
                            </label>
                          ))}
                        </div>
                        {errors.preferredDuration && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.preferredDuration}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Would you prefer confidential support?</QuestionLabel>
                        <div className="space-y-1.5">
                          {["Yes, definitely", "Somewhat", "No, not needed"].map(option => (
                            <label key={option} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="checkbox"
                                name="confidentialSupport"
                                value={option}
                                checked={formData.confidentialSupport === option}
                                onChange={(e) => handleInputChange("confidentialSupport", e.target.value)}
                                className="w-4 h-4 text-[#ECB604]"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{option}</span>
                            </label>
                          ))}
                        </div>
                        {errors.confidentialSupport && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confidentialSupport}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Would you Recommend Program to Others?</QuestionLabel>
                        <div className="space-y-1.5">
                          {["Definitely", "Maybe", "Unlikely", "Need more info"].map(option => (
                            <label key={option} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="checkbox"
                                name="recommend"
                                value={option}
                                checked={formData.recommend === option}
                                onChange={(e) => handleInputChange("recommend", e.target.value)}
                                className="w-4 h-4 text-[#ECB604]"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{option}</span>
                            </label>
                          ))}
                        </div>
                        {errors.recommend && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.recommend}</p>}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 8: FEEDBACK */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-[#00468e] text-white rounded-lg flex items-center justify-center text-sm font-bold">8</div>
                      <h2 className="text-base sm:text-lg font-bold text-[#00468e]">Open Feedback</h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1.5">
                        <QuestionLabel>What is your biggest concern about your child's education?</QuestionLabel>
                        <textarea
                          placeholder="Share your main concern..."
                          value={formData.educationFear}
                          onChange={(e) => handleInputChange("educationFear", e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                        />
                        {errors.educationFear && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.educationFear}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>What kind of support would help you most?</QuestionLabel>
                        <textarea
                          placeholder="Describe the support you need..."
                          value={formData.supportNeeded}
                          onChange={(e) => handleInputChange("supportNeeded", e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                        />
                        {errors.supportNeeded && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.supportNeeded}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <QuestionLabel required>Join Community Resilience Network?</QuestionLabel>
                        <div className="space-y-1.5">
                          {["Yes, I'm interested", "Maybe later", "No, not interested"].map(option => (
                            <label key={option} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="checkbox"
                                name="communityNetwork"
                                value={option}
                                checked={formData.communityNetwork === option}
                                onChange={(e) => handleInputChange("communityNetwork", e.target.value)}
                                className="w-4 h-4 text-[#00468e]"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{option}</span>
                            </label>
                          ))}
                        </div>
                        {errors.communityNetwork && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.communityNetwork}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold bg-[#00468e] text-white hover:opacity-90 transition disabled:opacity-50 shadow-lg flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Survey"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop View - Sectioned Form */}
              <div className="hidden lg:block">
                {currentSection === 1 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Basic Information</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Please provide your contact details</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Parent/Guardian Names (At least one required)</QuestionLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Father Name"
                          value={formData.fatherName}
                          onChange={(e) => handleInputChange("fatherName", e.target.value)}
                          className="px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 text-xs sm:text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Mother Name"
                          value={formData.motherName}
                          onChange={(e) => handleInputChange("motherName", e.target.value)}
                          className="px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 text-xs sm:text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Guardian Name (Optional)"
                          value={formData.guardianName}
                          onChange={(e) => handleInputChange("guardianName", e.target.value)}
                          className="px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 text-xs sm:text-sm"
                        />
                      </div>
                      {errors.parentGuardian && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.parentGuardian}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                        <QuestionLabel required>State</QuestionLabel>
                        <select
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select State</option>
                          {STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.state}</p>}
                      </div>
                      <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                        <QuestionLabel required>Address</QuestionLabel>
                        <textarea
                          placeholder="Enter your complete address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                        />
                        {errors.address && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.address}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel required>Mobile Number</QuestionLabel>
                        <input
                          type="tel"
                          placeholder="10-digit number"
                          maxLength={10}
                          value={formData.mobileNumber}
                          onChange={(e) => handleInputChange("mobileNumber", e.target.value.replace(/\D/g, ''))}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.mobileNumber}</p>}
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel>Alternate Mobile (Optional)</QuestionLabel>
                        <input
                          type="tel"
                          placeholder="10-digit number"
                          maxLength={10}
                          value={formData.alternateMobile}
                          onChange={(e) => handleInputChange("alternateMobile", e.target.value.replace(/\D/g, ''))}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        />
                        {errors.alternateMobile && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.alternateMobile}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Email Address</QuestionLabel>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                      />
                      {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                    </div>
                  </div>
                )}

                {/* Desktop Section 2-8: Copy the same structure from the original document index 4 */}
                {/* For brevity, I'm showing the pattern - you need to include ALL sections 2-8 exactly as in the original file */}
                {/* SECTION 2: FAMILY DETAILS */}
                {currentSection === 2 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Family Details</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Tell us about your family and children</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Family Type</QuestionLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                        {["Nuclear Family", "Joint Family", "Single Parent", "Migrant Family"].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleInputChange("familyType", type)}
                            className={`px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2 ${formData.familyType === type
                              ? "bg-[#ECB604] text-white border-[#ECB604] shadow-md"
                              : "bg-slate-50 text-slate-700 border-slate-300 hover:border-[#ECB604]"
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {errors.familyType && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.familyType}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Number of School-going Children</QuestionLabel>
                      <select
                        value={formData.numberOfChildren}
                        onChange={(e) => {
                          handleInputChange("numberOfChildren", e.target.value);
                          handleInputChange("schoolTypeQuantity", {});
                        }}
                        className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                      >
                        <option value="">Select number of children</option>
                        <option value="1">1 Child</option>
                        <option value="2">2 Children</option>
                        <option value="3">3 Children</option>
                        <option value="4">4 Children</option>
                        <option value="5">More than 4 Children</option>
                      </select>
                      {errors.numberOfChildren && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.numberOfChildren}</p>}
                    </div>

                    {formData.numberOfChildren && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel required>School Types and Number of Children</QuestionLabel>
                        <p className="text-xs text-slate-600">
                          {formData.numberOfChildren === "1"
                            ? "Select the school type your child attends:"
                            : formData.numberOfChildren === "5"
                              ? "Distribute your children across school types (you can select multiple options):"
                              : `Distribute your ${formData.numberOfChildren} children across school types:`}
                        </p>
                        <div className="space-y-1.5">
                          {["Private School", "Government School", "Missionary/Trust School"].map(schoolType => (
                            <div key={schoolType} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                              <label className="flex items-center gap-2 cursor-pointer flex-1">
                                <input
                                  type={formData.numberOfChildren === "1" ? "radio" : "checkbox"}
                                  name={formData.numberOfChildren === "1" ? "schoolTypeRadio" : undefined}
                                  checked={(formData.schoolTypeQuantity[schoolType] || 0) > 0}
                                  onChange={(e) => {
                                    if (formData.numberOfChildren === "1") {
                                      if (e.target.checked) {
                                        handleInputChange("schoolTypeQuantity", { [schoolType]: 1 });
                                      }
                                    } else {
                                      if (e.target.checked) {
                                        handleSchoolTypeQuantity(schoolType, 1);
                                      } else {
                                        const newData = { ...formData.schoolTypeQuantity };
                                        delete newData[schoolType];
                                        handleInputChange("schoolTypeQuantity", newData);
                                      }
                                    }
                                  }}
                                  className="w-4 h-4 text-[#ECB604] rounded"
                                />
                                <span className="text-xs sm:text-sm text-slate-700">{schoolType}</span>
                              </label>
                              {(formData.schoolTypeQuantity[schoolType] || 0) > 0 && (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="1"
                                    max={formData.numberOfChildren === "1" ? "1" : formData.numberOfChildren === "5" ? "99" : formData.numberOfChildren}
                                    value={formData.schoolTypeQuantity[schoolType] || 0}
                                    onChange={(e) => handleSchoolTypeQuantity(schoolType, parseInt(e.target.value) || 0)}
                                    className="w-12 px-1.5 py-1 border border-slate-300 rounded text-center text-xs font-semibold focus:ring-2 focus:ring-[#ECB604] outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {errors.schoolType && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.schoolType}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 3: FINANCIAL STRESS */}
                {currentSection === 3 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Financial Stress</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Tell us about your financial situation</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Monthly Family Income</QuestionLabel>
                      <select
                        value={formData.monthlyIncome}
                        onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                        className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                      >
                        <option value="">Select income range</option>
                        <option value="below-10000">Below ₹10,000</option>
                        <option value="10000-25000">₹10,000 - ₹25,000</option>
                        <option value="25000-50000">₹25,000 - ₹50,000</option>
                        <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                        <option value="above-100000">Above ₹1,00,000</option>
                      </select>
                      {errors.monthlyIncome && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.monthlyIncome}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Primary Income Source</QuestionLabel>
                      <select
                        value={formData.incomeSource}
                        onChange={(e) => handleInputChange("incomeSource", e.target.value)}
                        className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                      >
                        <option value="">Select income source</option>
                        <option value="salary">Salary/Wages</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="daily-wage">Daily Wage</option>
                        <option value="pension">Small Business</option>
                      </select>
                      {errors.incomeSource && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.incomeSource}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Do you face delays in school fee payments?</QuestionLabel>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleInputChange("delayInFee", "yes");
                            handleInputChange("reasonForDelay", "");
                          }}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.delayInFee === "yes"
                            ? "bg-[#ECB604] text-white border-[#ECB604]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            handleInputChange("delayInFee", "no");
                            handleInputChange("reasonForDelay", "");
                          }}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.delayInFee === "no"
                            ? "bg-[#ECB604] text-white border-[#ECB604]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          No
                        </button>
                      </div>
                      {errors.delayInFee && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.delayInFee}</p>}
                    </div>

                    {formData.delayInFee === "yes" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel required>Main Reason for Delay</QuestionLabel>
                        <select
                          value={formData.reasonForDelay}
                          onChange={(e) => handleInputChange("reasonForDelay", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select main reason</option>
                          <option value="insufficient-income">Insufficient Income</option>
                          <option value="unexpected-expense">Unexpected Expense</option>
                          <option value="job-loss">Job Loss</option>
                          <option value="multiple-children">Multiple Children Fees</option>
                          <option value="other">Other</option>
                        </select>
                        {formData.reasonForDelay === "other" && (
                          <textarea
                            placeholder="Please specify..."
                            value={formData.reasonForDelayOther || ""}
                            onChange={(e) => handleInputChange("reasonForDelayOther", e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                          />
                        )}
                        {errors.reasonForDelay && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.reasonForDelay}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 4: COMMUNITY SUPPORT */}
                {currentSection === 4 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Community Support</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Tell us about your support network</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>In Financial Crisis, Who Supports You?</QuestionLabel>
                      <select
                        value={formData.supportSource}
                        onChange={(e) => handleInputChange("supportSource", e.target.value)}
                        className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                      >
                        <option value="">Select primary support</option>
                        <option value="family">Family Members</option>
                        <option value="friends">Friends</option>
                        <option value="school">School</option>
                        <option value="ngo">NGO/Community Organization</option>
                        <option value="government">Government Program</option>
                        <option value="none">None - I manage alone</option>
                        <option value="other">Other</option>
                      </select>
                      {formData.supportSource === "other" && (
                        <textarea
                          placeholder="Please specify..."
                          value={formData.supportSourceOther || ""}
                          onChange={(e) => handleInputChange("supportSourceOther", e.target.value)}
                          className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                        />
                      )}
                      {errors.supportSource && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.supportSource}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Do you feel socially isolated during financial stress?</QuestionLabel>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInputChange("socialIsolation", "yes")}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.socialIsolation === "yes"
                            ? "bg-[#ECB604] text-white border-[#ECB604]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleInputChange("socialIsolation", "no")}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.socialIsolation === "no"
                            ? "bg-[#ECB604] text-white border-[#ECB604]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          No
                        </button>
                      </div>
                      {errors.socialIsolation && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.socialIsolation}</p>}
                    </div>

                    {formData.socialIsolation === "yes" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-slate-700">Please explain briefly:</label>
                        <textarea
                          placeholder="Share your experience..."
                          value={formData.isolationReason || ""}
                          onChange={(e) => handleInputChange("isolationReason", e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Has School Ever Done Any of These?</QuestionLabel>
                      <div className="space-y-1.5">
                        {[
                          "Humiliated child in class about fees",
                          "Restricted participation in activities",
                          "Forced to sit separately",
                          "Denied access to school facilities",
                          "None of these",
                          "Other"
                        ].map(incident => (
                          <label key={incident} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                            <input
                              type="checkbox"
                              checked={formData.schoolIncidents.includes(incident)}
                              onChange={() => handleCheckboxChange("schoolIncidents", incident)}
                              className="w-4 h-4 text-[#00468e] rounded"
                            />
                            <span className="text-xs sm:text-sm text-slate-700">{incident}</span>
                          </label>
                        ))}
                      </div>
                      {formData.schoolIncidents.includes("Other") && (
                        <textarea
                          placeholder="Please specify..."
                          value={formData.schoolIncidentsOther || ""}
                          onChange={(e) => handleInputChange("schoolIncidentsOther", e.target.value)}
                          className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                        />
                      )}
                      {errors.schoolIncidents && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.schoolIncidents}</p>}
                    </div>
                  </div>
                )}

                {/* SECTION 5: GOVERNMENT AID */}
                {currentSection === 5 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Government Aid</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Tell us about government assistance</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Received Educational Financial Assistance from Government?</QuestionLabel>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInputChange("govAssistance", "yes")}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.govAssistance === "yes"
                            ? "bg-[#00468e] text-white border-[#00468e]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleInputChange("govAssistance", "no")}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.govAssistance === "no"
                            ? "bg-[#00468e] text-white border-[#00468e]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          No
                        </button>
                      </div>
                      {errors.govAssistance && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.govAssistance}</p>}
                    </div>

                    {formData.govAssistance === "yes" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel required>Have you ever Applied for Government Scholarship/Aid?</QuestionLabel>
                        <select
                          value={formData.govApplication || ""}
                          onChange={(e) => handleInputChange("govApplication", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select option</option>
                          <option value="applied-approved">Applied and Approved</option>
                          <option value="applied-rejected">Applied but Rejected</option>
                          <option value="never-applied">Never Applied</option>
                        </select>
                        {errors.govApplication && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.govApplication}</p>}
                      </div>
                    )}

                    {formData.govAssistance === "no" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel required>Why No Government Support?</QuestionLabel>
                        <div className="space-y-1.5">
                          {[
                            { value: "not-aware", label: "Not Aware of Schemes" },
                            { value: "not-eligible", label: "Don't Meet Eligibility" },
                            { value: "complex-process", label: "Process Too Complex" },
                            { value: "don't-need", label: "Don't Need It" },
                            { value: "other", label: "Other" }
                          ].map(option => (
                            <label key={option.value} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="radio"
                                name="govHelpReasons"
                                value={option.value}
                                checked={formData.govHelpReasons === option.value}
                                onChange={(e) => handleInputChange("govHelpReasons", e.target.value)}
                                className="w-4 h-4 text-[#ECB604]"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                        {formData.govHelpReasons === "other" && (
                          <textarea
                            placeholder="Please specify..."
                            value={formData.govHelpReasonsOther || ""}
                            onChange={(e) => handleInputChange("govHelpReasonsOther", e.target.value)}
                            className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                          />
                        )}
                        {errors.govHelpReasons && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.govHelpReasons}</p>}
                      </div>
                    )}

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Banks/NBFCs Provided Short-term Zero-interest Help?</QuestionLabel>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInputChange("bankShortTerm", "yes")}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.bankShortTerm === "yes"
                            ? "bg-[#ECB604] text-white border-[#ECB604]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleInputChange("bankShortTerm", "no")}
                          className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition border-2 ${formData.bankShortTerm === "no"
                            ? "bg-[#ECB604] text-white border-[#ECB604]"
                            : "bg-slate-50 text-slate-700 border-slate-300"
                            }`}
                        >
                          No
                        </button>
                      </div>
                      {errors.bankShortTerm && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bankShortTerm}</p>}
                    </div>

                    {formData.bankShortTerm === "no" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel required>Why Not from Banks?</QuestionLabel>
                        <div className="space-y-1.5">
                          {[
                            { value: "not-eligible", label: "Not Eligible" },
                            { value: "high-interest", label: "Interest Rates Too High" },
                            { value: "collateral", label: "No Collateral" },
                            { value: "documentation", label: "Documentation Issues" },
                            { value: "didn't-apply", label: "Didn't Apply" },
                            { value: "other", label: "Other" }
                          ].map(option => (
                            <label key={option.value} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="radio"
                                name="bankReasons"
                                value={option.value}
                                checked={formData.bankReasons === option.value}
                                onChange={(e) => handleInputChange("bankReasons", e.target.value)}
                                className="w-4 h-4 text-[#ECB604]"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                        {formData.bankReasons === "other" && (
                          <textarea
                            placeholder="Please specify..."
                            value={formData.bankReasonsOther || ""}
                            onChange={(e) => handleInputChange("bankReasonsOther", e.target.value)}
                            className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                          />
                        )}
                        {errors.bankReasons && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bankReasons}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 6: BORROWING PATTERNS */}
                {currentSection === 6 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Borrowing Patterns</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Tell us about your borrowing habits</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Ever Borrowed for School Fees?</QuestionLabel>
                      <div className="space-y-1.5">
                        {[
                          "Never",
                          "Bank",
                          "NBFC",
                          "Relatives",
                          "Friends",
                          "Employer",
                          "Moneylender",
                        ].map(source => (
                          <div key={source}>
                            <label className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                              <input
                                type="radio"
                                name="borrowingSource"
                                checked={formData.borrowingSource === source}
                                onChange={() => handleBorrowingSourceChange(source)}
                                className="w-4 h-4 text-[#ECB604]"
                              />
                              <span className="text-xs sm:text-sm text-slate-700">{source}</span>
                            </label>

                            {source === "Bank" && formData.borrowingSource === "Bank" && (
                              <div className="ml-6 mt-1.5">
                                <input
                                  type="text"
                                  placeholder="Enter bank name"
                                  value={formData.borrowingDetails.Bank || ""}
                                  onChange={(e) => handleBorrowingDetailChange("Bank", e.target.value)}
                                  className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                                />
                              </div>
                            )}

                            {source === "Relatives" && formData.borrowingSource === "Relatives" && (
                              <div className="ml-6 mt-1.5">
                                <input
                                  type="text"
                                  placeholder="Enter relation (e.g., Uncle, Brother, Cousin)"
                                  value={formData.borrowingDetails.Relatives || ""}
                                  onChange={(e) => handleBorrowingDetailChange("Relatives", e.target.value)}
                                  className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ECB604] outline-none bg-slate-50 text-xs sm:text-sm"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {errors.borrowingSource && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.borrowingSource}</p>}
                      {errors.borrowingDetails && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.borrowingDetails}</p>}
                    </div>

                    {formData.borrowingSource && formData.borrowingSource !== "Never" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <QuestionLabel required>Average Interest Rate Paid</QuestionLabel>
                        <select
                          value={formData.interestRate}
                          onChange={(e) => handleInputChange("interestRate", e.target.value)}
                          className="w-full px-2.5 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm"
                        >
                          <option value="">Select rate</option>
                          <option value="0">0% (Interest-free)</option>
                          <option value="0-5">0-5%</option>
                          <option value="5-10">5-10%</option>
                          <option value="10-20">10-20%</option>
                          <option value="above-20">Above 20%</option>
                          <option value="don't-know">Don't know</option>
                          <option value="other">Other</option>
                        </select>
                        {formData.interestRate === "other" && (
                          <textarea
                            placeholder="Please specify the interest rate..."
                            value={formData.interestRateOther || ""}
                            onChange={(e) => handleInputChange("interestRateOther", e.target.value)}
                            className="w-full mt-1.5 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-16 resize-none"
                          />
                        )}
                        {errors.interestRate && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.interestRate}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 7: SUPPORT MODEL */}
                {currentSection === 7 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Support Model</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Tell us about your preferred support</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Preferred Support Duration</QuestionLabel>
                      <div className="space-y-1.5">
                        {["Short-term (1-3 months)", "Medium-term (3-6 months)", "Long-term (6-12 months)", "Ongoing support"].map(duration => (
                          <label key={duration} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                            <input
                              type="radio"
                              name="preferredDuration"
                              value={duration}
                              checked={formData.preferredDuration === duration}
                              onChange={(e) => handleInputChange("preferredDuration", e.target.value)}
                              className="w-4 h-4 text-[#ECB604]"
                            />
                            <span className="text-xs sm:text-sm text-slate-700">{duration}</span>
                          </label>
                        ))}
                      </div>
                      {errors.preferredDuration && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.preferredDuration}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Would you prefer confidential support?</QuestionLabel>
                      <div className="space-y-1.5">
                        {["Yes, definitely", "Somewhat", "No, not needed"].map(option => (
                          <label key={option} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                            <input
                              type="radio"
                              name="confidentialSupport"
                              value={option}
                              checked={formData.confidentialSupport === option}
                              onChange={(e) => handleInputChange("confidentialSupport", e.target.value)}
                              className="w-4 h-4 text-[#ECB604]"
                            />
                            <span className="text-xs sm:text-sm text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      {errors.confidentialSupport && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confidentialSupport}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Would you Recommend Program to Others?</QuestionLabel>
                      <div className="space-y-1.5">
                        {["Definitely", "Maybe", "Unlikely", "Need more info"].map(option => (
                          <label key={option} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                            <input
                              type="radio"
                              name="recommend"
                              value={option}
                              checked={formData.recommend === option}
                              onChange={(e) => handleInputChange("recommend", e.target.value)}
                              className="w-4 h-4 text-[#ECB604]"
                            />
                            <span className="text-xs sm:text-sm text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      {errors.recommend && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.recommend}</p>}
                    </div>
                  </div>
                )}

                {/* SECTION 8: FEEDBACK */}
                {currentSection === 8 && (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00468e]">Open Feedback</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Please share your thoughts and concerns</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel>What is your biggest concern about your child's education?</QuestionLabel>
                      <textarea
                        placeholder="Share your main concern..."
                        value={formData.educationFear}
                        onChange={(e) => handleInputChange("educationFear", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                      />
                      {errors.educationFear && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.educationFear}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>What kind of support would help you most?</QuestionLabel>
                      <textarea
                        placeholder="Describe the support you need..."
                        value={formData.supportNeeded}
                        onChange={(e) => handleInputChange("supportNeeded", e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-slate-50 text-xs sm:text-sm min-h-20 resize-none"
                      />
                      {errors.supportNeeded && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.supportNeeded}</p>}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <QuestionLabel required>Join Community Resilience Network?</QuestionLabel>
                      <div className="space-y-1.5">
                        {["Yes, I'm interested", "Maybe later", "No, not interested"].map(option => (
                          <label key={option} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50 rounded">
                            <input
                              type="radio"
                              name="communityNetwork"
                              value={option}
                              checked={formData.communityNetwork === option}
                              onChange={(e) => handleInputChange("communityNetwork", e.target.value)}
                              className="w-4 h-4 text-[#00468e]"
                            />
                            <span className="text-xs sm:text-sm text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      {errors.communityNetwork && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.communityNetwork}</p>}
                    </div>
                  </div>
                )}
                {/* Navigation Buttons */}
                <div className="flex gap-2 justify-between pt-2 sm:pt-3 md:pt-4 border-t border-slate-200 mt-3 sm:mt-4 md:mt-5">
                  <button
                    onClick={handlePrevious}
                    disabled={currentSection === 1}
                    className={`px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${currentSection === 1
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                  >
                    Previous
                  </button>

                  {currentSection === sections.length ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#00468e] text-white hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Survey"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#00468e] text-white hover:opacity-90 transition"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}