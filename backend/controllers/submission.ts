import type { NextFunction, Request, Response } from "express";
import { db } from "../libs/db";

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response> | void | Response;

export const getSubmissions: RequestHandler = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const submissions = await db.submission.findMany({
      where: {
        userId,
      },
    });

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No submissions are there for this user",
      });
    }

    res.status(200).json({
      success: true,
      submissions,
      message: "Submissions fetched successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      error: "Error while fetching submissions",
    });
  }
};

export const getMySubmissionsByProblemId: RequestHandler = async (
  req,
  res,
  next,
) => {
  const userId = req.user.id;
  const problemId = req.params.id;

  if (!problemId) {
    return res.status(400).json({
      success: false,
      error: "No problem id provided",
    });
  }
  try {
    const submissions = await db.submission.findMany({
      where: {
        problemId,
        userId,
      },
    });

    if (!submissions) {
      return res.status(404).json({
        success: false,
        error: "No submission found",
      });
    }

    res.status(200).json({
      success: true,
      submissions,
      message: "Submissions fetched successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      error: "Error while fetching submissions",
    });
  }
};

export const getSubmissionsCount: RequestHandler = async (req, res, next) => {
  const problemId = req.params.id;

  if (!problemId) {
    return res.status(400).json({
      success: false,
      error: "No problem id provided",
    });
  }
  try {
    const submissions = await db.submission.count({
      where: {
        problemId,
      },
    });

    if (!submissions) {
      return res.status(404).json({
        success: false,
        error: "No submission found",
      });
    }

    res.status(200).json({
      success: true,
      count: submissions,
      message: "Submissions count successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      error: "Error while fetching the submission count",
    });
  }
};
