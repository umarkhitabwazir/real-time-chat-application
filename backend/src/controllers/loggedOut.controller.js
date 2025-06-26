 import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import  {asyncHandler} from '../utils/AsyncHandler.js';
 const loggedOutController = asyncHandler(async (req, res) => {
    const user  = req.token;
    if (!user) {
        throw new ApiError(401,'Unauthorized') 
    }
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
   res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));

 })
 export { loggedOutController };