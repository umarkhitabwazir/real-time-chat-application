import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
const middleWare = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
console.log("Access Token:", accessToken);
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized");
    }



    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);

        req.user = decoded;
        req.token=accessToken;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
}

export default middleWare;