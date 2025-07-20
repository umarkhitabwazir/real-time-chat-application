import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const deleteMessageForMeController = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user;
    const objectId=new mongoose.Types.ObjectId(userId.id);
console.log('userId', userId.id);
    if (!messageId || !userId) {
        throw new ApiError(400, "Message ID and User ID are required");
    }

    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }
console.log('deleteFor', message.deletedFor);
    if (!message.deletedFor.includes(objectId)) {
        await message.updateOne({  $addToSet: { deletedFor:objectId } });
    }

    res.status(200).json(new ApiResponse(200, null, "Message deleted for me successfully"));
})

export { deleteMessageForMeController };