"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  IoSearch,
  IoFilter,
  IoChevronDown,
  IoClose,
  IoAdd,
  IoDownload,
  IoLink,
  IoPersonAdd,
  IoHelpCircle,
  IoBusiness,
  IoCheckmarkCircle,
  IoTrash,
  IoPencil,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Types
interface PaymentDetail {
  id: string;
  bankingFormat: string;
  accountNumber: string;
  ifsc: string;
}

interface DocumentSetting {
  name: string;
  description?: string;
  required: boolean;
}

interface Vendor {
  id: string;
  displayName: string;
  email: string;
  mobile: string;
  vendorOwner: string;
  locality: string;
  gstin: string;
  tdsSection: string;
  paymentTerms: string;
  expenseHead: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  state: string;
  status:
    | "Invited"
    | "Requested Update"
    | "Approval Pending"
    | "Active"
    | "Declined"
    | "Disabled";
  type: "invite" | "manual";
  createdAt: string;
  externalFormTitle?: string;
  externalFormLink?: string;
  collectGstin?: boolean;
  collectBankDetails?: boolean;
  paymentDetails?: PaymentDetail[];
  documentSettings?: DocumentSetting[];
}

// Dummy data for dropdowns
const vendorOwners = [
  "John Smith",
  "Sarah Johnson",
  "Mike Williams",
  "Emily Davis",
  "Robert Brown",
];

const localities = [
  "Domestic (India)",
  "International (USA)",
  "International (UK)",
  "International (UAE)",
  "International (Singapore)",
];

const tdsSections = [
  "194A - Interest other than on Securities",
  "194C - Contractor",
  "194H - Commission or Brokerage",
  "194I - Rent",
  "194J - Professional/Technical Services",
  "194Q - Purchase of Goods",
];

const paymentTermsOptions = [
  "Net 7",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due on Receipt",
];

const expenseHeads = [
  "Office Supplies",
  "IT Services",
  "Marketing",
  "Travel",
  "Utilities",
  "Professional Services",
  "Raw Materials",
  "Maintenance",
];

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const bankingFormats = ["IFSC", "SWIFT", "IBAN", "Routing Number"];

const statusOptions = [
  "Invited",
  "Requested Update",
  "Approval Pending",
  "Active",
  "Declined",
  "Disabled",
] as const;

const defaultDocumentSettings: DocumentSetting[] = [
  { name: "MSME Certificate", description: "Does not apply to Non-MSME vendor", required: false },
  { name: "GST Certificate", required: true },
  { name: "PAN", required: true },
  { name: "Cancelled Cheque", required: true },
  { name: "CIN Certificate", description: "Does not apply to Non CIN / Non LLPIN business.", required: false },
  { name: "Aadhaar Card", required: false },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Sheet states
  const [isInviteSheetOpen, setIsInviteSheetOpen] = useState(false);
  const [isManualSheetOpen, setIsManualSheetOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Payment dialog state
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    bankingFormat: "IFSC",
    accountNumber: "",
    ifsc: "",
  });

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    locality: "",
    displayName: "",
    email: "",
    mobile: "",
    vendorOwner: "",
    expenseHead: "",
    externalFormTitle: "",
    externalFormLink: "",
    collectGstin: true,
    collectBankDetails: true,
    documentSettings: [...defaultDocumentSettings],
  });

  // Manual form state
  const [manualForm, setManualForm] = useState({
    locality: "",
    displayName: "",
    email: "",
    mobile: "",
    vendorOwner: "",
    gstin: "",
    tdsSection: "",
    paymentTerms: "",
    expenseHead: "",
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    state: "",
    paymentDetails: [] as PaymentDetail[],
  });

  // Load vendors from localStorage on mount
  useEffect(() => {
    const savedVendors = localStorage.getItem("vendors");
    if (savedVendors) {
      setVendors(JSON.parse(savedVendors));
    }
  }, []);

  // Save vendors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        searchQuery === "" ||
        vendor.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.vendorOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.gstin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(vendor.status);

      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchQuery, selectedStatuses]);

  // Handle status filter toggle
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Handle select all statuses
  const toggleSelectAll = () => {
    if (selectedStatuses.length === statusOptions.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses([...statusOptions]);
    }
  };

  // Clear status filters
  const clearStatusFilters = () => {
    setSelectedStatuses([]);
  };

  // Handle invite vendor
  const handleInviteVendor = () => {
    if (!inviteForm.email || !inviteForm.vendorOwner) {
      alert("Please fill in required fields: Email and Vendor Owner");
      return;
    }

    if (editingVendor) {
      // Update existing vendor
      setVendors((prev) =>
        prev.map((v) =>
          v.id === editingVendor.id
            ? {
                ...v,
                displayName: inviteForm.displayName,
                email: inviteForm.email,
                mobile: inviteForm.mobile,
                vendorOwner: inviteForm.vendorOwner,
                locality: inviteForm.locality,
                expenseHead: inviteForm.expenseHead,
                externalFormTitle: inviteForm.externalFormTitle,
                externalFormLink: inviteForm.externalFormLink,
                collectGstin: inviteForm.collectGstin,
                collectBankDetails: inviteForm.collectBankDetails,
                documentSettings: inviteForm.documentSettings,
              }
            : v
        )
      );
    } else {
      // Create new vendor
      const newVendor: Vendor = {
        id: Date.now().toString(),
        displayName: inviteForm.displayName,
        email: inviteForm.email,
        mobile: inviteForm.mobile,
        vendorOwner: inviteForm.vendorOwner,
        locality: inviteForm.locality,
        gstin: "",
        tdsSection: "",
        paymentTerms: "",
        expenseHead: inviteForm.expenseHead,
        addressLine1: "",
        addressLine2: "",
        zipCode: "",
        state: "",
        status: "Invited",
        type: "invite",
        createdAt: new Date().toISOString(),
        externalFormTitle: inviteForm.externalFormTitle,
        externalFormLink: inviteForm.externalFormLink,
        collectGstin: inviteForm.collectGstin,
        collectBankDetails: inviteForm.collectBankDetails,
        documentSettings: inviteForm.documentSettings,
      };
      setVendors((prev) => [...prev, newVendor]);
    }

    setIsInviteSheetOpen(false);
    setEditingVendor(null);
    resetInviteForm();
  };

  // Handle save manual vendor
  const handleSaveManualVendor = () => {
    if (!manualForm.displayName || !manualForm.vendorOwner) {
      alert("Please fill in required fields: Display Name and Vendor Owner");
      return;
    }

    if (editingVendor) {
      // Update existing vendor
      setVendors((prev) =>
        prev.map((v) =>
          v.id === editingVendor.id
            ? {
                ...v,
                displayName: manualForm.displayName,
                email: manualForm.email,
                mobile: manualForm.mobile,
                vendorOwner: manualForm.vendorOwner,
                locality: manualForm.locality,
                gstin: manualForm.gstin,
                tdsSection: manualForm.tdsSection,
                paymentTerms: manualForm.paymentTerms,
                expenseHead: manualForm.expenseHead,
                addressLine1: manualForm.addressLine1,
                addressLine2: manualForm.addressLine2,
                zipCode: manualForm.zipCode,
                state: manualForm.state,
                paymentDetails: manualForm.paymentDetails,
              }
            : v
        )
      );
    } else {
      // Create new vendor
      const newVendor: Vendor = {
        id: Date.now().toString(),
        displayName: manualForm.displayName,
        email: manualForm.email,
        mobile: manualForm.mobile,
        vendorOwner: manualForm.vendorOwner,
        locality: manualForm.locality,
        gstin: manualForm.gstin,
        tdsSection: manualForm.tdsSection,
        paymentTerms: manualForm.paymentTerms,
        expenseHead: manualForm.expenseHead,
        addressLine1: manualForm.addressLine1,
        addressLine2: manualForm.addressLine2,
        zipCode: manualForm.zipCode,
        state: manualForm.state,
        status: "Active",
        type: "manual",
        createdAt: new Date().toISOString(),
        paymentDetails: manualForm.paymentDetails,
      };
      setVendors((prev) => [...prev, newVendor]);
    }

    setIsManualSheetOpen(false);
    setEditingVendor(null);
    resetManualForm();
  };

  // Handle edit vendor
  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    if (vendor.type === "invite") {
      setInviteForm({
        locality: vendor.locality,
        displayName: vendor.displayName,
        email: vendor.email,
        mobile: vendor.mobile,
        vendorOwner: vendor.vendorOwner,
        expenseHead: vendor.expenseHead,
        externalFormTitle: vendor.externalFormTitle || "",
        externalFormLink: vendor.externalFormLink || "",
        collectGstin: vendor.collectGstin ?? true,
        collectBankDetails: vendor.collectBankDetails ?? true,
        documentSettings: vendor.documentSettings || [...defaultDocumentSettings],
      });
      setIsInviteSheetOpen(true);
    } else {
      setManualForm({
        locality: vendor.locality,
        displayName: vendor.displayName,
        email: vendor.email,
        mobile: vendor.mobile,
        vendorOwner: vendor.vendorOwner,
        gstin: vendor.gstin,
        tdsSection: vendor.tdsSection,
        paymentTerms: vendor.paymentTerms,
        expenseHead: vendor.expenseHead,
        addressLine1: vendor.addressLine1,
        addressLine2: vendor.addressLine2,
        zipCode: vendor.zipCode,
        state: vendor.state,
        paymentDetails: vendor.paymentDetails || [],
      });
      setIsManualSheetOpen(true);
    }
  };

  // Handle delete vendor
  const handleDeleteVendor = (vendorId: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
    }
  };

  // Handle add payment details
  const handleAddPaymentDetail = () => {
    if (!paymentForm.accountNumber || !paymentForm.ifsc) {
      alert("Please fill in Account Number and IFSC");
      return;
    }

    const newPayment: PaymentDetail = {
      id: Date.now().toString(),
      bankingFormat: paymentForm.bankingFormat,
      accountNumber: paymentForm.accountNumber,
      ifsc: paymentForm.ifsc,
    };

    if (editingPaymentIndex !== null) {
      // Update existing payment
      const updatedPayments = [...manualForm.paymentDetails];
      updatedPayments[editingPaymentIndex] = newPayment;
      setManualForm({ ...manualForm, paymentDetails: updatedPayments });
    } else {
      // Add new payment
      setManualForm({
        ...manualForm,
        paymentDetails: [...manualForm.paymentDetails, newPayment],
      });
    }

    setIsPaymentDialogOpen(false);
    setEditingPaymentIndex(null);
    setPaymentForm({ bankingFormat: "IFSC", accountNumber: "", ifsc: "" });
  };

  // Handle edit payment detail
  const handleEditPaymentDetail = (index: number) => {
    const payment = manualForm.paymentDetails[index];
    setPaymentForm({
      bankingFormat: payment.bankingFormat,
      accountNumber: payment.accountNumber,
      ifsc: payment.ifsc,
    });
    setEditingPaymentIndex(index);
    setIsPaymentDialogOpen(true);
  };

  // Handle delete payment detail
  const handleDeletePaymentDetail = (index: number) => {
    setManualForm({
      ...manualForm,
      paymentDetails: manualForm.paymentDetails.filter((_, i) => i !== index),
    });
  };

  // Handle document toggle
  const handleDocumentToggle = (index: number, required: boolean) => {
    const updatedSettings = [...inviteForm.documentSettings];
    updatedSettings[index] = { ...updatedSettings[index], required };
    setInviteForm({ ...inviteForm, documentSettings: updatedSettings });
  };

  // Reset forms
  const resetInviteForm = () => {
    setInviteForm({
      locality: "",
      displayName: "",
      email: "",
      mobile: "",
      vendorOwner: "",
      expenseHead: "",
      externalFormTitle: "",
      externalFormLink: "",
      collectGstin: true,
      collectBankDetails: true,
      documentSettings: [...defaultDocumentSettings],
    });
  };

  const resetManualForm = () => {
    setManualForm({
      locality: "",
      displayName: "",
      email: "",
      mobile: "",
      vendorOwner: "",
      gstin: "",
      tdsSection: "",
      paymentTerms: "",
      expenseHead: "",
      addressLine1: "",
      addressLine2: "",
      zipCode: "",
      state: "",
      paymentDetails: [],
    });
  };

  // Export vendors
  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Mobile", "Owner", "GSTIN", "Status", "Type"].join(","),
      ...vendors.map((v) =>
        [v.displayName, v.email, v.mobile, v.vendorOwner, v.gstin, v.status, v.type].join(
          ","
        )
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendors.csv";
    a.click();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Invited":
        return "bg-blue-100 text-blue-700";
      case "Approval Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Requested Update":
        return "bg-orange-100 text-orange-700";
      case "Declined":
        return "bg-red-100 text-red-700";
      case "Disabled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2 bg-transparent border-gray-300"
          >
            <IoDownload size={18} />
            <span className="hidden sm:inline">Export All</span>
            <span>({vendors.length})</span>
          </Button>

          <DropdownMenu open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#00875A] hover:bg-[#006B47] text-white flex items-center gap-2">
                <IoAdd size={20} />
                <span>Add Vendors</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  setEditingVendor(null);
                  resetInviteForm();
                  setIsInviteSheetOpen(true);
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center gap-3 py-3 cursor-pointer"
              >
                <IoLink size={18} className="text-gray-600" />
                <div>
                  <p className="font-medium">Invite Link</p>
                  <p className="text-xs text-gray-500">Send invitation to vendor</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditingVendor(null);
                  resetManualForm();
                  setIsManualSheetOpen(true);
                  setIsAddMenuOpen(false);
                }}
                className="flex items-center gap-3 py-3 cursor-pointer"
              >
                <IoPersonAdd size={18} className="text-gray-600" />
                <div>
                  <p className="font-medium">Add Manually</p>
                  <p className="text-xs text-gray-500">Create vendor manually</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <button
          type="button"
          className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <IoFilter size={20} className="text-gray-600" />
        </button>

        <div className="relative flex-1 max-w-xl">
          <IoSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search By Vendor Name, Vendor Owner, GSTIN or PAN"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-300"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStatusFilter(!showStatusFilter)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors",
              showStatusFilter || selectedStatuses.length > 0
                ? "border-gray-400 bg-gray-50"
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            <span className="text-sm font-medium text-gray-700">Status</span>
            {selectedStatuses.length > 0 && (
              <span className="bg-[#00468E] text-white text-xs px-1.5 py-0.5 rounded">
                {selectedStatuses.length}
              </span>
            )}
            <IoChevronDown
              size={16}
              className={cn(
                "text-gray-500 transition-transform",
                showStatusFilter && "rotate-180"
              )}
            />
          </button>

          {showStatusFilter && (
            <div className="absolute z-20 mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Status</span>
                  <IoFilter size={14} className="text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={clearStatusFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <IoClose size={14} />
                  Clear
                </button>
              </div>
              <div className="p-2">
                <label className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Checkbox
                    checked={selectedStatuses.length === statusOptions.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm font-medium">Select All</span>
                </label>
                {statusOptions.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-40 h-40 mx-auto mb-6">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <ellipse cx="100" cy="180" rx="60" ry="10" fill="#E5E7EB" />
                <rect x="70" y="100" width="25" height="70" rx="4" fill="#374151" />
                <circle cx="82" cy="85" r="15" fill="#D1D5DB" />
                <rect x="74" y="130" width="16" height="25" fill="#F3F4F6" />
                <rect x="105" y="95" width="25" height="75" rx="4" fill="#10B981" />
                <circle cx="117" cy="80" r="15" fill="#6B7280" />
                <rect x="130" y="115" width="15" height="8" fill="#374151" />
                <rect x="122" y="145" width="12" height="15" rx="2" fill="#374151" />
                <circle cx="100" cy="130" r="8" fill="#10B981" opacity="0.3" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Vendors Yet</h2>
            <p className="text-gray-500 text-sm">
              Vendors will appear automatically when you begin spending.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Vendor Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Mobile</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Owner</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">GSTIN</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{vendor.displayName}</TableCell>
                  <TableCell className="text-gray-600">{vendor.email}</TableCell>
                  <TableCell className="text-gray-600 hidden md:table-cell">
                    {vendor.mobile || "-"}
                  </TableCell>
                  <TableCell className="text-gray-600 hidden lg:table-cell">
                    {vendor.vendorOwner}
                  </TableCell>
                  <TableCell className="text-gray-600 hidden lg:table-cell">
                    {vendor.gstin || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        getStatusColor(vendor.status)
                      )}
                    >
                      {vendor.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditVendor(vendor)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <IoPencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <IoTrash size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 text-sm text-gray-600">
        <span>Total Outstanding: ₹0.00</span>
        <span className="hidden sm:inline">•</span>
        <span>
          Showing 1 - {filteredVendors.length} of {vendors.length}
        </span>
      </div>

      {/* Invite Vendor Sheet */}
      <Sheet open={isInviteSheetOpen} onOpenChange={setIsInviteSheetOpen}>
        <SheetContent className="w-full sm:max-w-[420px] overflow-y-auto p-0">
          <SheetHeader className="px-6 py-5 border-b border-gray-200">
            <SheetTitle className="text-lg font-semibold">Invite Vendor</SheetTitle>
            <SheetDescription className="text-sm text-gray-500 mt-1">
              {"We'll email your vendor a secure form where they can enter their payment details."}
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-6 space-y-8">
            {/* Choose Vendor Locality */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Choose Vendor Locality
              </h3>
              <div>
                <label className="text-xs text-red-500 mb-1.5 block">
                  Select Vendor Locality *
                </label>
                <Select
                  value={inviteForm.locality}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, locality: value })}
                >
                  <SelectTrigger className="w-full h-11 border-gray-300">
                    <SelectValue placeholder="Select locality" />
                  </SelectTrigger>
                  <SelectContent>
                    {localities.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vendor Details */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Vendor Details</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Vendor Display Name"
                  value={inviteForm.displayName}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, displayName: e.target.value })
                  }
                  className="h-11 border-gray-300"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-red-500 mb-1.5 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="h-11 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Mobile Number</label>
                    <div className="flex">
                      <div className="flex items-center gap-1 px-2.5 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-sm">
                        <span className="text-base">IN</span>
                        <span className="text-gray-600">+91</span>
                      </div>
                      <Input
                        placeholder="Mobile Number"
                        value={inviteForm.mobile}
                        onChange={(e) =>
                          setInviteForm({ ...inviteForm, mobile: e.target.value })
                        }
                        className="h-11 rounded-l-none border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1.5 flex items-center gap-1">
                    <span className="text-red-500">Vendor Owner *</span>
                    <IoHelpCircle size={14} className="text-gray-400" />
                  </label>
                  <Select
                    value={inviteForm.vendorOwner}
                    onValueChange={(value) =>
                      setInviteForm({ ...inviteForm, vendorOwner: value })
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-gray-300">
                      <SelectValue placeholder="Select vendor owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorOwners.map((owner) => (
                        <SelectItem key={owner} value={owner}>
                          {owner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={inviteForm.expenseHead}
                  onValueChange={(value) =>
                    setInviteForm({ ...inviteForm, expenseHead: value })
                  }
                >
                  <SelectTrigger className="w-full h-11 border-gray-300">
                    <SelectValue placeholder="Expense Head" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseHeads.map((head) => (
                      <SelectItem key={head} value={head}>
                        {head}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add External Form */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Add External Form</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Title"
                  value={inviteForm.externalFormTitle}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, externalFormTitle: e.target.value })
                  }
                  className="h-11 border-gray-300"
                />
                <Input
                  placeholder="Link"
                  value={inviteForm.externalFormLink}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, externalFormLink: e.target.value })
                  }
                  className="h-11 border-gray-300"
                />
              </div>
            </div>

            {/* Details to be collected */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Details to be collected from the vendor
              </h3>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-0.5">GSTIN/PAN</p>
                  <p className="text-sm text-gray-700">Will be collected from the Vendor</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-0.5">Bank Details</p>
                  <p className="text-sm text-gray-700">Will be collected from the Vendor</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Documents</h3>
              <p className="text-sm text-gray-500 mb-4">
                All document options will be sent to the vendor. Just select the mandatory and
                optional fields as needed.
              </p>
              <div className="space-y-4">
                {inviteForm.documentSettings.map((doc, index) => (
                  <div key={doc.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      {doc.description && (
                        <p className="text-xs text-gray-500">{doc.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          doc.required ? "text-green-600" : "text-gray-500"
                        )}
                      >
                        {doc.required ? "Required" : "Optional"}
                      </span>
                      <Switch
                        checked={doc.required}
                        onCheckedChange={(checked) => handleDocumentToggle(index, checked)}
                        className={cn(
                          doc.required
                            ? "data-[state=checked]:bg-green-500"
                            : "data-[state=unchecked]:bg-gray-300"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white sticky bottom-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsInviteSheetOpen(false);
                setEditingVendor(null);
                resetInviteForm();
              }}
              className="bg-transparent border-gray-300"
            >
              Cancel
            </Button>
            <Button onClick={handleInviteVendor} className="bg-[#00468E] hover:bg-[#003870]">
              {editingVendor ? "Update Vendor" : "Invite Vendor"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Manual Vendor Sheet */}
      <Sheet open={isManualSheetOpen} onOpenChange={setIsManualSheetOpen}>
        <SheetContent className="w-full sm:max-w-[420px] overflow-y-auto p-0">
          <SheetHeader className="px-6 py-5 border-b border-gray-200">
            <SheetTitle className="text-lg font-semibold">
              {editingVendor ? "Edit Vendor" : "Create New Vendor"}
            </SheetTitle>
          </SheetHeader>

          <div className="px-6 py-6 space-y-8">
            {/* Choose Vendor Locality */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Choose Vendor Locality
              </h3>
              <div>
                <label className="text-xs text-red-500 mb-1.5 block">
                  Select Vendor Locality *
                </label>
                <Select
                  value={manualForm.locality}
                  onValueChange={(value) => setManualForm({ ...manualForm, locality: value })}
                >
                  <SelectTrigger className="w-full h-11 border-gray-300">
                    <SelectValue placeholder="Domestic (India)" />
                  </SelectTrigger>
                  <SelectContent>
                    {localities.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vendor Details */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Vendor Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-red-500 mb-1.5 block">
                    Vendor Display Name *
                  </label>
                  <Input
                    placeholder="Vendor Display Name"
                    value={manualForm.displayName}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, displayName: e.target.value })
                    }
                    className="h-11 border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={manualForm.email}
                      onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                      className="h-11 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Mobile Number</label>
                    <div className="flex">
                      <div className="flex items-center gap-1 px-2.5 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-sm">
                        <span className="text-base">IN</span>
                        <span className="text-gray-600">+91</span>
                      </div>
                      <Input
                        placeholder="Mobile Number"
                        value={manualForm.mobile}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, mobile: e.target.value })
                        }
                        className="h-11 rounded-l-none border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1.5 flex items-center gap-1">
                    <span className="text-red-500">Vendor Owner *</span>
                    <IoHelpCircle size={14} className="text-gray-400" />
                  </label>
                  <Select
                    value={manualForm.vendorOwner}
                    onValueChange={(value) =>
                      setManualForm({ ...manualForm, vendorOwner: value })
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-gray-300">
                      <SelectValue placeholder="Select vendor owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorOwners.map((owner) => (
                        <SelectItem key={owner} value={owner}>
                          {owner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Taxation Details */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Taxation Details
                <IoCheckmarkCircle size={16} className="text-gray-400" />
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="GSTIN / PAN"
                    value={manualForm.gstin}
                    onChange={(e) => setManualForm({ ...manualForm, gstin: e.target.value })}
                    className="flex-1 h-11 border-gray-300"
                  />
                  <Button
                    variant="outline"
                    className="h-11 px-6 border-gray-300 bg-transparent"
                  >
                    Verify
                  </Button>
                </div>
                <Select
                  value={manualForm.tdsSection}
                  onValueChange={(value) =>
                    setManualForm({ ...manualForm, tdsSection: value })
                  }
                >
                  <SelectTrigger className="w-full h-11 border-red-300 focus:border-red-500">
                    <SelectValue placeholder="Select TDS Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {tdsSections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Payment Details
                <IoCheckmarkCircle size={16} className="text-gray-400" />
              </h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPaymentIndex(null);
                    setPaymentForm({ bankingFormat: "IFSC", accountNumber: "", ifsc: "" });
                    setIsPaymentDialogOpen(true);
                  }}
                  className="w-full h-11 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <IoBusiness size={18} />
                  <span>Add Payment Details</span>
                </button>

                {/* Display added payment details */}
                {manualForm.paymentDetails.length > 0 && (
                  <div className="space-y-3">
                    {manualForm.paymentDetails.map((payment, index) => (
                      <div
                        key={payment.id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50/50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {payment.bankingFormat}: {payment.ifsc}
                            </p>
                            <p className="text-sm text-gray-600">
                              A/C: ****{payment.accountNumber.slice(-4)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditPaymentDetail(index)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <IoPencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePaymentDetail(index)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <IoTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Select
                  value={manualForm.paymentTerms}
                  onValueChange={(value) =>
                    setManualForm({ ...manualForm, paymentTerms: value })
                  }
                >
                  <SelectTrigger className="w-full h-11 border-gray-300">
                    <SelectValue placeholder="Payment Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsOptions.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Accounting Policy */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Accounting Policy</h3>
              <Select
                value={manualForm.expenseHead}
                onValueChange={(value) => setManualForm({ ...manualForm, expenseHead: value })}
              >
                <SelectTrigger className="w-full h-11 border-gray-300">
                  <SelectValue placeholder="Expense Head" />
                </SelectTrigger>
                <SelectContent>
                  {expenseHeads.map((head) => (
                    <SelectItem key={head} value={head}>
                      {head}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Address</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Address Line"
                  value={manualForm.addressLine1}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, addressLine1: e.target.value })
                  }
                  className="h-11 border-gray-300"
                />
                <Input
                  placeholder="Address Line 2(Optional)"
                  value={manualForm.addressLine2}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, addressLine2: e.target.value })
                  }
                  className="h-11 border-gray-300"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Zip Code"
                    value={manualForm.zipCode}
                    onChange={(e) => setManualForm({ ...manualForm, zipCode: e.target.value })}
                    className="h-11 border-gray-300"
                  />
                  <Select
                    value={manualForm.state}
                    onValueChange={(value) => setManualForm({ ...manualForm, state: value })}
                  >
                    <SelectTrigger className="w-full h-11 border-gray-300">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white sticky bottom-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsManualSheetOpen(false);
                setEditingVendor(null);
                resetManualForm();
              }}
              className="bg-transparent border-gray-300"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveManualVendor} className="bg-[#00468E] hover:bg-[#003870]">
              {editingVendor ? "Update Changes" : "Save Changes"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Payment Details Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <IoBusiness size={24} className="text-gray-700" />
              </div>
              <div>
                <DialogTitle className="text-lg">Add Payment Details</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Please enter bank details
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Banking Format</label>
              <Select
                value={paymentForm.bankingFormat}
                onValueChange={(value) =>
                  setPaymentForm({ ...paymentForm, bankingFormat: value })
                }
              >
                <SelectTrigger className="w-full h-11 border-gray-300">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {bankingFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Account Number</label>
                <Input
                  placeholder="Account Number"
                  value={paymentForm.accountNumber}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, accountNumber: e.target.value })
                  }
                  className="h-11 border-gray-300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">IFSC</label>
                <Input
                  placeholder="IFSC"
                  value={paymentForm.ifsc}
                  onChange={(e) => setPaymentForm({ ...paymentForm, ifsc: e.target.value })}
                  className="h-11 border-gray-300"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsPaymentDialogOpen(false);
                setEditingPaymentIndex(null);
                setPaymentForm({ bankingFormat: "IFSC", accountNumber: "", ifsc: "" });
              }}
              className="flex-1 h-11 bg-transparent border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPaymentDetail}
              className="flex-1 h-11 bg-[#00468E] hover:bg-[#003870]"
            >
              {editingPaymentIndex !== null ? "Update Details" : "Verify Bank Details"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Click outside to close status filter */}
      {showStatusFilter && (
        <div className="fixed inset-0 z-10" onClick={() => setShowStatusFilter(false)} />
      )}
    </div>
  );
}
