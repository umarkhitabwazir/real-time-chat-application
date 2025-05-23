import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";
const getLoggedInUser = asyncHandler(async (req, res) => {
    const userId = req.user;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const objectId=new mongoose.Types.ObjectId(userId)
    const user = await User.findById(objectId).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
})

export default getLoggedInUser;