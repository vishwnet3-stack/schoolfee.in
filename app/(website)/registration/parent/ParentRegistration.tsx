"use client";

import { useState } from "react";
import { FaUserTie, FaChild, FaMoneyBillWave, FaCheckCircle, FaIdCard } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";

// ============== PARENT REGISTRATION WIZARD PAGE ==============
export default function ParentRegistrationPage() {
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

  const [formData, setFormData] = useState({
    // Step 1: Parent Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    // Step 2: Children Details
    numberOfChildren: 0,
    children: Array.from({ length: 5 }, () => ({
      fullName: "",
      classGrade: "",
      admissionNumber: "",
      schoolName: "",
      schoolCity: "",
    })),
    // Step 3: Support Request
    feeAmount: "",
    feePeriod: "",
    reasonForSupport: "",
    otherReason: "",
    description: "",
    repaymentDuration: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    childIndex?: number
  ) => {
    const { name, value } = e.target;

    if (childIndex !== undefined) {
      const newChildren = [...formData.children];
      newChildren[childIndex] = { ...newChildren[childIndex], [name]: value };
      setFormData((prev) => ({ ...prev, children: newChildren }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Valid 10-digit phone is required";
    if (!validatePAN(formData.panNumber))
      newErrors.panNumber = "Valid PAN number is required (e.g., ABCDE1234F)";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.numberOfChildren === 0) {
      newErrors.numberOfChildren = "Please select number of children";
      setErrors(newErrors);
      return false;
    }
    for (let i = 0; i < formData.numberOfChildren; i++) {
      if (!formData.children[i].fullName.trim())
        newErrors[`child${i}Name`] = "Child name is required";
      if (!formData.children[i].classGrade.trim())
        newErrors[`child${i}Grade`] = "Class/Grade is required";
      if (!formData.children[i].admissionNumber.trim())
        newErrors[`child${i}Admission`] = "Admission number is required";
      if (!formData.children[i].schoolName.trim())
        newErrors[`child${i}School`] = "School name is required";
      if (!formData.children[i].schoolCity.trim())
        newErrors[`child${i}City`] = "School city is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.feeAmount || parseFloat(formData.feeAmount) <= 0)
      newErrors.feeAmount = "Valid fee amount is required";
    if (!formData.feePeriod) newErrors.feePeriod = "Fee period is required";
    if (!formData.reasonForSupport)
      newErrors.reasonForSupport = "Reason for support is required";
    if (formData.reasonForSupport === "other" && !formData.otherReason.trim())
      newErrors.otherReason = "Please specify other reason";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.repaymentDuration)
      newErrors.repaymentDuration = "Repayment duration is required";
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
      console.log("Parent Registration Complete:", formData);
      alert("Application submitted successfully!");
      // Redirect or reset form
    } else {
      alert("Please agree to the terms before submitting");
    }
  };

  const steps = [
    { number: 1, title: "Parent Info", icon: <FaUserTie />, status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending" },
    { number: 2, title: "Children", icon: <FaChild />, status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending" },
    { number: 3, title: "Support", icon: <FaMoneyBillWave />, status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending" },
    { number: 4, title: "Review", icon: <FaCheckCircle />, status: currentStep === 4 ? "current" : "pending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold text-[#00468e] mb-2">
            Registration
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Apply for Financial Support for Your Child's Education
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* LEFT SIDEBAR - Progress Stepper (Desktop) */}
          <div className="hidden lg:block lg:w-80 animate-slideInLeft bg-cover bg-center">
            <div className="bg-white rounded-2xl p-6 sticky top-8 border border-slate-200 bg-cover bg-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#F4951D] rounded-2xl flex items-center justify-center mb-4 ">
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
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300  ${
                          step.status === "completed"
                            ? "bg-[#0cab47] text-white scale-100"
                            : step.status === "current"
                            ? "bg-[#00468e] text-white scale-110 "
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
          <div className="lg:hidden mb-4 animate-fadeIn  bg-cover bg-center">
            <div className="bg-white rounded-xl  p-4 border border-slate-200  bg-center">
              <div className="flex items-center justify-between mb-3 bg-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex-1 flex flex-col items-center">
                    {/* Icon Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step.status === "completed"
                          ? "bg-[#0cab47] text-white"
                          : step.status === "current"
                          ? "bg-[#00468e] text-white scale-110"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <IoMdCheckmark className="text-xl" />
                      ) : (
                        <span className="text-xs">{step.icon}</span>
                      )}
                    </div>

                    {/* Title */}
                    <p
                      className={`text-[10px] sm:text-xs font-semibold mt-2 text-center transition-colors ${
                        step.status === "current"
                          ? "text-[#00468e]"
                          : step.status === "completed"
                          ? "text-[#0cab47]"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden sm:block absolute top-5 left-1/2 w-full h-0.5 -z-10">
                        <div
                          className={`h-full transition-all duration-500 ${
                            step.status === "completed" ? "bg-[#0cab47]" : "bg-slate-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00468e] to-[#0cab47] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Form Content */}
          <div className="flex-1 animate-slideInRight">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
              {/* STEP 1: PARENT INFORMATION */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="">
                    <h3 className="text-2xl font-bold text-[#00468e]">Parent Information</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Please provide your personal details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        PAN Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        placeholder="ABCDE1234F"
                        value={formData.panNumber}
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase();
                          handleInputChange(e);
                        }}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white uppercase"
                      />
                      {errors.panNumber && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.panNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Residential Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your complete address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white resize-none"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.state}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CHILDREN DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="">
                    <h3 className="text-2xl font-bold text-[#00468e]">Children & School Details</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Provide information about your children
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Number of Children <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="numberOfChildren"
                      value={formData.numberOfChildren}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          numberOfChildren: parseInt(e.target.value),
                        }));
                        setErrors({});
                      }}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    >
                      <option value={0}>Select Number of Children</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                    {errors.numberOfChildren && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.numberOfChildren}
                      </p>
                    )}
                  </div>

                  {/* Children Forms */}
                  <div className="space-y-6">
                    {Array.from({ length: formData.numberOfChildren }).map((_, index) => (
                      <div
                        key={index}
                        className="p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#00468e] text-white flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <h4 className="font-bold text-lg text-slate-800">
                            Child {index + 1} Details
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="fullName"
                              placeholder="Enter child's full name"
                              value={formData.children[index].fullName}
                              onChange={(e) => handleInputChange(e, index)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-white text-sm"
                            />
                            {errors[`child${index}Name`] && (
                              <p className="text-red-500 text-xs mt-1">
                                ⚠ {errors[`child${index}Name`]}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-slate-700">
                                Class/Grade <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="classGrade"
                                placeholder="e.g., Class 5"
                                value={formData.children[index].classGrade}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-white text-sm"
                              />
                              {errors[`child${index}Grade`] && (
                                <p className="text-red-500 text-xs mt-1">
                                  ⚠ {errors[`child${index}Grade`]}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-slate-700">
                                Admission Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="admissionNumber"
                                placeholder="Roll/Admission no."
                                value={formData.children[index].admissionNumber}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-white text-sm"
                              />
                              {errors[`child${index}Admission`] && (
                                <p className="text-red-500 text-xs mt-1">
                                  ⚠ {errors[`child${index}Admission`]}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">
                              School Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="schoolName"
                              placeholder="Enter school name"
                              value={formData.children[index].schoolName}
                              onChange={(e) => handleInputChange(e, index)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-white text-sm"
                            />
                            {errors[`child${index}School`] && (
                              <p className="text-red-500 text-xs mt-1">
                                ⚠ {errors[`child${index}School`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">
                              School City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="schoolCity"
                              placeholder="Enter school city"
                              value={formData.children[index].schoolCity}
                              onChange={(e) => handleInputChange(e, index)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-white text-sm"
                            />
                            {errors[`child${index}City`] && (
                              <p className="text-red-500 text-xs mt-1">
                                ⚠ {errors[`child${index}City`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: SUPPORT REQUEST */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="">
                    <h3 className="text-2xl font-bold text-[#00468e]">Support Request Details</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Tell us about your financial support needs
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Total Fee Amount (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="feeAmount"
                        placeholder="Enter amount in rupees"
                        value={formData.feeAmount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.feeAmount && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.feeAmount}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Fee Period <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="feePeriod"
                        value={formData.feePeriod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      >
                        <option value="">Select Fee Period</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="halfYearly">Half Yearly</option>
                        <option value="annual">Annual</option>
                      </select>
                      {errors.feePeriod && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.feePeriod}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Reason for Support <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="reasonForSupport"
                      value={formData.reasonForSupport}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    >
                      <option value="">Select Reason</option>
                      <option value="jobLoss">Job Loss / Unemployment</option>
                      <option value="medical">Medical Emergency</option>
                      <option value="businessLoan">Business Loan</option>
                      <option value="familyEmergency">Family Emergency</option>
                      <option value="cashflow">Temporary Cash Flow Issue</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.reasonForSupport && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.reasonForSupport}
                      </p>
                    )}
                  </div>

                  {formData.reasonForSupport === "other" && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="block text-sm font-semibold text-slate-700">
                        Specify Other Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherReason"
                        placeholder="Please specify your reason"
                        value={formData.otherReason}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                      />
                      {errors.otherReason && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          ⚠ {errors.otherReason}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Brief Description of Your Situation <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Please describe your situation in detail. This helps us understand your needs better."
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Preferred Repayment Duration <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="repaymentDuration"
                      value={formData.repaymentDuration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00468e] focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
                    >
                      <option value="">Select Duration</option>
                      {Array.from({ length: 12 }, (_, i) => (i + 1) * 3).map((months) => (
                        <option key={months} value={months}>
                          {months} months ({Math.floor(months / 12) > 0 && `${Math.floor(months / 12)} ${Math.floor(months / 12) === 1 ? 'year' : 'years'}`}{Math.floor(months / 12) > 0 && months % 12 > 0 && ' '}{months % 12 > 0 && `${months % 12} months`})
                        </option>
                      ))}
                    </select>
                    {errors.repaymentDuration && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        ⚠ {errors.repaymentDuration}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SUBMIT */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="">
                    <h3 className="text-2xl font-bold text-[#0cab47]">Review & Submit</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Please review your information before submitting
                    </p>
                  </div>

                  {/* Parent Information Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-lg text-[#00468e] mb-4 flex items-center gap-2">
                      <FaUserTie className="text-xl" />
                      Parent Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Name
                        </p>
                        <p className="text-slate-800 font-semibold">
                          {formData.firstName} {formData.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Email
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Phone
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          PAN Number
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.panNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          City
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.city}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          State
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.state}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Address
                        </p>
                        <p className="text-slate-800 font-semibold">{formData.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Children Information Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                    <h4 className="font-bold text-lg text-[#0cab47] mb-4 flex items-center gap-2">
                      <FaChild className="text-xl" />
                      Children & School Details ({formData.numberOfChildren} {formData.numberOfChildren === 1 ? 'Child' : 'Children'})
                    </h4>
                    <div className="space-y-4">
                      {Array.from({ length: formData.numberOfChildren }).map((_, index) => (
                        <div
                          key={index}
                          className="pb-4 border-b border-green-200 last:border-b-0"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-[#0cab47] text-white flex items-center justify-center font-bold text-xs">
                              {index + 1}
                            </div>
                            <p className="font-bold text-slate-800">
                              {formData.children[index].fullName}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pl-8">
                            <div>
                              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                                Class
                              </p>
                              <p className="text-slate-800 font-semibold">
                                {formData.children[index].classGrade}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                                Admission No
                              </p>
                              <p className="text-slate-800 font-semibold">
                                {formData.children[index].admissionNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                                School
                              </p>
                              <p className="text-slate-800 font-semibold">
                                {formData.children[index].schoolName}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                                School City
                              </p>
                              <p className="text-slate-800 font-semibold">
                                {formData.children[index].schoolCity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Support Request Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200">
                    <h4 className="font-bold text-lg text-[#f4951d] mb-4 flex items-center gap-2">
                      <FaMoneyBillWave className="text-xl" />
                      Support Request Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Fee Amount
                        </p>
                        <p className="text-slate-800 font-bold text-lg">₹{formData.feeAmount}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Fee Period
                        </p>
                        <p className="text-slate-800 font-semibold capitalize">
                          {formData.feePeriod}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Repayment Duration
                        </p>
                        <p className="text-slate-800 font-semibold">
                          {formData.repaymentDuration} months
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Reason
                        </p>
                        <p className="text-slate-800 font-semibold capitalize">
                          {formData.reasonForSupport === "other"
                            ? formData.otherReason
                            : formData.reasonForSupport}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
                          Description
                        </p>
                        <p className="text-slate-800 font-semibold leading-relaxed">
                          {formData.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-300">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-[#00468e] cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition">
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
              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200  ${
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
                    className="px-6 py-3 bg-gradient-to-r from-[#00468e] to-[#0066b3] text-white rounded-lg font-semibold hover:from-[#003666] hover:to-[#00468e] transition-all duration-200 active:scale-95"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!agreed}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200  ${
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