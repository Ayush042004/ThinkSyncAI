import mongoose, { Schema, Document } from 'mongoose';

export interface Quiz  extends Document {
    sessionId: Schema.Types.ObjectId;
    topicId:Schema.Types.ObjectId;
    documentId:Schema.Types.ObjectId;
    title?:String;
    questions:[{
        question: String;
        options: String[];
        answer: String;
    }];
    createdBy:Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const QuizSchema:Schema<Quiz> = new mongoose.Schema({
    sessionId:{
        type:Schema.Types.ObjectId,
        ref:'Session',
        required:[true,'Session Id is required']
    },
    topicId:{
        type:Schema.Types.ObjectId,
        ref:'Topic',
        required:[true,'Topic Id is required']
    },
    documentId:{
        type:Schema.Types.ObjectId,
        ref:'documents',
        required:[true,'Document Id is required']
    },
    title:{
        type:String,
        required:true
    },
    questions:{
        type:[  {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            answer: { type: String, required: true }
          }],
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
        required:true

    }
},
{
    timestamps: true,
})

export default mongoose.model<Quiz>('quiz',QuizSchema);