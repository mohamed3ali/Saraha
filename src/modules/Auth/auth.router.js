import { Router } from "express";
import * as authController from "./controller/auth.js";
import * as validators from "./auth.validation.js";
import validation from "../../middleware/validation.js";
const router = Router();

router.get("/", authController.getAuthModule);
router.post(
  "/signup",
  validation(validators.signupSchema),
  authController.signup
);
router.get("/confirmEmail/:token", authController.confirmEmail);
router.get("/newConfirmEmail/:token", authController.newConfirmEmail);

router.post("/login", validation(validators.loginSchema), authController.login);
export default router;
