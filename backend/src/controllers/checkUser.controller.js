import {asyncHandler} from '../utils/AsyncHandler.js';
import {User} from '../models/user.model.js';
import {ApiError} from '../utils/api-error.js';
import {ApiResponse} from '../utils/api-response.js';
const checkUser=asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.find({username: username}).select('-password');
    if (user.length===0) {
       throw new ApiError(404, 'User not found');

    }
    
    res.status(200).json(new ApiResponse(200, user,'User found'));
})
export {checkUser}