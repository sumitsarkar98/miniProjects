import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Retrieve token from cookies or headers
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim(); // Trim space after "Bearer"

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user and exclude sensitive fields
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid ACCESS TOKEN");
    }

    // Attach user info to request
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid ACCESS TOKEN");
  }
});
