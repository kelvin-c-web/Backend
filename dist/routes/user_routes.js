import { Router } from "express";
import { getAllUsers, userLogout, userSignup, verifyUser } from "../controllers/user_controllers.js";
import { signupValidator, validate, loginValidator } from "../utils/validators.js";
import { verifyToken } from "../utils/token_manger.js";
const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator)); //userLogin
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);
export default userRoutes;
//# sourceMappingURL=user_routes.js.map