"use client";

import { useState } from "react";
import { FaSchool, FaUserTie, FaMapMarkerAlt, FaCheckCircle, FaIdCard } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";

// ============== SCHOOL REGISTRATION WIZARD PAGE ==============
export default function SchoolRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const schoolTypes = [
    "Government",
    "Government Aided",
    "Private Unaided",
    "Central Government",
    "International",
    "Other"
  ];

  const affiliationBoards = [
    "CBSE (Central Board of Secondary Education)",
    "ICSE (Indian Certificate of Secondary Education)",
    "State Board",
    "IB (International Baccalaureate)",
    "IGCSE (Cambridge)",
    "NIOS (National Institute of Open Schooling)",
    "Other"
  ];

  const [formData, setFormData] = useState({
    // Step 1: School Basic Information
    school_name: "",
    school_type: "",
    established_year: "",
    affiliation_board: "",
    otherAffiliationBoard: "",
    affiliation_id: "",
    // Step 2: Contact & Location
    school_address: "",
    city: "",
    state: "",
    pincode: "",
    contact_number: "",
    alternate_contact: "",
    official_email: "",
    website_url: "",
    // Step 3: Administrative Details
    principal_name: "",
    principal_email: "",
    principal_contact: "",
    total_students: "",
    total_teachers: "",
    infrastructure_details: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.school_name.trim()) newErrors.school_name = "School name is required";
    if (!formData.school_type) newErrors.school_type = "School type is required";
    if (!formData.established_year) newErrors.established_year = "Established year is required";
    const currentYear = new Date().getFullYear();
    if (formData.established_year && (parseInt(formData.established_year) < 1800 || parseInt(formData.established_year) > currentYear)) {
      newErrors.established_year = `Year must be between 1800 and ${currentYear}`;
    }
    if (!formData.affiliation_board) newErrors.affiliation_board = "Affiliation board is required";
    if (formData.affiliation_board === "Other" && !formData.otherAffiliationBoard.trim())
      newErrors.otherAffiliationBoard = "Please specify affiliation board";
    if (!formData.affiliation_id.trim()) newErrors.affiliation_id = "Affiliation ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.school_address.trim()) newErrors.school_address = "School address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode.match(/^\d{6}$/))
      newErrors.pincode = "Valid 6-digit pincode is required";
    if (!formData.contact_number.match(/^\d{10}$/))
      newErrors.contact_number = "Valid 10-digit contact number is required";
    if (formData.alternate_contact && !formData.alternate_contact.match(/^\d{10}$/))
      newErrors.alternate_contact = "Valid 10-digit alternate contact is required";
    if (!formData.official_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.official_email = "Valid email is required";
    if (formData.website_url && !formData.website_url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
      newErrors.website_url = "Valid website URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.principal_name.trim()) newErrors.principal_name = "Principal name is required";
    if (!formData.principal_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.principal_email = "Valid principal email is required";
    if (!formData.principal_contact.match(/^\d{10}$/))
      newErrors.principal_contact = "Valid 10-digit contact number is required";
    if (!formData.total_students || parseInt(formData.total_students) <= 0)
      newErrors.total_students = "Valid number of students is required";
    if (!formData.total_teachers || parseInt(formData.total_teachers) <= 0)
      newErrors.total_teachers = "Valid number of teachers is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();

    if (isValid) {
      setCurrentStep(currentStep + 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (agreed) {
      console.log("School Registration Complete:", formData);
      alert("School registration submitted successfully!");
      // Redirect or reset form
    } else {
      alert("Please agree to the terms before submitting");
    }
  };

  const steps = [
    { number: 1, title: "School Info", icon: <FaSchool />, status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending" },
    { number: 2, title: "Contact", icon: <FaMapMarkerAlt />, status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending" },
    { number: 3, title: "Admin Details", icon: <FaUserTie />, status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending" },
    { number: 4, title: "Review", icon: <FaCheckCircle />, status: currentStep === 4 ? "current" : "pending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00468e] mb-1 sm:mb-2">
            School Registration
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            Register your school with Schoolfee to ensure timely student fee collection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* LEFT SIDEBAR - Progress Stepper (Desktop) */}
          <div className="hidden lg:block lg:w-80 animate-slideInLeft">
            <div className="bg-white rounded-2xl p-6 sticky top-8 border border-slate-200">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#F4951D] rounded-2xl flex items-center justify-center mb-4">
                  <FaIdCard className="text-white text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Registration Progress</h2>
                <p className="text-sm text-slate-500 mt-1">Step {currentStep} of 4</p>
              </div>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="relative">
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-6 top-14 w-0.5 h-12 transition-all duration-500 ${
                          step.status === "completed" ? "bg-[#0cab47]" : "bg-slate-200"
                        }`}
                      />
                    )}

                    <div className="flex items-start gap-4 relative z-10">
                      {/* Step Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          step.status === "completed"
                            ? "bg-[#0cab47] text-white scale-100"
                            : step.status === "current"
                            ? "bg-[#00468e] text-white scale-110"
                            : "bg-slate-200 text-slate-400 scale-95"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <IoMdCheckmark className="text-2xl" />
                        ) : (
                          <span className="text-sm">{step.icon}</span>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pt-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Step {step.number}
                        </p>
                        <p
                          className={`text-sm font-bold mt-0.5 transition-colors ${
                            step.status === "current"
                              ? "text-[#00468e]"
                              : step.status === "completed"
                              ? "text-[#0cab47]"
                              : "text-slate-400"
                          }`}
                        >
                          {step.title}
                        </p>
                        {step.status === "current" && (
                          <p className="text-xs text-slate-500 mt-1">In Progress</p>
                        )}
                        {step.status === "completed" && (
                          <p className="text-xs text-[#0cab47] mt-1">Completed</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-slate-700 mb-2">Need Help?</p>
                <button className="text-xs text-[#00468e] font-medium hover:underline transition">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>

          {/* TOP PROGRESS BAR (Mobile/Tablet) */}
          <div className="lg:hidden mb-3 sm:mb-4 animate-fadeIn">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex-1 flex flex-col items-center">
                    {/* Icon Circle */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step.status === "completed"
                          ? "bg-[#0cab47] text-white"
                          : step.status === "current"
                          ? "bg-[#00468e] text-white scale-110"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <IoMdCheckmark className="text-base sm:text-xl" />
                      ) : (
                        <span className="text-[10px] sm:text-xs">{step.icon}</span>
                      )}
                    </div>

                    {/* Title */}
                    <p
                      className={`text-[9px] sm:text-[10px] md:text-xs font-semibold mt-1 sm:mt-2 text-center transition-colors ${
                        step.status === "current"
                          ? "text-[#00468e]"
                          : step.status === "completed"
                          ? "text-[#0cab47]"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00468e] to-[#0cab47] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Form Content */}
          <div className="flex-1 animate-slideInRight">
            <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200">
              {/* STEP 1: SCHOOL BASIC INFORMATION */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00468e]">School Basic Information</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Please provide your school's basic details
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="school_name"
                      placeholder="Enter school name"
                      value={formData.school_name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    />
                    {errors.school_name && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.school_name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        School Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="school_type"
                        value={formData.school_type}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      >
                        <option value="">Select School Type</option>
                        {schoolTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.school_type && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.school_type}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Established Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="established_year"
                        placeholder="e.g., 1995"
                        value={formData.established_year}
                        onChange={handleInputChange}
                        min="1800"
                        max={new Date().getFullYear()}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.established_year && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.established_year}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Affiliation Board <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="affiliation_board"
                      value={formData.affiliation_board}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    >
                      <option value="">Select Affiliation Board</option>
                      {affiliationBoards.map((board) => (
                        <option key={board} value={board}>
                          {board}
                        </option>
                      ))}
                    </select>
                    {errors.affiliation_board && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.affiliation_board}
                      </p>
                    )}
                  </div>

                  {formData.affiliation_board === "Other" && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Specify Affiliation Board <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherAffiliationBoard"
                        placeholder="Please specify affiliation board"
                        value={formData.otherAffiliationBoard}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.otherAffiliationBoard && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.otherAffiliationBoard}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Affiliation ID / Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="affiliation_id"
                      placeholder="Enter affiliation or registration number"
                      value={formData.affiliation_id}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    />
                    {errors.affiliation_id && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.affiliation_id}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: CONTACT & LOCATION */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00468e]">Contact & Location Details</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      School address and contact information
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      School Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="school_address"
                      placeholder="Enter complete school address"
                      rows={3}
                      value={formData.school_address}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white resize-none"
                    />
                    {errors.school_address && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.school_address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.state}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        maxLength={6}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contact_number"
                        placeholder="10-digit contact number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        maxLength={10}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.contact_number && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.contact_number}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Alternate Contact
                      </label>
                      <input
                        type="tel"
                        name="alternate_contact"
                        placeholder="10-digit alternate number"
                        value={formData.alternate_contact}
                        onChange={handleInputChange}
                        maxLength={10}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.alternate_contact && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.alternate_contact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Official Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="official_email"
                      placeholder="school@example.com"
                      value={formData.official_email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    />
                    {errors.official_email && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.official_email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website_url"
                      placeholder="https://www.yourschool.com"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    />
                    {errors.website_url && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.website_url}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: ADMINISTRATIVE DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00468e]">Administrative Details</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Principal information and school statistics
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Principal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="principal_name"
                      placeholder="Enter principal's full name"
                      value={formData.principal_name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    />
                    {errors.principal_name && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.principal_name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Principal Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="principal_email"
                        placeholder="principal@example.com"
                        value={formData.principal_email}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.principal_email && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.principal_email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Principal Contact <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="principal_contact"
                        placeholder="10-digit mobile number"
                        value={formData.principal_contact}
                        onChange={handleInputChange}
                        maxLength={10}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.principal_contact && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.principal_contact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Total Number of Students <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="total_students"
                        placeholder="Enter total students"
                        value={formData.total_students}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.total_students && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.total_students}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Total Number of Teachers <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="total_teachers"
                        placeholder="Enter total teachers"
                        value={formData.total_teachers}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.total_teachers && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.total_teachers}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Infrastructure & Facilities (Optional)
                    </label>
                    <textarea
                      name="infrastructure_details"
                      placeholder="Briefly describe your school's infrastructure, facilities, and amenities (e.g., library, computer lab, sports facilities, etc.)"
                      rows={4}
                      value={formData.infrastructure_details}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white resize-none"
                    />
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#00468e]">Note:</strong> All information will be verified during the onboarding process. Please ensure accuracy.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SUBMIT */}
              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0cab47]">Review & Submit</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Please review all information before submitting
                    </p>
                  </div>

                  {/* School Basic Information Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-base sm:text-lg text-[#00468e] mb-3 sm:mb-4 flex items-center gap-2">
                      <FaSchool className="text-lg sm:text-xl" />
                      School Basic Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          School Name
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.school_name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          School Type
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.school_type}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Established Year
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.established_year}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Affiliation Board
                        </p>
                        <p className="text-slate-800 font-semibold">
                          {formData.affiliation_board === "Other" ? formData.otherAffiliationBoard : formData.affiliation_board}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Affiliation ID
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.affiliation_id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Location Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-base sm:text-lg text-purple-700 mb-3 sm:mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-lg sm:text-xl" />
                      Contact & Location Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Address
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.school_address}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          City
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.city}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          State
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.state}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Pincode
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.pincode}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Contact Number
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.contact_number}</p>
                      </div>
                      {formData.alternate_contact && (
                        <div>
                          <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                            Alternate Contact
                          </p>
                          <p className="text-slate-800 font-semibold">{formData.alternate_contact}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Official Email
                        </p>
                        <p className="text-slate-800 font-semibold break-all">{formData.official_email}</p>
                      </div>
                      {formData.website_url && (
                        <div>
                          <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                            Website
                          </p>
                          <p className="text-slate-800 font-semibold break-all">{formData.website_url}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Administrative Details Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-green-200">
                    <h4 className="font-bold text-base sm:text-lg text-[#0cab47] mb-3 sm:mb-4 flex items-center gap-2">
                      <FaUserTie className="text-lg sm:text-xl" />
                      Administrative Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Principal Name
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.principal_name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Principal Email
                        </p>
                        <p className="text-slate-800 font-semibold break-all">{formData.principal_email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Principal Contact
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.principal_contact}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Total Students
                        </p>
                        <p className="text-slate-800 font-bold text-base sm:text-lg">{formData.total_students}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Total Teachers
                        </p>
                        <p className="text-slate-800 font-bold text-base sm:text-lg">{formData.total_teachers}</p>
                      </div>
                      {formData.infrastructure_details && (
                        <div className="sm:col-span-2">
                          <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                            Infrastructure Details
                          </p>
                          <p className="text-slate-800 font-semibold leading-relaxed">
                            {formData.infrastructure_details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="bg-slate-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-slate-300">
                    <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 accent-[#00468e] cursor-pointer flex-shrink-0"
                      />
                      <span className="text-[10px] sm:text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition">
                        I confirm that all information provided is accurate and complete. I understand
                        that Schoolfee will verify this information and may request additional
                        documentation during the onboarding process. I agree to the{" "}
                        <span className="text-[#00468e] font-semibold">Terms & Conditions</span> and{" "}
                        <span className="text-[#00468e] font-semibold">Privacy Policy</span> of
                        Schoolfee.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition-all duration-200 ${
                    currentStep === 1
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-slate-500 text-white hover:bg-slate-600 active:scale-95"
                  }`}
                >
                  ← Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#00468e] to-[#0066b3] text-white rounded-lg font-semibold hover:from-[#003666] hover:to-[#00468e] transition-all duration-200 active:scale-95"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!agreed}
                    className={`px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition-all duration-200 ${
                      agreed
                        ? "bg-gradient-to-r from-[#0cab47] to-[#08d451] text-white hover:from-[#0a9639] hover:to-[#0cab47] active:scale-95"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {agreed ? "Submit Registration ✓" : "Submit Registration"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}