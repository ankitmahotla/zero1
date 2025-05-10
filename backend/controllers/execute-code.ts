import type { NextFunction, Request, Response } from "express";
import { db } from "../libs/db";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0";

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response> | void | Response;

export const executeCode: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      source_code,
      language_id,
      stdin,
      expected_outputs,
      problemId,
    }: {
      source_code: string;
      language_id: number;
      stdin: string[];
      expected_outputs: string[];
      problemId: string;
    } = req.body;

    const userId = req.user.id;

    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    // Prepare each test case for Judge0 batch submission
    const submissions = stdin.map((input: string) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // Send batch of submissions to Judge0
    const submitResponse: any[] = await submitBatch(submissions);

    const tokens: string[] = submitResponse.map((res: any) => res.token);

    // Poll Judge0 for results of all submitted test cases
    const results: any[] = await pollBatchResults(tokens);

    // Analyze test case results
    let allPassed = true;
    const detailedResults = results.map((result: any, i: number) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status?.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    // Store submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id) ?? "",
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r: any) => r.stdout)),
        stderr: detailedResults.some((r: any) => r.stderr)
          ? JSON.stringify(detailedResults.map((r: any) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r: any) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r: any) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r: any) => r.memory)
          ? JSON.stringify(detailedResults.map((r: any) => r.memory))
          : null,
        time: detailedResults.some((r: any) => r.time)
          ? JSON.stringify(detailedResults.map((r: any) => r.time))
          : null,
      },
    });

    // If allPassed, mark problem as solved for the current user
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // Save individual test case results
    const testCaseResults = detailedResults.map((result: any) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Code Executed! Successfully!",
      submission: submissionWithTestCase,
    });
  } catch (error: any) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
};
