import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUserPayload } from '../types';
import { createError } from '../middleware/error';

const generateToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError('Email already registered', 400));
    }

    const user = await User.create({ name, email, password, role });

    const payload: IUserPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: payload,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(createError('Invalid credentials', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError('Invalid credentials', 401));
    }

    const payload: IUserPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: payload,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request & { user?: IUserPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return next(createError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
