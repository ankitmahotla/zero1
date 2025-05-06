import type { NextFunction, Request, Response } from "express";
import { db } from "../libs/db";
import { getLanguageId, pollBatchResults, submitBatch } from "../libs/judge0";

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
      const languageId = getLanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
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

      return res.status(201).json(newProblem);
    }
  } catch (e) {
    console.error("Error creating new problem", e);
    return res.status(500).json({ error: "Error creating new problem" });
  }
};
const getProblems: RequestHandler = async (req, res, next) => {};
const getProblem: RequestHandler = async (req, res, next) => {};
const updateProblem: RequestHandler = async (req, res, next) => {};
const deleteProblem: RequestHandler = async (req, res, next) => {};
const getUserSolvedProblems: RequestHandler = async (req, res, next) => {};

export {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  deleteProblem,
  getUserSolvedProblems,
};
