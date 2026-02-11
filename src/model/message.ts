import mongoose, { Schema, Document } from 'mongoose';


export interface Message extends Document {
sessionId:Schema.Types.ObjectId;
senderId:Schema.Types.ObjectId;
content:string;
messageType?:"text" | "image" | "file";
fileUrl?:string;
fileName?:string;
createdAt: Date;
updatedAt: Date;
}


const MessageSchema:Schema<Message> = new mongoose.Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref:"Session",
        required:[true,'Session Id is required']
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"UserModel",
        required:[true,'Sender Id is required']
    },
    content:{
        type:String,
        required: true,
        default: ''
    },
    messageType:{
        type:String,
        enum:["text","image","file"],
        default:"text"
    },
    fileUrl:{
        type:String,
        default:null
    },
    fileName:{
        type:String,
        default:null
    }

},
{
    timestamps: true,
})
MessageSchema.index({ sessionId: 1, createdAt: -1 });


const messageModel =
    (mongoose.models.Message as mongoose.Model<Message>) ||
    mongoose.model<Message>('Message', MessageSchema);

export default messageModel;