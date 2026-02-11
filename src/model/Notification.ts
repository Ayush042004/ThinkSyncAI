import mongoose, { Schema, Document } from "mongoose";

export interface Notification extends Document {
  userId: Schema.Types.ObjectId; 
  sessionId: Schema.Types.ObjectId; 
  type: "system" | "message" | "document" | "quiz" | "syllabus" | "summary";
  message: string;
  subjectId?: Schema.Types.ObjectId; 
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema<Notification> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
    type: {
      type: String,
      enum: ["system", "message", "document", "quiz", "syllabus", "summary"],
      required: true,
    },
    
    message: {
      type: String,
      required: true,
    },
    
    subjectId: {
      type: Schema.Types.ObjectId,
      default: null, 
      ref:"Subject"
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<Notification>) ||
  mongoose.model<Notification>("Notification", NotificationSchema);

export default NotificationModel;
