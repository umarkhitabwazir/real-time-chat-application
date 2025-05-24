import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import dotenv from "dotenv";
dotenv.config({
    path: ".env"
});

const generateAccessAndRefereshTokens = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Token generation failed");

    }

}

const longinUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const plainPass = password;
    const isMatch = await user.comparePassword(plainPass);

    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);
    const isProduction = process.env.NODE_ENV === "production";
    console.log("sameSite", isProduction ? "None" : "lax");
    console.log("secure", isProduction ? true : false);


    const options = {
        httpOnly: true,
        // sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
        sameSite: "None",
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,

    }
    res.
        cookie("refreshToken", refreshToken, options).
        cookie("accessToken", accessToken, options).
        status(200).json(new ApiResponse(200, user));
})


export { longinUser, generateAccessAndRefereshTokens };