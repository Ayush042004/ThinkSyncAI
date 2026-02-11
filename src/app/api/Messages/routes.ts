
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import  Message  from "@/model/message";
import { success } from "zod";



//create all the messages and get all the messages 
//update and delete messages also
//sessionId se senderId nikalni hai then aage ka kaam hoga

export async function POST(request:NextRequest){
const db = await dbConnect()
const session = await getServerSession(authOptions)
//agar session nhi mila ya fir session se user nhi mila then the user is not authenticated
if(!session||!session.user){
return NextResponse.json({
    success:false , message:"User not authenticated kindly login"
},{status:400})
}
//senderid aur koi nhi user id hi toh hai jo humme session se nikalni hai
const senderId = (session.user)._id
 const MessageTypes = ["text","image","file"]
try {
    const {sessionId , content , messageType = "text" , fileUrl=null , fileName=null} = await request.json()
    if (sessionId) {
        return NextResponse.json({
            success:false , message:"SessionId not found"
        })
    }
    
    if (!content) {
         return NextResponse.json({
            success:false , message:"cannot send Empty Messsage"
        })
    }

    if (!content.includes(MessageTypes)) {
        return NextResponse.json({
            success:false , message:"cannot send this type of message"
        })
    }

    const msg = await Message.create({
     sessionId,
      senderId,
      content: content ?? "",
      messageType,
      fileUrl,
      fileName,
    })

     return NextResponse.json({ success: true, message: "Message created", msg }, { status: 201 });
    
} catch (error) {
    return NextResponse.json({
        success:false , message:"Error"
    },{status:401})
}
}


export async function GET(request:NextRequest){
   await dbConnect();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ success: false, message: "Missing sessionId" }, { status: 400 });
  
  }
  try {
    const findMessage = await Message.findById({sessionId}).populate("senderId", "username")
  } catch (error) {
    console.error("GET /api/Messages error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }


}


export async function PUT(request:NextRequest){

}

export async function DELETE(request:NextRequest){

}