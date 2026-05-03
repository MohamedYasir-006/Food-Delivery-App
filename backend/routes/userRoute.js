import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import userModel from "../models/userModel.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// 🔒 Protected route
userRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("-password");

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default userRouter;