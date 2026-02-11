import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    role: "creator" | "member" | "unassigned";
    sessionsJoined: Schema.Types.ObjectId[];
    sessionsCreated: Schema.Types.ObjectId[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [32, 'Password must be less than 32 characters long'],
    },
    avatar: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ["creator", "member","unassigned"],
        default: "unassigned",
    },
    sessionsJoined: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Session',
        default: [],
    },
    sessionsCreated: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Session',
        default: [],
    },
},
{
    timestamps: true,
}
)

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('UserModel', UserSchema);

export default UserModel;