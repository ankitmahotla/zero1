import { Router } from "express";
import type { RequestHandler } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth";
import {
  createProblem,
  deleteProblem,
  getProblem,
  getProblems,
  getUserSolvedProblems,
  updateProblem,
} from "../controllers/problem";

const router = Router();

const asHandler = (fn: unknown): RequestHandler => fn as RequestHandler;

router.post(
  "/create",
  asHandler(authMiddleware),
  asHandler(checkAdmin),
  asHandler(createProblem),
);
router.post("/", asHandler(authMiddleware), asHandler(getProblems));
router.post("/:id", asHandler(authMiddleware), asHandler(getProblem));
router.put(
  "/:id",
  asHandler(authMiddleware),
  asHandler(checkAdmin),
  asHandler(updateProblem),
);
router.delete(
  "/:id",
  asHandler(authMiddleware),
  asHandler(checkAdmin),
  asHandler(deleteProblem),
);
router.post(
  "/user-solved",
  asHandler(authMiddleware),
  asHandler(getUserSolvedProblems),
);

export default router;
