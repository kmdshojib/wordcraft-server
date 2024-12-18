import { Router } from "express";
import { registerUser, getAllUsersExceptLoggedIn, loginUser, updateUserRole, } from "../controllers/auth.controller";

const router = Router();

router.route("/register").post(

    registerUser
);
router.get("/getUsers/:id", getAllUsersExceptLoggedIn)
router.put("/updateRole", updateUserRole)
router.route("/login").post(loginUser)

export default router;