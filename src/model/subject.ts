import mongoose, { Schema, Document } from 'mongoose';

export interface Subject extends Document {
    name:string;
    sessionId:Schema.Types.ObjectId;
    description?:string;
}

const subjectSchema:Schema<Subject> = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'subject name is required']
    },
    sessionId:{
        type:Schema.Types.ObjectId,
        ref:'Session',
        required:[true,'Session Id is required']
    },
    description:{
        type:String,
    }

})

export default mongoose.model<Subject>('Subject',subjectSchema);