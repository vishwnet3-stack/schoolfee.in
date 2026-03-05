"use client";

import React, { useState, useEffect } from "react";
import {
    IoSearch,
    IoFilter,
    IoChevronDown,
    IoDownload,
    IoCard,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Types
interface Card {
    id: string;
    cardName: string;
    cardNumber: string;
    cardType: "Virtual" | "Physical";
    availableLimit: number;
    totalLimit: number;
}

interface Approver {
    id: string;
    name: string;
    avatar?: string;
}

// Dummy approvers
const approvers: Approver[] = [
    { id: "1", name: "Vishwnet India Private Lin" },
    { id: "2", name: "John Smith" },
    { id: "3", name: "Sarah Johnson" },
];

const initiators: Approver[] = [
    { id: "1", name: "Vishwnet India Private Lin" },
    { id: "2", name: "John Smith" },
    { id: "3", name: "Sarah Johnson" },
];

export default function ExpenseApprovalPage() {
    const [activeTab, setActiveTab] = useState<"in-policy" | "out-of-policy">("in-policy");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
    const [selectedInitiators, setSelectedInitiators] = useState<string[]>([]);
    const [showApproverFilter, setShowApproverFilter] = useState(false);
    const [showInitiatorFilter, setShowInitiatorFilter] = useState(false);
    const [approverSearch, setApproverSearch] = useState("");
    const [initiatorSearch, setInitiatorSearch] = useState("");
    const [groupBy, setGroupBy] = useState("None");
    const [isMyCardsOpen, setIsMyCardsOpen] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [cardSearch, setCardSearch] = useState("");

    // Load cards from localStorage
    useEffect(() => {
        const savedCards = localStorage.getItem("cards");
        if (savedCards) {
            setCards(JSON.parse(savedCards));
        }
    }, []);

    // Filter approvers based on search
    const filteredApprovers = approvers.filter((approver) =>
        approver.name.toLowerCase().includes(approverSearch.toLowerCase())
    );

    // Filter initiators based on search
    const filteredInitiators = initiators.filter((initiator) =>
        initiator.name.toLowerCase().includes(initiatorSearch.toLowerCase())
    );

    // Filter cards based on search
    const filteredCards = cards.filter(
        (card) =>
            card.cardName.toLowerCase().includes(cardSearch.toLowerCase()) ||
            card.cardNumber.includes(cardSearch)
    );

    // Toggle approver selection
    const toggleApprover = (id: string) => {
        setSelectedApprovers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Toggle initiator selection
    const toggleInitiator = (id: string) => {
        setSelectedInitiators((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Get empty state text based on active tab
    const getEmptyStateText = () => {
        if (activeTab === "in-policy") {
            return "All expense to be approved will appear here.";
        }
        return "All out-of-policy and declined expenses will appear here.";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500 mb-1">Expenses</p>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">For Approval</h1>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsMyCardsOpen(true)}
                        className="flex items-center gap-2 bg-transparent border-gray-300"
                    >
                        <IoCard size={18} />
                        <span>My Cards</span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                            {cards.length}
                        </span>
                    </Button>

                    <Button variant="outline" className="flex items-center gap-2 bg-transparent border-gray-300">
                        <IoDownload size={18} />
                        <span className="hidden sm:inline">Export All</span>
                        <span>(0)</span>
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-6 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab("in-policy")}
                    className={cn(
                        "pb-3 text-sm font-medium transition-colors relative",
                        activeTab === "in-policy"
                            ? "text-[#00468E]"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    In Policy
                    {activeTab === "in-policy" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00468E]" />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("out-of-policy")}
                    className={cn(
                        "pb-3 text-sm font-medium transition-colors relative",
                        activeTab === "out-of-policy"
                            ? "text-[#00468E]"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Out of Policy
                    {activeTab === "out-of-policy" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00468E]" />
                    )}
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                <button
                    type="button"
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <IoFilter size={20} className="text-gray-600" />
                </button>

                <div className="relative flex-1 max-w-xl">
                    <IoSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search by Employee, Amount or Description"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 border-gray-300"
                    />
                </div>

                {/* Next Approver Filter */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setShowApproverFilter(!showApproverFilter);
                            setShowInitiatorFilter(false);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors",
                            showApproverFilter || selectedApprovers.length > 0
                                ? "border-gray-400 bg-gray-50"
                                : "border-gray-300 hover:bg-gray-50"
                        )}
                    >
                        <span className="text-sm font-medium text-gray-700">Next Approver</span>
                        <IoChevronDown
                            size={16}
                            className={cn("text-gray-500 transition-transform", showApproverFilter && "rotate-180")}
                        />
                    </button>

                    {showApproverFilter && (
                        <div className="absolute z-20 mt-2 left-0 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">Next Approver</span>
                                    <IoFilter size={14} className="text-gray-400" />
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="relative mb-3">
                                    <IoSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search Next Approver"
                                        value={approverSearch}
                                        onChange={(e) => setApproverSearch(e.target.value)}
                                        className="pl-9 h-9 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {filteredApprovers.map((approver) => (
                                        <label
                                            key={approver.id}
                                            className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={selectedApprovers.includes(approver.id)}
                                                onCheckedChange={() => toggleApprover(approver.id)}
                                            />
                                            <div className="w-7 h-7 rounded-full bg-[#00468E] flex items-center justify-center text-white text-xs font-medium">
                                                {approver.name.charAt(0)}
                                            </div>
                                            <span className="text-sm truncate">{approver.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Initiator Filter */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setShowInitiatorFilter(!showInitiatorFilter);
                            setShowApproverFilter(false);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors",
                            showInitiatorFilter || selectedInitiators.length > 0
                                ? "border-gray-400 bg-gray-50"
                                : "border-gray-300 hover:bg-gray-50"
                        )}
                    >
                        <span className="text-sm font-medium text-gray-700">Initiator</span>
                        <IoChevronDown
                            size={16}
                            className={cn("text-gray-500 transition-transform", showInitiatorFilter && "rotate-180")}
                        />
                    </button>

                    {showInitiatorFilter && (
                        <div className="absolute z-20 mt-2 left-0 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">Initiator</span>
                                    <IoFilter size={14} className="text-gray-400" />
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="relative mb-3">
                                    <IoSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search Initiator"
                                        value={initiatorSearch}
                                        onChange={(e) => setInitiatorSearch(e.target.value)}
                                        className="pl-9 h-9 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {filteredInitiators.map((initiator) => (
                                        <label
                                            key={initiator.id}
                                            className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={selectedInitiators.includes(initiator.id)}
                                                onCheckedChange={() => toggleInitiator(initiator.id)}
                                            />
                                            <div className="w-7 h-7 rounded-full bg-[#00468E] flex items-center justify-center text-white text-xs font-medium">
                                                {initiator.name.charAt(0)}
                                            </div>
                                            <span className="text-sm truncate">{initiator.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Group By */}
                <div className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700"
                            >
                                <span className="text-gray-500">Group By :</span>
                                <span className="font-medium">{groupBy}</span>
                                <IoChevronDown size={16} className="text-gray-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                            <button
                                type="button"
                                onClick={() => setGroupBy("None")}
                                className={cn(
                                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between",
                                    groupBy === "None" && "text-[#00468E]"
                                )}
                            >
                                None
                                {groupBy === "None" && <span className="text-[#00468E]">✓</span>}
                            </button>
                            <button
                                type="button"
                                onClick={() => setGroupBy("Employee")}
                                className={cn(
                                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between",
                                    groupBy === "Employee" && "text-[#00468E]"
                                )}
                            >
                                Employee
                                {groupBy === "Employee" && <span className="text-[#00468E]">✓</span>}
                            </button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Empty State */}
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <div className="max-w-sm mx-auto">
                    <div className="w-40 h-40 mx-auto mb-6">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Background circle */}
                            <circle cx="100" cy="100" r="60" fill="#D1FAE5" />
                            {/* Person */}
                            <circle cx="100" cy="75" r="18" fill="#374151" />
                            <rect x="80" y="100" width="40" height="45" rx="4" fill="#10B981" />
                            <rect x="75" y="145" width="18" height="25" fill="#374151" />
                            <rect x="107" y="145" width="18" height="25" fill="#374151" />
                            {/* Thumbs up icons */}
                            <g transform="translate(50, 60) scale(0.5)">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" fill="#9CA3AF" />
                            </g>
                            <g transform="translate(130, 60) scale(0.5)">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" fill="#9CA3AF" />
                            </g>
                            <g transform="translate(140, 90) scale(0.5)">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" fill="#9CA3AF" />
                            </g>
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No expenses yet</h2>
                    <p className="text-gray-500 text-sm">{getEmptyStateText()}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 text-sm text-gray-600">
                <span>Total: 0.00</span>
                <span className="hidden sm:inline">*</span>
                <span>Showing 1-0 of 0</span>
            </div>

            {/* My Cards Sheet */}
            <Sheet open={isMyCardsOpen} onOpenChange={setIsMyCardsOpen}>
                <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto p-0">
                    <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Expenses</p>
                        <SheetTitle className="text-xl font-semibold text-gray-900">
                            My Cards ({cards.length})
                        </SheetTitle>
                    </SheetHeader>

                    <div className="px-6 py-4">
                        {/* Search */}
                        <div className="relative mb-4">
                            <IoSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search by Card Name or Last 4 digits of Card Number"
                                value={cardSearch}
                                onChange={(e) => setCardSearch(e.target.value)}
                                className="pl-10 h-10 border-gray-300 text-sm"
                            />
                        </div>

                        {/* Cards Table */}
                        {filteredCards.length > 0 ? (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                                                Card
                                            </th>
                                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                                                Card Type
                                            </th>
                                            <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                                                Available Limit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCards.map((card) => (
                                            <tr key={card.id} className="border-b border-gray-100 last:border-b-0">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                            <IoCard size={18} className="text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{card.cardName}</p>
                                                            <p className="text-xs text-gray-500">**** {card.cardNumber.slice(-4)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={cn(
                                                            "px-2 py-1 rounded text-xs font-medium",
                                                            card.cardType === "Virtual"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        )}
                                                    >
                                                        {card.cardType}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3 justify-end">
                                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full"
                                                                style={{
                                                                    width: `${(card.availableLimit / card.totalLimit) * 100}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            Rs.{card.availableLimit.toLocaleString()}.00
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <IoCard size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500 text-sm">No cards found</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-white sticky bottom-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsMyCardsOpen(false)}
                            className="bg-transparent border-gray-300"
                        >
                            Cancel
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Click outside to close filters */}
            {(showApproverFilter || showInitiatorFilter) && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                        setShowApproverFilter(false);
                        setShowInitiatorFilter(false);
                    }}
                />
            )}
        </div>
    );
}
