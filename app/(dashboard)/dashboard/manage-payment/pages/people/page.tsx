"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    HiOutlineSearch,
    HiOutlineDownload,
    HiOutlinePlus,
    HiOutlineChevronDown,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlinePencil,
    HiOutlineX,
} from "react-icons/hi";
import { BsBank, BsBuilding } from "react-icons/bs";

interface Person {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    location: string;
    costCentre: string;
    manager: string;
    managerEmail: string;
    mobileNumber: string;
    skipManager1: string;
    employeeGrade: string;
    employeeId: string;
    paymentDetails: PaymentDetail[];
}

interface PaymentDetail {
    id: string;
    bankingFormat: string;
    accountNumber: string;
    ifsc: string;
}

const defaultPerson: Person = {
    id: "1",
    name: "Vishwnet India Private Limited",
    email: "vishwnet.schoolfee",
    role: "Admin",
    department: "",
    location: "",
    costCentre: "",
    manager: "Vishwnet India Private Limited",
    managerEmail: "vishwnet.schoolfee",
    mobileNumber: "8802025257",
    skipManager1: "",
    employeeGrade: "",
    employeeId: "",
    paymentDetails: [],
};

export default function PeoplePage() {
    const [activeTab, setActiveTab] = useState<"members" | "pending">("members");
    const [searchQuery, setSearchQuery] = useState("");
    const [people, setPeople] = useState<Person[]>([defaultPerson]);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
    const [isInviteTeamOpen, setIsInviteTeamOpen] = useState(false);
    const [isAddMemberFormOpen, setIsAddMemberFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);

    // Form states for editing
    const [editForm, setEditForm] = useState<Partial<Person>>({});
    const [paymentForm, setPaymentForm] = useState<PaymentDetail>({
        id: "",
        bankingFormat: "IFSC",
        accountNumber: "",
        ifsc: "",
    });

    // New member form
    const [newMemberForm, setNewMemberForm] = useState({
        name: "",
        email: "",
        role: "Member",
        department: "",
        location: "",
        costCentre: "",
        manager: "",
        mobileNumber: "",
    });

    useEffect(() => {
        const savedPeople = localStorage.getItem("people");
        if (savedPeople) {
            setPeople(JSON.parse(savedPeople));
        }
    }, []);

    const savePeople = (updatedPeople: Person[]) => {
        setPeople(updatedPeople);
        localStorage.setItem("people", JSON.stringify(updatedPeople));
    };

    const handlePersonClick = (person: Person) => {
        setSelectedPerson(person);
        setEditForm(person);
        setIsDetailSheetOpen(true);
        setIsEditing(false);
    };

    const handleSaveEdit = () => {
        if (selectedPerson && editForm) {
            const updatedPeople = people.map((p) =>
                p.id === selectedPerson.id ? { ...p, ...editForm } : p
            );
            savePeople(updatedPeople);
            setSelectedPerson({ ...selectedPerson, ...editForm } as Person);
            setIsEditing(false);
        }
    };

    const handleAddPaymentDetail = () => {
        if (selectedPerson) {
            const newPayment: PaymentDetail = {
                ...paymentForm,
                id: Date.now().toString(),
            };

            let updatedPaymentDetails: PaymentDetail[];
            if (editingPaymentIndex !== null) {
                updatedPaymentDetails = [...selectedPerson.paymentDetails];
                updatedPaymentDetails[editingPaymentIndex] = newPayment;
            } else {
                updatedPaymentDetails = [...selectedPerson.paymentDetails, newPayment];
            }

            const updatedPerson = {
                ...selectedPerson,
                paymentDetails: updatedPaymentDetails,
            };

            const updatedPeople = people.map((p) =>
                p.id === selectedPerson.id ? updatedPerson : p
            );
            savePeople(updatedPeople);
            setSelectedPerson(updatedPerson);
            setIsPaymentDialogOpen(false);
            setPaymentForm({ id: "", bankingFormat: "IFSC", accountNumber: "", ifsc: "" });
            setEditingPaymentIndex(null);
        }
    };

    const handleEditPayment = (index: number) => {
        if (selectedPerson) {
            setPaymentForm(selectedPerson.paymentDetails[index]);
            setEditingPaymentIndex(index);
            setIsPaymentDialogOpen(true);
        }
    };

    const handleDeletePayment = (index: number) => {
        if (selectedPerson) {
            const updatedPaymentDetails = selectedPerson.paymentDetails.filter(
                (_, i) => i !== index
            );
            const updatedPerson = {
                ...selectedPerson,
                paymentDetails: updatedPaymentDetails,
            };
            const updatedPeople = people.map((p) =>
                p.id === selectedPerson.id ? updatedPerson : p
            );
            savePeople(updatedPeople);
            setSelectedPerson(updatedPerson);
        }
    };

    const handleAddMember = () => {
        const newPerson: Person = {
            id: Date.now().toString(),
            name: newMemberForm.name,
            email: newMemberForm.email,
            role: newMemberForm.role,
            department: newMemberForm.department,
            location: newMemberForm.location,
            costCentre: newMemberForm.costCentre,
            manager: newMemberForm.manager || "Vishwnet India Private Limited",
            managerEmail: "vishwnet.schoolfee",
            mobileNumber: newMemberForm.mobileNumber,
            skipManager1: "",
            employeeGrade: "",
            employeeId: "",
            paymentDetails: [],
        };
        savePeople([...people, newPerson]);
        setIsAddMemberFormOpen(false);
        setIsInviteTeamOpen(false);
        setNewMemberForm({
            name: "",
            email: "",
            role: "Member",
            department: "",
            location: "",
            costCentre: "",
            manager: "",
            mobileNumber: "",
        });
    };

    const filteredPeople = people.filter(
        (person) =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900">People</h1>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent">
                        <HiOutlineDownload className="w-4 h-4" />
                    </Button>
                    <DropdownMenu open={isAddDropdownOpen} onOpenChange={setIsAddDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-9 gap-2 bg-[#0D7B3E] hover:bg-[#0a6331] text-white">
                                <HiOutlinePlus className="w-4 h-4" />
                                Add People
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => {
                                    setIsInviteTeamOpen(true);
                                    setIsAddDropdownOpen(false);
                                }}
                            >
                                Invite Team
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4">
                <div className="flex gap-6 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab("members")}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "members"
                                ? "border-[#0D7B3E] text-[#0D7B3E]"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Members
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("pending")}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "pending"
                                ? "border-[#0D7B3E] text-[#0D7B3E]"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Pending Invites
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="px-6 py-4">
                <div className="relative w-64">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search People..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 border-gray-200"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 px-6 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-200">
                            <TableHead className="text-xs font-medium text-gray-500 uppercase">
                                Member
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500 uppercase">
                                Role
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500 uppercase">
                                Department
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500 uppercase">
                                Location
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500 uppercase">
                                Cost Centre
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500 uppercase">
                                Manager
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPeople.map((person) => (
                            <TableRow
                                key={person.id}
                                className="cursor-pointer hover:bg-gray-50 border-gray-200"
                                onClick={() => handlePersonClick(person)}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                            V
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">
                                                {person.name}
                                            </div>
                                            <div className="text-xs text-gray-500">{person.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-900">{person.role}</TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {person.department || "-"}
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {person.location || "-"}
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {person.costCentre || "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-xs">
                                            V
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-900">{person.manager}</div>
                                            <div className="text-xs text-gray-500">{person.managerEmail}</div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-end">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        Showing 1-{filteredPeople.length} of {filteredPeople.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                            <HiOutlineChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                            <HiOutlineChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* User Details Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent className="w-[620px] sm:w-[420px] p-0 overflow-y-auto">
                    <SheetHeader className="px-6 py-4 border-b border-gray-200">
                        <SheetTitle className="text-lg font-semibold">User Details</SheetTitle>
                    </SheetHeader>

                    {selectedPerson && (
                        <div className="px-6 py-6">
                            {/* User Avatar and Info */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                    V
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{selectedPerson.name}</div>
                                    <div className="text-sm text-gray-500">{selectedPerson.email}</div>
                                </div>
                            </div>

                            {/* Basic Details */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-base font-semibold text-gray-900">Basic Details</h3>
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="text-sm text-[#0D7B3E] hover:text-[#0a6331] font-medium flex items-center gap-1"
                                        >
                                            Edit
                                            <HiOutlineChevronRight className="w-3 h-3" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSaveEdit}
                                            className="text-sm text-[#0D7B3E] hover:text-[#0a6331] font-medium"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-5">
                                    {/* User Role & Mobile Number */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                                User Role
                                            </label>
                                            <Select
                                                value={editForm.role || selectedPerson.role}
                                                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="h-10 border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="Member">Member</SelectItem>
                                                    <SelectItem value="Manager">Manager</SelectItem>
                                                    <SelectItem value="Viewer">Viewer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                                Mobile number
                                            </label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-md bg-gray-50 text-gray-500 text-sm">
                                                    +91
                                                </span>
                                                <Input
                                                    value={editForm.mobileNumber || selectedPerson.mobileNumber}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, mobileNumber: e.target.value })
                                                    }
                                                    disabled={!isEditing}
                                                    className="rounded-l-none h-10 border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost Centre & Location */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-[#0D7B3E] mb-2">
                                                Cost Centre
                                            </label>
                                            <Select
                                                value={editForm.costCentre || selectedPerson.costCentre || "none"}
                                                onValueChange={(value) =>
                                                    setEditForm({ ...editForm, costCentre: value === "none" ? "" : value })
                                                }
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="h-10 border-gray-200">
                                                    <SelectValue placeholder="Select Cost Centre" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Select Cost Centre</SelectItem>
                                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                                    <SelectItem value="Sales">Sales</SelectItem>
                                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                                    <SelectItem value="Operations">Operations</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#0D7B3E] mb-2">
                                                Location
                                            </label>
                                            <Select
                                                value={editForm.location || selectedPerson.location || "none"}
                                                onValueChange={(value) =>
                                                    setEditForm({ ...editForm, location: value === "none" ? "" : value })
                                                }
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="h-10 border-gray-200">
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Select Location</SelectItem>
                                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                                                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                                                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Department & Manager */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                                Department
                                            </label>
                                            <Select
                                                value={editForm.department || selectedPerson.department || "none"}
                                                onValueChange={(value) =>
                                                    setEditForm({ ...editForm, department: value === "none" ? "" : value })
                                                }
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="h-10 border-gray-200">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Select Department</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                    <SelectItem value="HR">HR</SelectItem>
                                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                                Manager
                                            </label>
                                            <Select
                                                value={editForm.manager || selectedPerson.manager || "none"}
                                                onValueChange={(value) =>
                                                    setEditForm({ ...editForm, manager: value === "none" ? "" : value })
                                                }
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="h-10 border-gray-200">
                                                    <SelectValue placeholder="Select user" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Select user</SelectItem>
                                                    <SelectItem value="Vishwnet India Private Limited">
                                                        Vishwnet India Private Limited
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Skip Manager 1 & Employee Grade */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                                Skip Manager 1
                                            </label>
                                            <Select
                                                value={editForm.skipManager1 || selectedPerson.skipManager1 || "none"}
                                                onValueChange={(value) =>
                                                    setEditForm({ ...editForm, skipManager1: value === "none" ? "" : value })
                                                }
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="h-10 border-gray-200">
                                                    <SelectValue placeholder="Select user" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Select user</SelectItem>
                                                    <SelectItem value="Vishwnet India Private Limited">
                                                        Vishwnet India Private Limited
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                                Employee Grade
                                            </label>
                                            <Input
                                                placeholder="Employee Grade"
                                                value={editForm.employeeGrade || selectedPerson.employeeGrade}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, employeeGrade: e.target.value })
                                                }
                                                disabled={!isEditing}
                                                className="h-10 border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Employee Id */}
                                    <div className="w-1/2 pr-2">
                                        <label className="block text-xs font-medium text-gray-500 mb-2">
                                            Employee Id
                                        </label>
                                        <Input
                                            placeholder="Employee Id"
                                            value={editForm.employeeId || selectedPerson.employeeId}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, employeeId: e.target.value })
                                            }
                                            disabled={!isEditing}
                                            className="h-10 border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-base font-semibold text-gray-900">Payment Details</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPaymentForm({ id: "", bankingFormat: "IFSC", accountNumber: "", ifsc: "" });
                                            setEditingPaymentIndex(null);
                                            setIsPaymentDialogOpen(true);
                                        }}
                                        className="text-sm text-[#0D7B3E] hover:text-[#0a6331] font-medium flex items-center gap-1"
                                    >
                                        <HiOutlinePencil className="w-3 h-3" />
                                        Update
                                    </button>
                                </div>

                                {selectedPerson.paymentDetails.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedPerson.paymentDetails.map((payment, index) => (
                                            <div
                                                key={payment.id}
                                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <BsBank className="w-4 h-4 text-gray-500" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            ****{payment.accountNumber.slice(-4)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{payment.ifsc}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditPayment(index)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <HiOutlinePencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePayment(index)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <HiOutlineX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsPaymentDialogOpen(true)}
                                        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <BsBank className="w-4 h-4" />
                                        Add Payment Details
                                    </button>
                                )}
                            </div>

                            {/* Vendor Owner For */}
                            <div className="mb-8">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Vendor Owner For</h3>
                                <p className="text-sm text-red-500">
                                    This user is not associated with any vendor.
                                </p>
                            </div>

                            {/* Disable User */}
                            <Button
                                variant="outline"
                                className="text-orange-500 border-orange-300 hover:bg-orange-50 hover:text-orange-600 bg-transparent"
                            >
                                Disable User
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Invite Team Dialog */}
            <Dialog open={isInviteTeamOpen} onOpenChange={setIsInviteTeamOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold">Invite Team</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                        {/* Add Member */}
                        <button
                            type="button"
                            onClick={() => setIsAddMemberFormOpen(true)}
                            className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <HiOutlinePlus className="w-6 h-6 text-gray-600 mb-2" />
                            <span className="font-medium text-gray-900">Add Member</span>
                        </button>

                        {/* Import via CSV */}
                        <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed">
                            <span className="font-medium text-gray-900">Import via CSV</span>
                            <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                        </div>

                        {/* Connect Google */}
                        <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed">
                            <span className="font-medium text-gray-900">Connect Google</span>
                            <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Member Form Dialog */}
            <Dialog open={isAddMemberFormOpen} onOpenChange={setIsAddMemberFormOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Member</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Enter full name"
                                value={newMemberForm.name}
                                onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                                className="h-10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                placeholder="Enter email address"
                                value={newMemberForm.email}
                                onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                                className="h-10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <Select
                                value={newMemberForm.role}
                                onValueChange={(value) => setNewMemberForm({ ...newMemberForm, role: value })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Member">Member</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="Viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-md bg-gray-50 text-gray-500 text-sm">
                                    +91
                                </span>
                                <Input
                                    placeholder="Mobile number"
                                    value={newMemberForm.mobileNumber}
                                    onChange={(e) =>
                                        setNewMemberForm({ ...newMemberForm, mobileNumber: e.target.value })
                                    }
                                    className="rounded-l-none h-10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department
                                </label>
                                <Select
                                    value={newMemberForm.department || "none"}
                                    onValueChange={(value) =>
                                        setNewMemberForm({ ...newMemberForm, department: value === "none" ? "" : value })
                                    }
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Select Department</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="HR">HR</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Engineering">Engineering</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <Select
                                    value={newMemberForm.location || "none"}
                                    onValueChange={(value) =>
                                        setNewMemberForm({ ...newMemberForm, location: value === "none" ? "" : value })
                                    }
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Select Location</SelectItem>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => setIsAddMemberFormOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-[#0D7B3E] hover:bg-[#0a6331] text-white"
                                onClick={handleAddMember}
                                disabled={!newMemberForm.name || !newMemberForm.email}
                            >
                                Add Member
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Payment Details Dialog */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <BsBank className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <DialogTitle>Add Payment Details</DialogTitle>
                                <p className="text-sm text-gray-500 mt-0.5">Please enter bank details</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-5 mt-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                Banking Format
                            </label>
                            <Select
                                value={paymentForm.bankingFormat}
                                onValueChange={(value) =>
                                    setPaymentForm({ ...paymentForm, bankingFormat: value })
                                }
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IFSC">IFSC</SelectItem>
                                    <SelectItem value="SWIFT">SWIFT</SelectItem>
                                    <SelectItem value="IBAN">IBAN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">
                                    Account Number
                                </label>
                                <Input
                                    placeholder="Account Number"
                                    value={paymentForm.accountNumber}
                                    onChange={(e) =>
                                        setPaymentForm({ ...paymentForm, accountNumber: e.target.value })
                                    }
                                    className="h-10"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">IFSC</label>
                                <Input
                                    placeholder="IFSC"
                                    value={paymentForm.ifsc}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, ifsc: e.target.value })}
                                    className="h-10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => {
                                    setIsPaymentDialogOpen(false);
                                    setEditingPaymentIndex(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-[#0D7B3E] hover:bg-[#0a6331] text-white"
                                onClick={handleAddPaymentDetail}
                                disabled={!paymentForm.accountNumber || !paymentForm.ifsc}
                            >
                                Verify Bank Details
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
