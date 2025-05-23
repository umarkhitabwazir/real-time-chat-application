import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({
    path: ".env"
})

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        refreshToken: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'away'],
            default: 'offline',
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        socketId: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
)

UserSchema.pre("save", async function (next) {
    const user = this
    if (!user.isModified("password")) return next()
    user.password = bcrypt.hashSync(user.password, 10)
    next()
})

UserSchema.methods.comparePassword = async function (plainPass) {
   return await bcrypt.compare(plainPass, this.password)
}

UserSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    )
}

UserSchema.methods.generateRefreshToken =async function(){
    return jwt.sign({id:this._id},
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN})
}

export  const User = mongoose.model('User', UserSchema)