import mongoose, { Schema, Document } from 'mongoose';

export interface Summary extends Document {
    documentId:Schema.Types.ObjectId;
    summaryText:string;
    generatedBy:Schema.Types.ObjectId;
    tokensUsed:number;
    createdAt: Date;
    updatedAt: Date;
}

const summarySchema:Schema<Summary> = new mongoose.Schema({
    documentId:{
        type:Schema.Types.ObjectId,
        ref:'document',
        required:[true,'Document Id is required']
    },
    summaryText:{
        type:String,
        required:true
    },
    generatedBy:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
        required:true
    },
    tokensUsed:{
        type:Number
    }
},
{
    timestamps: true,
})

export default mongoose.model<Summary>('summary',summarySchema)

