"use client";
import { FaTimes, FaChalkboardTeacher, FaSchool, FaUserTie } from "react-icons/fa";
import React from "react"

import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, icon, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl overflow-hidden animate-fadeIn">
        <div className="bg-[#00468e] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
            <FaTimes />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============== TEACHER MODAL ==============
export function TeacherModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    gender: "",
    qualification: "",
    subject: "",
    experience: "",
    school_name: "",
    employee_id: "",
    phone: "",
    email: "",
    address: ""
    
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.experience || parseFloat(formData.experience) < 0) newErrors.experience = "Valid experience required";
    if (!formData.school_name.trim()) newErrors.school_name = "School name is required";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Valid 10-digit phone required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Teacher Registration Data:", formData);
      alert("Teacher registered successfully!");
      setFormData({
        full_name: "",
        dob: "",
        gender: "",
        qualification: "",
        subject: "",
        experience: "",
        school_name: "",
        employee_id: "",
        phone: "",
        email: "",
        address: "",
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Teacher Registration" icon={<FaChalkboardTeacher className="text-[#f4951d] text-xl" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
          </div>
          <div>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-white">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
        </div>

        <div>
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="subject"
              placeholder="Subject Specialization"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>
          <div>
            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>
        </div>

        <div>
          <input
            type="text"
            name="school_name"
            placeholder="Current School Name"
            value={formData.school_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.school_name && <p className="text-red-500 text-sm mt-1">{errors.school_name}</p>}
        </div>

        <input type="text" name="employee_id" placeholder="Employee ID (if applicable)" value={formData.employee_id} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Contact Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <textarea
            name="address"
            placeholder="Residential Address"
            rows={2}
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <button type="submit" className="w-full bg-[#0cab47] text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-lg">
          Register Teacher
        </button>
      </form>
    </Modal>
  );
}

// ============== SCHOOL MODAL ==============
export function SchoolModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    school_name: "",
    principal_name: "",
    school_address: "",
    official_email: "",
    contact_number: "",
    affiliation_id: "",
    website_url: "",
    established_year: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.school_name.trim()) newErrors.school_name = "School name is required";
    if (!formData.principal_name.trim()) newErrors.principal_name = "Principal name is required";
    if (!formData.school_address.trim()) newErrors.school_address = "School address is required";
    if (!formData.official_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.official_email = "Valid email required";
    if (!formData.contact_number.match(/^\d{10}$/)) newErrors.contact_number = "Valid 10-digit phone number required";
    if (!formData.affiliation_id.trim()) newErrors.affiliation_id = "Affiliation ID is required";
    if (formData.website_url && !formData.website_url.match(/^https?:\/\/.+/)) newErrors.website_url = "Valid URL required";
    if (!formData.established_year || parseInt(formData.established_year) < 1800) newErrors.established_year = "Valid year required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("School Registration Data:", formData);
      alert("School registered successfully!");
      setFormData({
        school_name: "",
        principal_name: "",
        school_address: "",
        official_email: "",
        contact_number: "",
        affiliation_id: "",
        website_url: "",
        established_year: "",
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="School Registration" icon={<FaSchool className="text-[#f4951d] text-xl" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="school_name"
            placeholder="School Name"
            value={formData.school_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.school_name && <p className="text-red-500 text-sm mt-1">{errors.school_name}</p>}
        </div>

        <div>
          <input
            type="text"
            name="principal_name"
            placeholder="Principal Name"
            value={formData.principal_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.principal_name && <p className="text-red-500 text-sm mt-1">{errors.principal_name}</p>}
        </div>

        <div>
          <input
            type="text"
            name="school_address"
            placeholder="School Address"
            value={formData.school_address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.school_address && <p className="text-red-500 text-sm mt-1">{errors.school_address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="email"
              name="official_email"
              placeholder="Official Email"
              value={formData.official_email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.official_email && <p className="text-red-500 text-sm mt-1">{errors.official_email}</p>}
          </div>
          <div>
            <input
              type="tel"
              name="contact_number"
              placeholder="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>}
          </div>
        </div>

        <div>
          <input
            type="text"
            name="affiliation_id"
            placeholder="Affiliation ID (CBSE/ICSE/State)"
            value={formData.affiliation_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
          />
          {errors.affiliation_id && <p className="text-red-500 text-sm mt-1">{errors.affiliation_id}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="url"
              name="website_url"
              placeholder="Website URL"
              value={formData.website_url}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.website_url && <p className="text-red-500 text-sm mt-1">{errors.website_url}</p>}
          </div>
          <div>
            <input
              type="number"
              name="established_year"
              placeholder="Established Year"
              value={formData.established_year}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.established_year && <p className="text-red-500 text-sm mt-1">{errors.established_year}</p>}
          </div>
        </div>

        <button type="submit" className="w-full bg-[#00468e] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition shadow-lg">
          Register School
        </button>
      </form>
    </Modal>
  );
}

// ============== PARENT REGISTRATION WIZARD MODAL ==============
export function ParentRegistrationWizardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, childIndex?: number) => {
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

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email is required";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Valid 10-digit phone is required";
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
      if (!formData.children[i].fullName.trim()) newErrors[`child${i}Name`] = "Child name is required";
      if (!formData.children[i].classGrade.trim()) newErrors[`child${i}Grade`] = "Class/Grade is required";
      if (!formData.children[i].admissionNumber.trim()) newErrors[`child${i}Admission`] = "Admission number is required";
      if (!formData.children[i].schoolName.trim()) newErrors[`child${i}School`] = "School name is required";
      if (!formData.children[i].schoolCity.trim()) newErrors[`child${i}City`] = "School city is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.feeAmount || parseFloat(formData.feeAmount) <= 0) newErrors.feeAmount = "Valid fee amount is required";
    if (!formData.feePeriod) newErrors.feePeriod = "Fee period is required";
    if (!formData.reasonForSupport) newErrors.reasonForSupport = "Reason for support is required";
    if (formData.reasonForSupport === "other" && !formData.otherReason.trim()) newErrors.otherReason = "Please specify other reason";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.repaymentDuration) newErrors.repaymentDuration = "Repayment duration is required";
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
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (agreed) {
      console.log("Parent Registration Complete:", formData);
      alert("Application submitted successfully!");
      onClose();
    } else {
      alert("Please agree to the terms before submitting");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Parent Registration - Financial Support" icon={<FaUserTie className="text-[#f4951d] text-xl" />}>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition ${
                  step < currentStep ? "bg-[#0cab47]" : step === currentStep ? "bg-[#00468e]" : "bg-gray-300"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              <p className="text-xs mt-2 text-center font-semibold">
                {step === 1 && "Parent Info"}
                {step === 2 && "Children"}
                {step === 3 && "Support"}
                {step === 4 && "Review"}
              </p>
              {step < 4 && <div className={`h-1 w-full ${step < currentStep ? "bg-[#0cab47]" : "bg-gray-300"} mt-2`}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: PARENT INFORMATION */}
      {currentStep === 1 && (
        <form className="space-y-4">
          <h3 className="font-bold text-lg text-[#00468e] mb-4">Step 1: Parent Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (10 digits)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <textarea
              name="address"
              placeholder="Residential Address"
              rows={2}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <select name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-white">
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>
        </form>
      )}

      {/* STEP 2: CHILDREN & SCHOOL DETAILS */}
      {currentStep === 2 && (
        <form className="space-y-4">
          <h3 className="font-bold text-lg text-[#00468e] mb-4">Step 2: Children & School Details</h3>

          <div>
            <label className="block text-sm font-semibold mb-2">Number of Children</label>
            <select
              name="numberOfChildren"
              value={formData.numberOfChildren}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, numberOfChildren: parseInt(e.target.value) }));
                setErrors({});
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-white"
            >
              <option value={0}>Select Number of Children</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.numberOfChildren && <p className="text-red-500 text-sm mt-1">{errors.numberOfChildren}</p>}
          </div>

          {Array.from({ length: formData.numberOfChildren }).map((_, index) => (
            <div key={index} className="pl-4 py-4 bg-gray-50 rounded">
              <h4 className="font-bold text-sm text-[#00468e] mb-3">Child {index + 1}</h4>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Child Full Name"
                    value={formData.children[index].fullName}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none text-sm"
                  />
                  {errors[`child${index}Name`] && <p className="text-red-500 text-xs mt-1">{errors[`child${index}Name`]}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      name="classGrade"
                      placeholder="Class/Grade"
                      value={formData.children[index].classGrade}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none text-sm"
                    />
                    {errors[`child${index}Grade`] && <p className="text-red-500 text-xs mt-1">{errors[`child${index}Grade`]}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="admissionNumber"
                      placeholder="Admission/Roll Number"
                      value={formData.children[index].admissionNumber}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none text-sm"
                    />
                    {errors[`child${index}Admission`] && <p className="text-red-500 text-xs mt-1">{errors[`child${index}Admission`]}</p>}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="schoolName"
                    placeholder="School Name"
                    value={formData.children[index].schoolName}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none text-sm"
                  />
                  {errors[`child${index}School`] && <p className="text-red-500 text-xs mt-1">{errors[`child${index}School`]}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    name="schoolCity"
                    placeholder="School City"
                    value={formData.children[index].schoolCity}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none text-sm"
                  />
                  {errors[`child${index}City`] && <p className="text-red-500 text-xs mt-1">{errors[`child${index}City`]}</p>}
                </div>
              </div>
            </div>
          ))}
        </form>
      )}

      {/* STEP 3: SUPPORT REQUEST */}
      {currentStep === 3 && (
        <form className="space-y-4">
          <h3 className="font-bold text-lg text-[#00468e] mb-4">Step 3: Support Request Details</h3>

          <div>
            <label className="block text-sm font-semibold mb-2">Total Fee Amount Required (₹)</label>
            <input
              type="number"
              name="feeAmount"
              placeholder="Enter amount in rupees"
              value={formData.feeAmount}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.feeAmount && <p className="text-red-500 text-sm mt-1">{errors.feeAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Fee Period</label>
            <select name="feePeriod" value={formData.feePeriod} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-white">
              <option value="">Select Fee Period</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="halfYearly">Half Yearly</option>
              <option value="annual">Annual</option>
            </select>
            {errors.feePeriod && <p className="text-red-500 text-sm mt-1">{errors.feePeriod}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Reason for Support</label>
            <select name="reasonForSupport" value={formData.reasonForSupport} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-white">
              <option value="">Select Reason</option>
              <option value="jobLoss">Job Loss / Unemployment</option>
              <option value="medical">Medical Emergency</option>
              <option value="businessLoan">Business Loan</option>
              <option value="familyEmergency">Family Emergency</option>
              <option value="cashflow">Temporary Cash Flow Issue</option>
              <option value="other">Other</option>
            </select>
            {errors.reasonForSupport && <p className="text-red-500 text-sm mt-1">{errors.reasonForSupport}</p>}
          </div>

          {formData.reasonForSupport === "other" && (
            <div>
              <input
                type="text"
                name="otherReason"
                placeholder="Please specify other reason"
                value={formData.otherReason}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
              />
              {errors.otherReason && <p className="text-red-500 text-sm mt-1">{errors.otherReason}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Brief Description of Your Situation</label>
            <textarea
              name="description"
              placeholder="Describe your situation in detail..."
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Preferred Repayment Duration (months)</label>
            <select name="repaymentDuration" value={formData.repaymentDuration} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00468e] outline-none bg-white">
              <option value="">Select Duration</option>
              {Array.from({ length: 12 }, (_, i) => (i + 1) * 3).map((months) => (
                <option key={months} value={months}>
                  {months} months
                </option>
              ))}
            </select>
            {errors.repaymentDuration && <p className="text-red-500 text-sm mt-1">{errors.repaymentDuration}</p>}
          </div>
        </form>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-[#00468e] mb-4">Step 4: Review & Submit Application</h3>

          {/* Parent Information Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-[#00468e] mb-3">Parent Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="font-semibold">Name:</span> {formData.firstName} {formData.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {formData.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {formData.phone}
              </p>
              <p>
                <span className="font-semibold">City:</span> {formData.city}
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold">Address:</span> {formData.address}
              </p>
              <p>
                <span className="font-semibold">State:</span> {formData.state}
              </p>
            </div>
          </div>

          {/* Children Information Summary */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-bold text-[#0cab47] mb-3">Children & School Details</h4>
            {Array.from({ length: formData.numberOfChildren }).map((_, index) => (
              <div key={index} className="mb-3 pb-3 border-b last:border-b-0">
                <p className="font-semibold text-sm">Child {index + 1}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span> {formData.children[index].fullName}
                  </p>
                  <p>
                    <span className="font-semibold">Class:</span> {formData.children[index].classGrade}
                  </p>
                  <p>
                    <span className="font-semibold">Admission No:</span> {formData.children[index].admissionNumber}
                  </p>
                  <p>
                    <span className="font-semibold">School:</span> {formData.children[index].schoolName}
                  </p>
                  <p className="md:col-span-2">
                    <span className="font-semibold">School City:</span> {formData.children[index].schoolCity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Support Request Summary */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-bold text-[#f4951d] mb-3">Support Request Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="font-semibold">Fee Amount:</span> ₹{formData.feeAmount}
              </p>
              <p>
                <span className="font-semibold">Fee Period:</span> {formData.feePeriod}
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold">Reason for Support:</span> {formData.reasonForSupport === "other" ? formData.otherReason : formData.reasonForSupport}
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold">Description:</span> {formData.description}
              </p>
              <p>
                <span className="font-semibold">Repayment Duration:</span> {formData.repaymentDuration} months
              </p>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-[#00468e]" />
              <span className="text-sm">
                I confirm that all information provided is accurate to the best of my knowledge. I understand that Schoolfee will verify this information with the school and other relevant parties.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-3 mt-6">
        <button
          onClick={handlePrevious}
          className={`px-6 py-3 rounded-lg font-bold transition ${currentStep === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-gray-400 text-white hover:bg-gray-500"}`}
          disabled={currentStep === 1}
        >
          Previous
        </button>

        {currentStep < 4 ? (
          <button onClick={handleNext} className="px-6 py-3 bg-[#00468e] text-white rounded-lg font-bold hover:bg-blue-900 transition">
            Continue
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={!agreed} className={`px-6 py-3 rounded-lg font-bold transition ${agreed ? "bg-[#0cab47] text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}>
            Submit Application
          </button>
        )}
      </div>
    </Modal>
  );
}
