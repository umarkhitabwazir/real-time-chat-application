import { ApiError } from "./api-error.js";

const generateAccessAndRefereshTokens = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        console.log('accessToken',accessToken)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating access token:", error);
        throw  new ApiError(401,"Token generation failed");

    }

}
export default generateAccessAndRefereshTokens