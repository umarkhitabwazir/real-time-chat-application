import mongoose from "mongoose";
import {User} from '../models/User.model.js';
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Message } from "../models/message.model.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import {Buffer} from "buffer";

const sendMessageController = asyncHandler(async (req, res) => {
    const { receiverUsername,capturedImage, message } = req.body;
    const userId = req.user;
const base64=capturedImage
let cameraCaptureBuffer
if (base64) {
    cameraCaptureBuffer=Buffer.from(base64, 'base64')
}
    const fileBuffer = req.file?.buffer
    console.log('File buffer:', fileBuffer);

    let uploadFile
    if (fileBuffer) {
        uploadFile = await uploadImageToCloudinary(fileBuffer)
    }
    if (cameraCaptureBuffer) {
        uploadFile = await uploadImageToCloudinary(cameraCaptureBuffer)
        console.log('uploadFile:', uploadFile);
        
    }

    if (!receiverUsername) {
        throw new ApiError(400, "Receiver username is required.");
    }
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const objectId = new mongoose.Types.ObjectId(userId.id);

    const user = await User.findById(objectId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const receiver = await User.findOne({ username: receiverUsername });
    if (!receiver) {
        throw new ApiError(404, "user not found");
    }
    if (receiver._id.toString() === userId.id) {
        throw new ApiError(400, "You cannot send a message to yourself.");
    }

    const newMessage = {
        sender: user._id,
        receiver: receiver._id,
        content: message,
        messageType: "text",
        image: fileBuffer || cameraCaptureBuffer ? uploadFile.secure_url : '',
    };

    const createMessage = await Message.create(newMessage);
    if (!createMessage) {
        throw new ApiError(500, "Failed to send message");
    }
    const messageData = await Message.findById(createMessage._id)
        .populate("sender", "username avatar")
        .populate("receiver", "username avatar");



    res.status(200).json(new ApiResponse(200, messageData, "Message sent successfully"));
});

export { sendMessageController };