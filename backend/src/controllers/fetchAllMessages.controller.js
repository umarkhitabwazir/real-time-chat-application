import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/api-response.js";

const fetchAllMessagesController = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user;
   
    if (!loggedInUserId) {
        throw new ApiError(401, "Unauthorized");
    }
  
    
   
    const objectId = new mongoose.Types.ObjectId(loggedInUserId.id);

    const allMessages = await Message.find({
        $or: [
            { sender: objectId },
        { receiver: objectId },
     
        ],
    })
        .populate("sender", "username avatar")
        .populate("receiver", "username avatar") ;
    if (!allMessages) {
        throw new ApiError(404, "No messages found");
    }


    res.status(200).json(new ApiResponse(200, allMessages, "Messages fetched successfully"));
})

export default fetchAllMessagesController;