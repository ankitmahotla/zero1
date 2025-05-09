import type { NextFunction, Request, Response } from "express";
import { db } from "../libs/db";

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response> | void | Response;

export const getPlaylists: RequestHandler = async (req, res, next) => {};
