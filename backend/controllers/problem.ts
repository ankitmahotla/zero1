import type { NextFunction, Request, Response } from "express";
import { db } from "../libs/db";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0";

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response> | void | Response;

const createProblem: RequestHandler = async (req, res, next) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden access" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `${language} is not supported` });
      }

      const submissions = testcases.map(
        ({ input, output }: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }),
      );

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res: any) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.lenth; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

      const newProblem = await db.problem.create({
        data: {
          userId: req.user.id,
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Problem created",
        problem: newProblem,
      });
    }
  } catch (e) {
    console.error("Error creating new problem", e);
    return res
      .status(500)
      .json({ success: false, error: "Error creating new problem" });
  }
};

const getProblems: RequestHandler = async (req, res, next) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems || problems.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No Problems found",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "All problems fetched", problems });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      error: "Error fetching all problems",
    });
  }
};

const getProblem: RequestHandler = async (req, res, next) => {
  const problemId = req.params.id;
  try {
    const problem = await db.problem.findFirst({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "No such problem exists",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Fetched Problem", problem });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      error: "Error fetching problem",
    });
  }
};

const updateProblem: RequestHandler = async (req, res, next) => {
  const problemId = req.params.id;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden access" });
  }

  try {
    const problem = await db.problem.findFirst({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "No such problem exists",
      });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `${language} is not supported` });
      }

      const submissions = testcases.map(
        ({ input, output }: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }),
      );

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res: any) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.lenth; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

      const updatedProblem = await db.problem.update({
        where: {
          id: problemId,
        },
        data: {
          userId: req.user.id,
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Problem updated",
        problem: updatedProblem,
      });
    }
  } catch (e) {
    console.error("Error updating the problem", e);
    return res
      .status(500)
      .json({ success: false, error: "Error updating the problem" });
  }
};

const deleteProblem: RequestHandler = async (req, res, next) => {
  const problemId = req.params.id;
  try {
    const problem = await db.problem.findFirst({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "No such problem exists",
      });
    }

    await db.problem.delete({
      where: {
        id: problemId,
      },
    });

    res.status(200).json({ success: true, message: "Delete the problem" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      error: "Error deleting problem",
    });
  }
};

const getUserSolvedProblems: RequestHandler = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId,
          },
        },
      },
    });

    if (!problems) {
      return res.status(404).json({
        success: true,
        message: "No solved problems found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Solved problems fetched successfully",
      problems,
    });
  } catch (e) {
    console.error("Error while fetching solved problems", e);
    res.status(500).json({
      success: true,
      message: "Error while fetching solved problems",
    });
  }
};

export {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  deleteProblem,
  getUserSolvedProblems,
};
