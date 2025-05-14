import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const generateAccessAndRefereshTokens = async (user) => {
    try {
        const token = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { token, refreshToken };
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

    const { token, refreshToken } = await generateAccessAndRefereshTokens(user);

    res.
        cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"

        }).
        cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }).
        status(200).json(new ApiResponse(200, user));
})


export { longinUser, generateAccessAndRefereshTokens };