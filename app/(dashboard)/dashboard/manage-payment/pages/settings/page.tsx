"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { BsBuilding, BsSlack, BsMicrosoft } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { SiZoho } from "react-icons/si";

type TabType = "entities" | "company-policies" | "accounting-policy" | "integration" | "taxation" | "configurations";

interface Entity {
  id: string;
  companyName: string;
  gstin: string;
  location: string;
}

interface ConfigSetting {
  key: string;
  enabled: boolean;
  value?: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("entities");
  const [entities, setEntities] = useState<Entity[]>([
    {
      id: "1",
      companyName: "Vishwnet India Private Limited",
      gstin: "07AAGCV7568M1ZH",
      location: "Delhi",
    },
  ]);
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [entityStep, setEntityStep] = useState(1);
  const [newEntityGstin, setNewEntityGstin] = useState("");

  const [configurations, setConfigurations] = useState<ConfigSetting[]>([
    { key: "roundingOff", enabled: false },
    { key: "ccVendorOwner", enabled: false },
    { key: "vendorPaymentNotifications", enabled: false },
    { key: "inventory", enabled: false },
    { key: "enableAccountingDate", enabled: false },
    { key: "allowMultipleGstin", enabled: true },
    { key: "vendorBankDetailsEditable", enabled: false },
    { key: "allowVendorDuplicate", enabled: false },
  ]);

  const [selectValues, setSelectValues] = useState({
    lineItemParsing: "multi-line",
    invoiceDueDate: "from-invoice-date",
    tdsEnabled: "invoice",
    showAliasWithTags: "marketing",
  });

  useEffect(() => {
    const savedEntities = localStorage.getItem("settings_entities");
    if (savedEntities) {
      setEntities(JSON.parse(savedEntities));
    }
    const savedConfigs = localStorage.getItem("settings_configurations");
    if (savedConfigs) {
      setConfigurations(JSON.parse(savedConfigs));
    }
  }, []);

  const saveEntities = (updated: Entity[]) => {
    setEntities(updated);
    localStorage.setItem("settings_entities", JSON.stringify(updated));
  };

  const saveConfigurations = (updated: ConfigSetting[]) => {
    setConfigurations(updated);
    localStorage.setItem("settings_configurations", JSON.stringify(updated));
  };

  const toggleConfig = (key: string) => {
    const updated = configurations.map((c) =>
      c.key === key ? { ...c, enabled: !c.enabled } : c
    );
    saveConfigurations(updated);
  };

  const getConfigValue = (key: string) => {
    return configurations.find((c) => c.key === key)?.enabled || false;
  };

  const handleAddEntity = () => {
    if (newEntityGstin.length === 15) {
      const newEntity: Entity = {
        id: Date.now().toString(),
        companyName: `Company ${entities.length + 1}`,
        gstin: newEntityGstin,
        location: "Delhi",
      };
      saveEntities([...entities, newEntity]);
      setIsAddEntityOpen(false);
      setEntityStep(1);
      setNewEntityGstin("");
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "entities", label: "Entities" },
    { id: "company-policies", label: "Company Policies" },
    { id: "accounting-policy", label: "Accounting Policy" },
    { id: "integration", label: "Integration" },
    { id: "taxation", label: "Taxation" },
    { id: "configurations", label: "Configurations" },
  ];

  const integrations = [
    {
      name: "Slack",
      icon: <BsSlack className="w-8 h-8 text-[#4A154B]" />,
      description: "Connect Slack to raise invoices, manage payment approvals and get alerts and notifications on the go.",
      action: "Connect Slack",
      disabled: true,
    },
    {
      name: "Zoho",
      icon: <SiZoho className="w-8 h-8 text-[#C8202B]" />,
      description: "Connect your Zoho Books and sync accounting directly from Pazy.",
      action: "Connect Zoho",
      disabled: true,
    },
    {
      name: "Odoo",
      icon: <span className="text-lg font-bold text-gray-600">odoo</span>,
      description: "Connect your Odoo account to sync purchase orders and GRNs directly into Pazy.",
      action: "Connect Odoo",
      disabled: true,
    },
    {
      name: "Tally",
      icon: <span className="text-lg font-bold text-yellow-600 italic">Tally</span>,
      description: "Connect your Tally and sync accounting directly from Pazy.",
      action: "Connect Tally",
      disabled: true,
    },
    {
      name: "Google Workspace",
      icon: <FcGoogle className="w-8 h-8" />,
      description: "Sync users to Pazy from your Google Workspace",
      action: "View Integration",
      disabled: true,
    },
    {
      name: "Microsoft Active Directory",
      icon: <BsMicrosoft className="w-8 h-8 text-[#0078D4]" />,
      description: "Sync users to Pazy from your Microsoft Active Directory",
      action: "View Integration",
      disabled: true,
    },
    {
      name: "Oracle Fusion Cloud",
      icon: <div className="w-8 h-8 rounded-full border-4 border-red-500" />,
      description: "Connect your Oracle Fusion Cloud and sync accounting directly from Pazy.",
      action: "View Integration",
      disabled: true,
    },
    {
      name: "Microsoft Business Central 365",
      icon: <SiZoho className="w-8 h-8 text-[#0078D4]" />,
      description: "Connect your Dynamics BC 365 and sync accounting directly from Pazy.",
      action: "View Integration",
      disabled: true,
    },
  ];

  const accountingPolicyDefaults = [
    {
      name: "Expense Head",
      description: 'List all of your "Expense Heads" in your accounting.',
      type: "Dropdown",
      state: "Enabled",
    },
    {
      name: "Location",
      description: "Add different locations you have offices in. This will allow you to analyze different expenses by location.",
      type: "Dropdown",
      state: "Enabled",
    },
    {
      name: "Department",
      description: "Add different departments(Finance, Legal, Product, Marketing etc.) you have.",
      type: "Dropdown",
      state: "Enabled",
    },
    {
      name: "Cost Centre",
      description: "Add if you have multiple cost centre(e.g. Zomato, Blinkit, Hyperpure)",
      type: "Dropdown",
      state: "Enabled",
    },
    {
      name: "SKU",
      description: 'List all of your "SKUs" in your accounting.',
      type: "Dropdown",
      state: "Enabled",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-[#0D7B3E] text-[#0D7B3E]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Entities Tab */}
        {activeTab === "entities" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Total Entities : {entities.length}
              </h2>
              <Button
                className="gap-2 bg-[#0D7B3E] hover:bg-[#0a6331] text-white"
                onClick={() => setIsAddEntityOpen(true)}
              >
                <HiOutlinePlus className="w-4 h-4" />
                Add New Entity
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500">
                    Company Name
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">GSTIN</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow key={entity.id} className="border-gray-200">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                          <BsBuilding className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-[#0D7B3E]">
                          {entity.companyName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700">
                        {entity.gstin}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-[#0D7B3E]">
                      {entity.location}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Company Policies Tab */}
        {activeTab === "company-policies" && (
          <div className="p-6">
            {/* Submission Policies */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Submission Policies</h3>
              <p className="text-sm text-gray-500 mb-4">
                Define what information employees need to submit for various transactions.
              </p>

              <div className="border border-gray-200 rounded-lg p-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                      <HiOutlineDocumentText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Expenses</h4>
                      <p className="text-xs text-gray-500">
                        What all details needs to be collected for expenses?
                      </p>
                    </div>
                  </div>
                  <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Approval Policies */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Approval Policies</h3>
              <p className="text-sm text-gray-500 mb-4">
                Set up approval workflows for different types of transactions.
              </p>

              <div className="border border-gray-200 rounded-lg p-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                      <HiOutlineDocumentText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Expenses</h4>
                      <p className="text-xs text-gray-500">
                        Who needs to approve employee expenses?
                      </p>
                    </div>
                  </div>
                  <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accounting Policy Tab */}
        {activeTab === "accounting-policy" && (
          <div className="p-6">
            {/* Custom Fields */}
            <div className="mb-8">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Custom Fields
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Description
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      Type
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase">
                      State
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>

              <div className="mt-4">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <HiOutlinePlus className="w-4 h-4" />
                  Create Custom Field
                </Button>
              </div>

              <p className="text-center text-gray-500 py-8">No Custom Tag added.</p>
            </div>

            {/* Defaults */}
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500 uppercase">
                    Defaults
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase">
                    Description
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase">
                    State
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountingPolicyDefaults.map((item) => (
                  <TableRow key={item.name} className="border-gray-200">
                    <TableCell className="text-sm font-medium text-[#0D7B3E]">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-md">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{item.type}</TableCell>
                    <TableCell className="text-sm text-[#0D7B3E]">{item.state}</TableCell>
                    <TableCell>
                      <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Integration Tab */}
        {activeTab === "integration" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {integration.icon}
                      <span className="font-medium text-gray-900">{integration.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-red-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Disabled
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex-1 mb-4">{integration.description}</p>
                  <button
                    type="button"
                    className="text-sm font-medium text-[#0D7B3E] text-right hover:text-[#0a6331]"
                  >
                    {integration.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Taxation Tab */}
        {activeTab === "taxation" && (
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-6 max-w-xs">
              <div className="mb-4">
                <div className="relative inline-block">
                  <div className="w-12 h-14 bg-gray-50 rounded flex items-center justify-center border border-gray-200">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1 rounded">
                      GST
                    </span>
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">GST</h3>
              <p className="text-sm text-gray-500">
                Manage Standard and Custom GST Rates here
              </p>
            </div>
          </div>
        )}

        {/* Configurations Tab */}
        {activeTab === "configurations" && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <HiOutlineCog className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Configurations</h2>
                <p className="text-sm text-gray-500">
                  Customize and Manage Your Organization Settings
                </p>
              </div>
            </div>

            <div className="max-w-8xl">
              {/* Invoice Settings */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 w-48">
                  Invoice Settings
                </h3>

                <div className="space-y-4">
                  {/* Line Item Parsing */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">Line Item Parsing</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <Select
                      value={selectValues.lineItemParsing}
                      onValueChange={(v) =>
                        setSelectValues({ ...selectValues, lineItemParsing: v })
                      }
                    >
                      <SelectTrigger className="w-44 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multi-line">Multi Line Items</SelectItem>
                        <SelectItem value="single-line">Single Line Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Invoice Due Date Calculation */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">Invoice Due Date Calculation</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <Select
                      value={selectValues.invoiceDueDate}
                      onValueChange={(v) =>
                        setSelectValues({ ...selectValues, invoiceDueDate: v })
                      }
                    >
                      <SelectTrigger className="w-44 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="from-invoice-date">From Invoice Date</SelectItem>
                        <SelectItem value="from-approval-date">From Approval Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rounding Off */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">Rounding Off</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {getConfigValue("roundingOff") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("roundingOff")}
                        onCheckedChange={() => toggleConfig("roundingOff")}
                      />
                    </div>
                  </div>

                  {/* TDS Enabled on */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#0D7B3E]">TDS Enabled on</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <Select
                      value={selectValues.tdsEnabled}
                      onValueChange={(v) =>
                        setSelectValues({ ...selectValues, tdsEnabled: v })
                      }
                    >
                      <SelectTrigger className="w-44 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Show Alias with Tags */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">Show Alias with Tags</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <Select
                      value={selectValues.showAliasWithTags}
                      onValueChange={(v) =>
                        setSelectValues({ ...selectValues, showAliasWithTags: v })
                      }
                    >
                      <SelectTrigger className="w-44 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Value (e.g. "Marketing")</SelectItem>
                        <SelectItem value="alias">Alias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* CC Vendor Owner */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">
                        CC Vendor Owner and Initiator in Vendor Invite
                      </span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {getConfigValue("ccVendorOwner") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("ccVendorOwner")}
                        onCheckedChange={() => toggleConfig("ccVendorOwner")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Communication */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 w-48">
                  Payment Communication
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">Vendor Payment Notifications</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {getConfigValue("vendorPaymentNotifications") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("vendorPaymentNotifications")}
                        onCheckedChange={() => toggleConfig("vendorPaymentNotifications")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* General Settings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 w-48">
                  General Settings
                </h3>

                <div className="space-y-4">
                  {/* Inventory */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">Inventory</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {getConfigValue("inventory") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("inventory")}
                        onCheckedChange={() => toggleConfig("inventory")}
                      />
                    </div>
                  </div>

                  {/* Enable Accounting Date */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">Enable Accounting Date</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {getConfigValue("enableAccountingDate") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("enableAccountingDate")}
                        onCheckedChange={() => toggleConfig("enableAccountingDate")}
                      />
                    </div>
                  </div>

                  {/* Allow multiple GSTIN */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#0D7B3E]">Allow multiple GSTIN for vendor</span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#0D7B3E]">
                        {getConfigValue("allowMultipleGstin") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("allowMultipleGstin")}
                        onCheckedChange={() => toggleConfig("allowMultipleGstin")}
                        className="data-[state=checked]:bg-[#0D7B3E]"
                      />
                    </div>
                  </div>

                  {/* Vendor Bank Details Editable */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">
                        Vendor Bank Details Editable For Members
                      </span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {getConfigValue("vendorBankDetailsEditable") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("vendorBankDetailsEditable")}
                        onCheckedChange={() => toggleConfig("vendorBankDetailsEditable")}
                      />
                    </div>
                  </div>

                  {/* Allow Vendor Duplicate */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-700">
                        Allow Vendor Duplicate Creation Based On GSTIN
                      </span>
                      <HiOutlineQuestionMarkCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {getConfigValue("allowVendorDuplicate") ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={getConfigValue("allowVendorDuplicate")}
                        onCheckedChange={() => toggleConfig("allowVendorDuplicate")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Entity Dialog */}
      <Dialog open={isAddEntityOpen} onOpenChange={setIsAddEntityOpen}>
        <DialogContent className="max-w-full">
          <div className="flex gap-8">
            {/* Steps */}
            <div className="w-48 pt-8">
              <div className="flex flex-col gap-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      entityStep >= 1 ? "bg-[#0D7B3E]" : "border-2 border-gray-300"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      entityStep >= 1 ? "text-[#0D7B3E]" : "text-gray-500"
                    }`}
                  >
                    Business Details
                  </span>
                </div>
                <div className="w-px h-8 bg-gray-200 ml-1.5" />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      entityStep >= 2 ? "bg-[#0D7B3E]" : "border-2 border-gray-300"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      entityStep >= 2 ? "text-[#0D7B3E]" : "text-gray-500"
                    }`}
                  >
                    GST verification
                  </span>
                </div>
                <div className="w-px h-8 bg-gray-200 ml-1.5" />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      entityStep >= 3 ? "bg-[#0D7B3E]" : "border-2 border-gray-300"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      entityStep >= 3 ? "text-[#0D7B3E]" : "text-gray-500"
                    }`}
                  >
                    Finish
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="">
              <div className="border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  We will auto-verify your business
                </h3>
                <div className="flex gap-3 w-full max-w-md">
                  <Input
                    placeholder="Enter GST..."
                    value={newEntityGstin}
                    onChange={(e) => setNewEntityGstin(e.target.value.toUpperCase())}
                    className="h-11 border-[#0D7B3E] focus-visible:ring-[#0D7B3E]"
                  />
                  <Button
                    className="bg-[#0D7B3E] hover:bg-[#0a6331] text-white px-8"
                    onClick={handleAddEntity}
                    disabled={newEntityGstin.length !== 15}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
