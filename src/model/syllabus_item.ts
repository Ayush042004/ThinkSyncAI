import mongoose, { Schema, Document } from 'mongoose';


export interface Syllabus  extends Document {
    sessionId:Schema.Types.ObjectId,
    subjectId:Schema.Types.ObjectId,
    topicId:Schema.Types.ObjectId;
    description:string;
    order:Number;
    status?:"pending"|"in-progress"|"completed",
    updatedBy:Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const syllabusSchema:Schema<Syllabus> = new mongoose.Schema({
    sessionId:{
        type:Schema.Types.ObjectId,
        ref:'Session',
        required:[true,'Session Id is required'],
    },
    subjectId:{
        type:Schema.Types.ObjectId,
        ref:'Subject',
        required:[true,'Subject Id is required'],
    },
    topicId:{
        type:Schema.Types.ObjectId,
        ref:'Topic',
        required:[true,'Topic Id is required'],
    },
    description:{
        type:String,

    },
    order:{
        type:Number
    },
    status:{
        type:String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'UserModel'
    }
},
{
    timestamps: true,
})

const syllabusModel =
    (mongoose.models.Syllabus as mongoose.Model<Syllabus>) ||
    mongoose.model<Syllabus>('Syllabus', syllabusSchema);

export default syllabusModel;