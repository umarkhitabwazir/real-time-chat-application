import { asyncHandler } from "../utils/AsyncHandler.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const deleteMessageForEveryOneController = asyncHandler(async (req, res) => {
    const { messageId } = req.params;


    if (!messageId ) {
        throw new ApiError(400, "Message ID is required")

    }

    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found")

    }
 
  
    if (!message.deleteForEveryone) {
        await message.updateOne({ deleteForEveryone: true });
    }
  
    res.status(200).json(new ApiResponse(200, message, "Message deleted successfully"));
});

export { deleteMessageForEveryOneController };