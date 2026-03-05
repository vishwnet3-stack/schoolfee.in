"use client";

import { useState } from "react";
import { FaUserTie, FaGraduationCap, FaSchool, FaCheckCircle, FaIdCard } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";

// ============== TEACHER REGISTRATION WIZARD PAGE ==============
export default function TeacherRegistrationPage() {
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

  const qualifications = [
    "High School",
    "Intermediate",
    "Bachelor's Degree",
    "Master's Degree",
    "B.Ed",
    "M.Ed",
    "Ph.D",
    "Diploma in Education",
    "Other"
  ];

  const subjects = [
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "Social Studies",
    "History",
    "Geography",
    "Computer Science",
    "Physical Education",
    "Art & Craft",
    "Music",
    "Commerce",
    "Economics",
    "Political Science",
    "Other"
  ];

  const experienceYears = [
    "Fresher (0 years)",
    "Less than 1 year",
    "1-2 years",
    "2-5 years",
    "5-10 years",
    "10-15 years",
    "15-20 years",
    "20+ years"
  ];

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    full_name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    // Step 2: Professional Details
    qualification: "",
    otherQualification: "",
    subject: "",
    otherSubject: "",
    experience: "",
    // Step 3: Employment Details
    school_name: "",
    employee_id: "",
    salary_monthly: "",
    joining_date: "",
    employment_type: "",
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
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Valid 10-digit phone is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.state) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (formData.qualification === "Other" && !formData.otherQualification.trim())
      newErrors.otherQualification = "Please specify qualification";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (formData.subject === "Other" && !formData.otherSubject.trim())
      newErrors.otherSubject = "Please specify subject";
    if (!formData.experience) newErrors.experience = "Experience is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.school_name.trim()) newErrors.school_name = "School name is required";
    if (!formData.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
    if (!formData.salary_monthly || parseFloat(formData.salary_monthly) <= 0)
      newErrors.salary_monthly = "Valid monthly salary is required";
    if (!formData.joining_date) newErrors.joining_date = "Joining date is required";
    if (!formData.employment_type) newErrors.employment_type = "Employment type is required";
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
      console.log("Teacher Registration Complete:", formData);
      alert("Application submitted successfully!");
      // Redirect or reset form
    } else {
      alert("Please agree to the terms before submitting");
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: <FaUserTie />, status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending" },
    { number: 2, title: "Professional", icon: <FaGraduationCap />, status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending" },
    { number: 3, title: "Employment", icon: <FaSchool />, status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending" },
    { number: 4, title: "Review", icon: <FaCheckCircle />, status: currentStep === 4 ? "current" : "pending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00468e] mb-1 sm:mb-2">
            Teacher Registration
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            Apply for Schoolfee Teacher Membership
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
                <h2 className="text-xl font-bold text-slate-800">Application Progress</h2>
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
              {/* STEP 1: PERSONAL INFORMATION */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00468e]">Personal Information</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Please provide your personal details
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.full_name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.dob && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.dob}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Residential Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your complete address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white resize-none"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.address}
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
                </div>
              )}

              {/* STEP 2: PROFESSIONAL DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00468e]">Professional Details</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Your educational qualifications and expertise
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Highest Qualification <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    >
                      <option value="">Select Qualification</option>
                      {qualifications.map((qual) => (
                        <option key={qual} value={qual}>
                          {qual}
                        </option>
                      ))}
                    </select>
                    {errors.qualification && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.qualification}
                      </p>
                    )}
                  </div>

                  {formData.qualification === "Other" && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Specify Qualification <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherQualification"
                        placeholder="Please specify your qualification"
                        value={formData.otherQualification}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.otherQualification && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.otherQualification}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Subject Specialization <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.subject}
                      </p>
                    )}
                  </div>

                  {formData.subject === "Other" && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Specify Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherSubject"
                        placeholder="Please specify your subject"
                        value={formData.otherSubject}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.otherSubject && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.otherSubject}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Teaching Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    >
                      <option value="">Select Experience</option>
                      {experienceYears.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                    {errors.experience && (
                      <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.experience}
                      </p>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#00468e]">Note:</strong> Your professional details help us match you with the right opportunities. Please ensure all information is accurate.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: EMPLOYMENT DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00468e]">Employment Details</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Current or previous employment information
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="school_name"
                      placeholder="Enter your school name"
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
                        Employee ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="employee_id"
                        placeholder="Your employee ID"
                        value={formData.employee_id}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.employee_id && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.employee_id}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Employment Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="employment_type"
                        value={formData.employment_type}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      >
                        <option value="">Select Type</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Guest Faculty">Guest Faculty</option>
                      </select>
                      {errors.employment_type && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.employment_type}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Monthly Salary (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="salary_monthly"
                        placeholder="Enter monthly salary"
                        value={formData.salary_monthly}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.salary_monthly && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.salary_monthly}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Joining Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="joining_date"
                        value={formData.joining_date}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.joining_date && (
                        <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.joining_date}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-orange-200">
                    <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#f4951d]">Privacy Notice:</strong> Your employment and salary information is kept strictly confidential and will only be used for verification purposes.
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
                      Please review your information before submitting
                    </p>
                  </div>

                  {/* Personal Information Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-base sm:text-lg text-[#00468e] mb-3 sm:mb-4 flex items-center gap-2">
                      <FaUserTie className="text-lg sm:text-xl" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Name
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.full_name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Date of Birth
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.dob}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Gender
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.gender}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Phone
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Email
                        </p>
                        <p className="text-slate-800 font-semibold break-all">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          State
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.state}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Address
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-base sm:text-lg text-purple-700 mb-3 sm:mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-lg sm:text-xl" />
                      Professional Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Qualification
                        </p>
                        <p className="text-slate-800 font-semibold">
                          {formData.qualification === "Other" ? formData.otherQualification : formData.qualification}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Subject
                        </p>
                        <p className="text-slate-800 font-semibold">
                          {formData.subject === "Other" ? formData.otherSubject : formData.subject}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Experience
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-green-200">
                    <h4 className="font-bold text-base sm:text-lg text-[#0cab47] mb-3 sm:mb-4 flex items-center gap-2">
                      <FaSchool className="text-lg sm:text-xl" />
                      Employment Details
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
                          Employee ID
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.employee_id}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Employment Type
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.employment_type}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Monthly Salary
                        </p>
                        <p className="text-slate-800 font-bold text-base sm:text-lg">₹{formData.salary_monthly}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                          Joining Date
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.joining_date}</p>
                      </div>
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
                        I confirm that all information provided is accurate to the best of my
                        knowledge. I understand that Schoolfee will verify this information with
                        the school and other relevant parties. I agree to the{" "}
                        <span className="text-[#00468e] font-semibold">Terms & Conditions</span>{" "}
                        and <span className="text-[#00468e] font-semibold">Privacy Policy</span>.
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
                    {agreed ? "Submit Application ✓" : "Submit Application"}
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