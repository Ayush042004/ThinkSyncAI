





//for notification also we will have the same thing 1st create the notification and get the notification and delete the notification
//for creating the notification we will first check whether the user is authenticated or not
//if authenticated he will recieve the notification
//sessionId chaiye 
//

import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import  Notification  from "@/model/Notification";

//create a notification
export async function POST(request: NextRequest){
await dbConnect()
try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user)?._id;
    const { type, message, sessionId = null, subjectId = null } = await request.json();
    if(!userId||!type||!message){
        return NextResponse.json({success:false,message:"missing required fields"})

    }

    const notification = await Notification.create({
      userId,
      sessionId,
      type,
      message,
      subjectId,
      read: false,
    })

    return NextResponse.json({success:true,notification:notification},{status:201})


} catch (error) {
    console.error("POST /api/Notification error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
}
}


//get a notification

export async function GET(request:NextRequest){
    await dbConnect()
    try {
       const session = await getServerSession(authOptions)
       const {searchParams} = new URL(request.url)
       const userId = (session?.user)?._id
     //logic smjh nhi aara tu likh diyo


    } catch (error) {
       return NextResponse.json({success:false, message:"Internal Server Error"})
    }
}



//update a notification

export async function PUT(request:NextRequest){
await dbConnect()
try {
    const {searchParams} = new URL(request.url)
    const id = searchParams.get("id")
    if(!id){
        return NextResponse.json({success:false,message:'missing id'},{status:400})
        
    }
    
} catch (error) {
    console.error("PUT /api/Notification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });

}
}