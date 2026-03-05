export const mockUsers = [
  { id: 1, name: "Arjun Mehta", email: "arjun@schoolfee.in", phone: "+91 98765 43210", role: "Admin", status: "Active", createdAt: "2024-01-15", avatar: "AM" },
  { id: 2, name: "Priya Sharma", email: "priya@schoolfee.in", phone: "+91 87654 32109", role: "Manager", status: "Active", createdAt: "2024-02-20", avatar: "PS" },
  { id: 3, name: "Ravi Kumar", email: "ravi@schoolfee.in", phone: "+91 76543 21098", role: "Employee", status: "Active", createdAt: "2024-03-10", avatar: "RK" },
  { id: 4, name: "Anita Singh", email: "anita@schoolfee.in", phone: "+91 65432 10987", role: "Normal User", status: "Inactive", createdAt: "2024-03-25", avatar: "AS" },
  { id: 5, name: "Suresh Patel", email: "suresh@schoolfee.in", phone: "+91 54321 09876", role: "Normal User", status: "Active", createdAt: "2024-04-05", avatar: "SP" },
  { id: 6, name: "Deepa Nair", email: "deepa@schoolfee.in", phone: "+91 43210 98765", role: "Employee", status: "Active", createdAt: "2024-04-12", avatar: "DN" },
  { id: 7, name: "Vikram Joshi", email: "vikram@schoolfee.in", phone: "+91 32109 87654", role: "Custom User", status: "Active", createdAt: "2024-05-01", avatar: "VJ" },
  { id: 8, name: "Meena Rao", email: "meena@schoolfee.in", phone: "+91 21098 76543", role: "Manager", status: "Pending", createdAt: "2024-05-15", avatar: "MR" },
];

export const mockSchools = [
  { id: 1, name: "Delhi Public School", city: "New Delhi", state: "Delhi", students: 1240, teachers: 68, status: "Active", paymentStatus: "Paid", joined: "2023-08-01" },
  { id: 2, name: "Kendriya Vidyalaya", city: "Mumbai", state: "Maharashtra", students: 980, teachers: 52, status: "Active", paymentStatus: "Pending", joined: "2023-09-15" },
  { id: 3, name: "St. Xavier's School", city: "Kolkata", state: "West Bengal", students: 750, teachers: 41, status: "Active", paymentStatus: "Paid", joined: "2023-10-01" },
  { id: 4, name: "Sardar Patel School", city: "Ahmedabad", state: "Gujarat", students: 620, teachers: 34, status: "Inactive", paymentStatus: "Overdue", joined: "2023-11-20" },
  { id: 5, name: "Sunrise Academy", city: "Bangalore", state: "Karnataka", students: 890, teachers: 47, status: "Active", paymentStatus: "Paid", joined: "2024-01-10" },
];

export const mockParents = [
  { id: 1, name: "Ramesh Gupta", email: "ramesh@gmail.com", children: 2, paymentStatus: "Paid", pendingAmount: 0, school: "Delhi Public School" },
  { id: 2, name: "Sunita Verma", email: "sunita@gmail.com", children: 1, paymentStatus: "Pending", pendingAmount: 4500, school: "Kendriya Vidyalaya" },
  { id: 3, name: "Manoj Tiwari", email: "manoj@gmail.com", children: 3, paymentStatus: "Overdue", pendingAmount: 12000, school: "St. Xavier's School" },
  { id: 4, name: "Kavita Desai", email: "kavita@gmail.com", children: 1, paymentStatus: "Paid", pendingAmount: 0, school: "Sunrise Academy" },
  { id: 5, name: "Arun Sharma", email: "arun@gmail.com", children: 2, paymentStatus: "Pending", pendingAmount: 6800, school: "Delhi Public School" },
];

export const mockEmployees = [
  { id: 1, name: "Kiran Bhat", email: "kiran@schoolfee.in", role: "Field Agent", assignedSchools: 3, assignedParents: 45, status: "Active", performance: 92 },
  { id: 2, name: "Pooja Iyer", email: "pooja@schoolfee.in", role: "Support Staff", assignedSchools: 2, assignedParents: 28, status: "Active", performance: 87 },
  { id: 3, name: "Rahul Das", email: "rahul@schoolfee.in", role: "Coordinator", assignedSchools: 5, assignedParents: 72, status: "Active", performance: 95 },
  { id: 4, name: "Neha Pillai", email: "neha@schoolfee.in", role: "Field Agent", assignedSchools: 2, assignedParents: 31, status: "Inactive", performance: 78 },
];

export const mockManagers = [
  { id: 1, name: "Sanjay Kapoor", email: "sanjay@schoolfee.in", region: "North India", employees: 12, schools: 28, status: "Active" },
  { id: 2, name: "Radha Krishnan", email: "radha@schoolfee.in", region: "South India", employees: 9, schools: 22, status: "Active" },
  { id: 3, name: "Amit Bhatt", email: "amit@schoolfee.in", region: "West India", employees: 7, schools: 18, status: "Active" },
];

export const mockPayments = [
  { id: "TXN001", parent: "Ramesh Gupta", school: "Delhi Public School", amount: 8500, status: "Completed", date: "2024-05-20", method: "UPI" },
  { id: "TXN002", parent: "Sunita Verma", school: "Kendriya Vidyalaya", amount: 4500, status: "Pending", date: "2024-05-18", method: "Net Banking" },
  { id: "TXN003", parent: "Manoj Tiwari", school: "St. Xavier's School", amount: 6000, status: "Failed", date: "2024-05-15", method: "Card" },
  { id: "TXN004", parent: "Kavita Desai", school: "Sunrise Academy", amount: 7200, status: "Completed", date: "2024-05-14", method: "UPI" },
  { id: "TXN005", parent: "Arun Sharma", school: "Delhi Public School", amount: 5500, status: "Pending", date: "2024-05-12", method: "NEFT" },
  { id: "TXN006", parent: "Lakshmi Narayan", school: "Kendriya Vidyalaya", amount: 9000, status: "Completed", date: "2024-05-10", method: "UPI" },
];

export const mockForms = [
  { id: "FORM001", name: "Ravi Shankar", email: "ravi.s@gmail.com", type: "School Registration", date: "2024-05-22", status: "Pending" },
  { id: "FORM002", name: "Lakshmi Devi", email: "laxmi@gmail.com", type: "Parent Enrollment", date: "2024-05-21", status: "Reviewed" },
  { id: "FORM003", name: "Mohan Lal", email: "mohan@gmail.com", type: "Scholarship Application", date: "2024-05-20", status: "Approved" },
  { id: "FORM004", name: "Seema Jain", email: "seema@gmail.com", type: "School Registration", date: "2024-05-19", status: "Rejected" },
  { id: "FORM005", name: "Prakash Rao", email: "prakash@gmail.com", type: "Parent Enrollment", date: "2024-05-18", status: "Pending" },
];

export const monthlyData = [
  { month: "Jan", users: 120, payments: 85000, schools: 3, parents: 95 },
  { month: "Feb", users: 185, payments: 124000, schools: 5, parents: 142 },
  { month: "Mar", users: 240, payments: 168000, schools: 7, parents: 198 },
  { month: "Apr", users: 195, payments: 145000, schools: 4, parents: 167 },
  { month: "May", users: 310, payments: 215000, schools: 8, parents: 278 },
  { month: "Jun", users: 280, payments: 195000, schools: 6, parents: 245 },
  { month: "Jul", users: 350, payments: 245000, schools: 9, parents: 312 },
  { month: "Aug", users: 420, payments: 298000, schools: 11, parents: 389 },
  { month: "Sep", users: 380, payments: 272000, schools: 10, parents: 354 },
  { month: "Oct", users: 460, payments: 325000, schools: 13, parents: 421 },
  { month: "Nov", users: 510, payments: 368000, schools: 14, parents: 476 },
  { month: "Dec", users: 590, payments: 425000, schools: 16, parents: 545 },
];

export const weeklyData = [
  { day: "Mon", sessions: 142, newUsers: 18, revenue: 48000 },
  { day: "Tue", sessions: 198, newUsers: 24, revenue: 62000 },
  { day: "Wed", sessions: 176, newUsers: 21, revenue: 55000 },
  { day: "Thu", sessions: 220, newUsers: 32, revenue: 78000 },
  { day: "Fri", sessions: 265, newUsers: 38, revenue: 92000 },
  { day: "Sat", sessions: 180, newUsers: 15, revenue: 41000 },
  { day: "Sun", sessions: 95, newUsers: 8, revenue: 24000 },
];

export const stateData = [
  { state: "Maharashtra", schools: 32, parents: 820, revenue: 480000 },
  { state: "Delhi", schools: 28, parents: 710, revenue: 420000 },
  { state: "Karnataka", schools: 21, parents: 540, revenue: 315000 },
  { state: "Gujarat", schools: 18, parents: 460, revenue: 268000 },
  { state: "West Bengal", schools: 14, parents: 360, revenue: 214000 },
  { state: "Tamil Nadu", schools: 14, parents: 350, revenue: 208000 },
];

export const roleDistribution = [
  { role: "Normal Users", count: 3240, color: "#00468E" },
  { role: "Employees", count: 142, color: "#F4951D" },
  { role: "Managers", count: 28, color: "#10b981" },
  { role: "Admins", count: 8, color: "#ef4444" },
  { role: "Custom Users", count: 95, color: "#8b5cf6" },
];

export const kpiData = {
  totalUsers: 3513,
  totalSchools: 127,
  totalParents: 2840,
  totalEmployees: 142,
  totalManagers: 28,
  totalApplications: 489,
  totalPayments: 2156800,
};

export const recentActivity = [
  { id: 1, action: "New school registered", user: "Delhi Public School", time: "2 min ago", type: "school" },
  { id: 2, action: "Payment received", user: "Ramesh Gupta", time: "15 min ago", type: "payment" },
  { id: 3, action: "New parent enrolled", user: "Sunita Verma", time: "1 hr ago", type: "user" },
  { id: 4, action: "Employee assigned", user: "Kiran Bhat", time: "2 hr ago", type: "employee" },
  { id: 5, action: "Form submitted", user: "Mohan Lal", time: "3 hr ago", type: "form" },
];

export const allNotifications = [
  { id: 1, title: "New School Registration", message: "Delhi Public School has submitted registration request", time: "2 min ago", read: false, type: "school" },
  { id: 2, title: "Payment Received", message: "Rs. 8,500 received from Ramesh Gupta for Delhi Public School", time: "15 min ago", read: false, type: "payment" },
  { id: 3, title: "Form Submissions", message: "3 new form submissions are awaiting review", time: "1h ago", read: false, type: "form" },
  { id: 4, title: "Employee Assigned", message: "Kiran Bhat has been successfully assigned to school", time: "2h ago", read: true, type: "employee" },
  { id: 5, title: "Overdue Payment Alert", message: "Manoj Tiwari has an overdue payment of Rs. 12,000", time: "3h ago", read: true, type: "alert" },
  { id: 6, title: "New Manager Added", message: "Sanjay Kapoor has been added as North India Manager", time: "5h ago", read: true, type: "user" },
  { id: 7, title: "Monthly Report Ready", message: "May 2024 analytics report has been generated", time: "1d ago", read: true, type: "report" },
  { id: 8, title: "School Deactivated", message: "Sardar Patel School has been deactivated due to overdue fees", time: "2d ago", read: true, type: "alert" },
];