// lib/auth.ts
import { cookies } from 'next/headers';
import { db } from './db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
}

// Generate secure session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create session
export async function createSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  await db.execute(
    'INSERT INTO admin_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
    [userId, sessionToken, expiresAt]
  );

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return sessionToken;
}

// Verify session and get user
export async function getSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return null;
    }

    // Check if session exists and is valid
    const [sessions] = await db.execute<any[]>(
      `SELECT s.user_id, u.id, u.username, u.email, u.full_name 
       FROM admin_sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.session_token = ? AND s.expires_at > NOW() AND u.is_active = TRUE`,
      [sessionToken]
    );

    if (!sessions || sessions.length === 0) {
      return null;
    }

    const user = sessions[0];
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

// Verify credentials
export async function verifyCredentials(
  username: string,
  password: string
): Promise<AdminUser | null> {
  try {
    const [users] = await db.execute<any[]>(
      'SELECT id, username, email, password, full_name FROM admin_users WHERE username = ? AND is_active = TRUE',
      [username]
    );

    if (!users || users.length === 0) {
      return null;
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    // Update last login
    await db.execute('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [
      user.id,
    ]);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
    };
  } catch (error) {
    console.error('Credential verification error:', error);
    return null;
  }
}

// Destroy session
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (sessionToken) {
      await db.execute('DELETE FROM admin_sessions WHERE session_token = ?', [
        sessionToken,
      ]);
    }

    cookieStore.delete('admin_session');
  } catch (error) {
    console.error('Session destruction error:', error);
  }
}

// Middleware helper to require authentication
export async function requireAuth(): Promise<AdminUser> {
  const user = await getSession();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

// ============================================
// USER AUTHENTICATION (Normal Users)
// ============================================

export interface User {
  id: number;
  full_name: string;
  email: string;
}

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
}

// Register new user
export async function registerUser(
  fullName: string,
  email: string,
  password: string
): Promise<User | null> {
  try {
    // Check if user already exists
    const [existingUsers] = await db.execute<any[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers && existingUsers.length > 0) {
      return null; // User already exists
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const result = await db.execute(
      'INSERT INTO users (full_name, email, password_hash, status) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, 'active']
    );

    const userId = (result as any)[0].insertId;

    return {
      id: userId,
      full_name: fullName,
      email: email,
    };
  } catch (error) {
    console.error('User registration error:', error);
    return null;
  }
}

// User login
export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const [users] = await db.execute<any[]>(
      'SELECT id, full_name, email, password_hash FROM users WHERE email = ? AND status = ?',
      [email, 'active']
    );

    if (!users || users.length === 0) {
      return null;
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    };
  } catch (error) {
    console.error('User login error:', error);
    return null;
  }
}

// Create user session
export async function createUserSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  await db.execute(
    'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
    [userId, sessionToken, expiresAt]
  );

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set('user_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return sessionToken;
}

// Get user session
export async function getUserSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('user_session')?.value;

    if (!sessionToken) {
      return null;
    }

    const [sessions] = await db.execute<any[]>(
      `SELECT u.id, u.full_name, u.email 
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = ? AND s.expires_at > NOW() AND u.status = ?`,
      [sessionToken, 'active']
    );

    if (!sessions || sessions.length === 0) {
      return null;
    }

    const user = sessions[0];
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    };
  } catch (error) {
    console.error('User session verification error:', error);
    return null;
  }
}

// Destroy user session
export async function destroyUserSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('user_session')?.value;

    if (sessionToken) {
      await db.execute('DELETE FROM user_sessions WHERE session_token = ?', [
        sessionToken,
      ]);
    }

    cookieStore.delete('user_session');
  } catch (error) {
    console.error('User session destruction error:', error);
  }
}

// ============================================
// EMPLOYEE AUTHENTICATION
// ============================================

// Create employee
export async function createEmployee(
  fullName: string,
  email: string,
  password: string,
  role: string = 'employee'
): Promise<Employee | null> {
  try {
    // Check if email already exists
    const [existingEmps] = await db.execute<any[]>(
      'SELECT id FROM employees WHERE email = ?',
      [email]
    );

    if (existingEmps && existingEmps.length > 0) {
      return null;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create employee
    const result = await db.execute(
      'INSERT INTO employees (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, passwordHash, role, true]
    );

    const empId = (result as any)[0].insertId;

    return {
      id: empId,
      full_name: fullName,
      email: email,
      role: role,
      is_active: true,
      last_login: null,
    };
  } catch (error) {
    console.error('Employee creation error:', error);
    return null;
  }
}

// Employee login
export async function loginEmployee(
  email: string,
  password: string
): Promise<Employee | null> {
  try {
    const [employees] = await db.execute<any[]>(
      'SELECT id, full_name, email, password_hash, role, is_active, last_login FROM employees WHERE email = ? AND is_active = ?',
      [email, true]
    );

    if (!employees || employees.length === 0) {
      return null;
    }

    const employee = employees[0];
    const isValid = await bcrypt.compare(password, employee.password_hash);

    if (!isValid) {
      return null;
    }

    // Update last login
    await db.execute('UPDATE employees SET last_login = NOW() WHERE id = ?', [
      employee.id,
    ]);

    return {
      id: employee.id,
      full_name: employee.full_name,
      email: employee.email,
      role: employee.role,
      is_active: employee.is_active,
      last_login: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Employee login error:', error);
    return null;
  }
}

// Create employee session
export async function createEmployeeSession(employeeId: number): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  await db.execute(
    'INSERT INTO employee_sessions (employee_id, session_token, expires_at) VALUES (?, ?, ?)',
    [employeeId, sessionToken, expiresAt]
  );

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set('employee_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return sessionToken;
}

// Get employee session
export async function getEmployeeSession(): Promise<Employee | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('employee_session')?.value;

    if (!sessionToken) {
      return null;
    }

    const [sessions] = await db.execute<any[]>(
      `SELECT e.id, e.full_name, e.email, e.role, e.is_active, e.last_login
       FROM employee_sessions s
       JOIN employees e ON s.employee_id = e.id
       WHERE s.session_token = ? AND s.expires_at > NOW() AND e.is_active = ?`,
      [sessionToken, true]
    );

    if (!sessions || sessions.length === 0) {
      return null;
    }

    const employee = sessions[0];
    return {
      id: employee.id,
      full_name: employee.full_name,
      email: employee.email,
      role: employee.role,
      is_active: employee.is_active,
      last_login: employee.last_login,
    };
  } catch (error) {
    console.error('Employee session verification error:', error);
    return null;
  }
}

// Destroy employee session
export async function destroyEmployeeSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('employee_session')?.value;

    if (sessionToken) {
      await db.execute('DELETE FROM employee_sessions WHERE session_token = ?', [
        sessionToken,
      ]);
    }

    cookieStore.delete('employee_session');
  } catch (error) {
    console.error('Employee session destruction error:', error);
  }
}

// Get all employees
export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const [employees] = await db.execute<any[]>(
      'SELECT id, full_name, email, role, is_active, last_login FROM employees ORDER BY created_at DESC'
    );

    return employees || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

// Get employee by ID
export async function getEmployeeById(id: number): Promise<Employee | null> {
  try {
    const [employees] = await db.execute<any[]>(
      'SELECT id, full_name, email, role, is_active, last_login FROM employees WHERE id = ?',
      [id]
    );

    if (!employees || employees.length === 0) {
      return null;
    }

    return employees[0];
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
}

// Update employee
export async function updateEmployee(
  id: number,
  fullName?: string,
  role?: string,
  isActive?: boolean
): Promise<Employee | null> {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (fullName !== undefined) {
      updates.push('full_name = ?');
      values.push(fullName);
    }

    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }

    if (isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(isActive);
    }

    if (updates.length === 0) {
      return getEmployeeById(id);
    }

    values.push(id);
    const query = `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`;
    await db.execute(query, values);

    return getEmployeeById(id);
  } catch (error) {
    console.error('Error updating employee:', error);
    return null;
  }
}

// Delete employee
export async function deleteEmployee(id: number): Promise<boolean> {
  try {
    await db.execute('DELETE FROM employees WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
}
