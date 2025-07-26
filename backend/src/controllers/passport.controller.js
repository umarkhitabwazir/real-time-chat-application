  import { asyncHandler } from "../utils/AsyncHandler.js";
import generateAccessAndRefereshTokens from "../utils/generateAccessToken.utils.js";
  
  
  const passportController= asyncHandler(async (req, res) => {
  if (!req.user) {
throw new ApiError(401,"Unauthorized")
  }
  console.log('user in goole ',req.user)
  const { accessToken, refreshToken } =await generateAccessAndRefereshTokens(req.user);
console.log('refreshToken ingoogle/callback',refreshToken)
console.log('accessToken ingoogle/callback',accessToken)
    const options = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)      
      .redirect(process.env.origin + "/api/chat");
  })

  export {passportController}