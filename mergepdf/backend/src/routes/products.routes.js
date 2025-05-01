import express from "express";
import mergePdf from "../controllers/mergePdf.controllers.js";

const router = express.Router();

// Route with no Multer logic here
router.post("/mergepdf", mergePdf);

export default router;
