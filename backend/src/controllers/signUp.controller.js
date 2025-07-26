import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js"
import { User } from "../models/User.model.js";

const signUpController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        throw new ApiError(501, "all field are required")

    }
    const existingUserWithEmail = await User.findOne({
        email
    })


    if (existingUserWithEmail) {
        throw new ApiError(409, "user exist with the provided email!")
    }
    const existingUserWithUsername = await User.findOne({
        username
    })
    if (existingUserWithUsername) {
        throw new ApiError(409, "user exist with the provided username!")
    }


    const signUp = await User.create({
        username,
        email,
        password
    })
    
    res.status(201).json( new ApiResponse(201, signUp, "user created successfully"))
})

export { signUpController }