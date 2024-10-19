import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function register(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Start a transaction
    await db.query('BEGIN');

    // Insert the user
    const userResult = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );
    const userId = userResult.rows[0].id;

    // Always insert into user_profiles, default role to 'user'
    await db.query(
      'INSERT INTO user_profiles (user_id, role) VALUES ($1, $2)',
      [userId, 'user']
    );

    // Commit the transaction
    await db.query('COMMIT');

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    return { userId, token };
  } catch (error) {
    // If there's an error, roll back the transaction
    await db.query('ROLLBACK');
    console.error('Error registering user:', error);
    return null;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const result = await db.query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return null;
    }
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { userId: user.id, token };
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
}

export function authMiddleware(handler: Function) {
  return async (req: NextRequest, res: NextResponse) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      // @ts-ignore
      req.user = { userId: decoded.userId };
      return handler(req, res);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}

export async function checkSubscriptionStatus(userId: number): Promise<boolean> {
  try {
    const result = await db.query(
      'SELECT subscription_status FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return false;
    }
    const status = result.rows[0].subscription_status;
    return status === 'active' || status === 'trialing';
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

export function paidFeatureMiddleware(handler: Function) {
  return authMiddleware(async (req: NextRequest, res: NextResponse) => {
    // @ts-ignore
    const userId = req.user.userId;
    const hasActiveSubscription = await checkSubscriptionStatus(userId);
    if (!hasActiveSubscription) {
      return NextResponse.json({ error: 'Active subscription required for this feature' }, { status: 403 });
    }
    return handler(req, res);
  });
}


export const creatorMiddleware = authMiddleware;
export const verifyToken = authMiddleware;

export async function updateUserRole(userId: number, role: 'user' | 'creator') {
  try {
    await db.query(
      'UPDATE user_profiles SET role = $1 WHERE user_id = $2',
      [role, userId]
    );
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}
