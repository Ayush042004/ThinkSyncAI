import mongoose, { Schema, Document } from 'mongoose';

export interface Topic extends Document {
    subjectId:Schema.Types.ObjectId;
    name:string;
    order:number;
}

const topicSchema:Schema<Topic> = new mongoose.Schema({
    subjectId:{
        type:Schema.Types.ObjectId,
        ref:'Subject',
    },
    name:{
        type:String,
        required:[true,'Topic name is required']
    },
    order:{
        type:Number,
        default:0,
    
    }
});
export default mongoose.model<Topic>('Topic',topicSchema);