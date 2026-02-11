import mongoose, { Schema, Document } from 'mongoose';


export interface documents  extends Document {
    sessionId: Schema.Types.ObjectId;
    subjectId: Schema.Types.ObjectId;
    topicId: Schema.Types.ObjectId;
    uploadedBy: Schema.Types.ObjectId;
    fileName:string;
    fileUrl:string;
    fileType: "pdf" | "docx" | "pptx" | "txt" | "csv" | "jpg" | "jpeg" | "png" | "gif" | "webp";
    size:number;
    folder?: string;
    createdAt: Date;
    updatedAt: Date;
}

const documentsSchema:Schema<documents> = new mongoose.Schema({
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
    uploadedBy:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
        required:[true,'Uploaded By is required'],
    },
    fileName:{
        type:String,
        required:[true,'File name is required']
    },
    fileUrl:{
        type:String,
        required:true
    },
    fileType:{
        type:String,
        enum:["pdf","docx","pptx","txt","csv","jpg","jpeg","png","gif","webp"],
        required:[true,'File type is required'],
    },
    size:{
        type:Number,
        required:true,
        min: [1, "File size must be greater than 0"], 
        max: [500 * 1024 * 1024, "File size must be less than 500MB"], 
    },
    folder: {
        type: String,
        default: null,
    },
    
},


{
    timestamps: true,
})

documentsSchema.index({ sessionId: 1, subjectId: 1, topicId: 1 });


const documentsModel =
    (mongoose.models.documents as mongoose.Model<documents>) ||
    mongoose.model<documents>('documents', documentsSchema);

export default documentsModel;