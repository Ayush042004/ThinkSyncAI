import mongoose, { Schema, Document } from 'mongoose';

export interface Session extends Document {
    name: string;
    code: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    creator: Schema.Types.ObjectId;
    members: Schema.Types.ObjectId[];
    messages: Schema.Types.ObjectId[];
    documents: Schema.Types.ObjectId[];
    summary: Schema.Types.ObjectId[];
    quizzes: Schema.Types.ObjectId[];
}

const SessionSchema: Schema<Session> = new mongoose.Schema({    
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    code: {
        type: String,
        required: [true, 'Code is required'],
        unique: true,
    },
    description: {
        type: String,
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message',
        default: [],
    },
    documents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Document',
        default: [],
    },
    summary: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Summary',
        default: [],
    },
    quizzes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz',
        default: [],
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required'],
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
},
{
    timestamps: true,
}
)          

const SessionModel =
    (mongoose.models.Session as mongoose.Model<Session>) ||
    mongoose.model<Session>('Session', SessionSchema);

export default SessionModel;