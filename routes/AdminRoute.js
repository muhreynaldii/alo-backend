import express from "express";

import {
  getAdmin,
  Register,
  Login,
  Logout,
} from "../controller/AdminController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";

const router = express.Router();

router.get("/admin", verifyToken, getAdmin);
router.post("/admin", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
