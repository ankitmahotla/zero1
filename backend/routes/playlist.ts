import { Router } from "express";
import type { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getUserPlaylists,
  removeProblemFromPlaylist,
} from "../controllers/playlist";

const router = Router();

const asHandler = (fn: unknown): RequestHandler => fn as RequestHandler;

router.get("/", asHandler(authMiddleware), asHandler(getUserPlaylists));

router.get("/:playlistId", asHandler(authMiddleware), asHandler(getPlaylist));

router.post("/create", asHandler(authMiddleware), asHandler(createPlaylist));

router.post(
  "/:playlistId/add",
  asHandler(authMiddleware),
  asHandler(addProblemToPlaylist),
);

router.delete(
  "/:playlistId",
  asHandler(authMiddleware),
  asHandler(deletePlaylist),
);

router.delete(
  "/:playlistId/remove",
  asHandler(authMiddleware),
  asHandler(removeProblemFromPlaylist),
);

export default router;
