import { db } from "../libs/db";
import type { Request, Response, NextFunction } from "express";
import { generateTokens } from "../utils/generateTokens";

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response> | void | Response;

export const register: RequestHandler = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }
    const hashedPassword = await Bun.password.hash(password);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken, refreshTokenExpiry } = generateTokens({
      id: newUser.id,
      email: newUser.email,
    });
    const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

    await db.user.update({
      where: { id: newUser.id },
      data: {
        refreshToken,
        refreshTokenExpiry,
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: refreshTokenMaxAge,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (e) {
    console.error("Error creating user:", e);
    res.status(500).json({ success: false, error: "Error creating user" });
    next(e);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        error: "No such user exists",
      });
    }

    const verifyPassword = await Bun.password.verify(
      password,
      existingUser.password,
    );
    if (!verifyPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken, refreshTokenExpiry } = generateTokens({
      id: existingUser.id,
      email: existingUser.email,
    });
    const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        refreshToken,
        refreshTokenExpiry,
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: refreshTokenMaxAge,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        image: existingUser.image,
      },
    });
  } catch (e) {
    console.error("Error logging in user:", e);
    res.status(500).json({
      success: false,
      error: "Error logging in user",
    });
    next(e);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (e) {
    console.error("Error logging out user:", e);
    res.status(204).json({
      success: false,
      message: "Error logging out user",
    });
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user: req.user,
    });
  } catch (e) {
    console.error("Error authenticating user", e);
  }
};

export const refreshTokens: RequestHandler = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const userId = req.user.id;

  if (!refreshToken) {
    return res.status(400).json({ error: "No valid refresh token" });
  }

  try {
    const { accessToken, refreshToken, refreshTokenExpiry } = generateTokens({
      id: userId,
    });
    const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

    await db.user.update({
      where: { id: userId },
      data: {
        refreshToken,
        refreshTokenExpiry,
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: refreshTokenMaxAge,
    });

    res
      .status(200)
      .json({ success: true, message: "Successfully refreshed tokens" });
  } catch (e) {
    console.log("Error while refreshing access token", e);
    return res.status(500).json({ error: "No valid refresh token" });
  }
};
