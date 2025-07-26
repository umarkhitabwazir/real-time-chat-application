import mongoose from 'mongoose';
import { User } from '../models/User.model.js';
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

const updateUserInfoController = asyncHandler(async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }
        const objectId = new mongoose.Types.ObjectId(userId.id);

        const localFile = req.file;
        let uploadFile

        const user = await User.findById(objectId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const avatarUrl = user.avatar;
        const deleteAvatarFromCloudinary = async (avatarUrl) => {
            if (avatarUrl) {
                const publicId = avatarUrl.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(publicId, { resource_type: 'image' });
            }
        }
        if (uploadFile && avatarUrl) {
            await deleteAvatarFromCloudinary(avatarUrl);
        }
        if (localFile) {
            uploadFile = await uploadImageToCloudinary(localFile.buffer);
        }

        const updatedUser = await User.findByIdAndUpdate(
            objectId,
            { avatar: uploadFile ? uploadFile.secure_url : '' },
        )

        if (uploadFile) {
            console.log('uploadFile is present:', uploadFile);

        }

        if (!updatedUser) {
            throw new ApiError(404, "User not found");
        }

        res.status(200).json(new ApiResponse(200, updatedUser, "User info updated successfully"));
    } catch (error) {
        console.error('Error updating user info:', error);
        throw new ApiError(500, "Internal server error");
    }
}
)

export { updateUserInfoController };