import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Router handler
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1, // max how many files accepted
    },
    {
      name: "coverImage",
      maxCount: 1, // max how many field accepted
    },
  ]),
  registerUser
);

// NOT-secured routes
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

//export
export default router;
