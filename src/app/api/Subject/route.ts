
//create a subject and get a subject
//update subject
//delete a subject

import dbConnect from "@/lib/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import  Subject  from "@/model/subject";




export async function POST(request:NextRequest){
    
const db = await dbConnect()
const session = await getServerSession(authOptions)
//agar session nhi mila ya fir session se user nhi mila then the user is not authenticated
if(!session||!session.user){
return NextResponse.json({
    success:false , message:"User not authenticated kindly login"
},{status:400})
}
//ab agar session se user mil jata hai hum usse subjects khud create krne ka option denge uske liye input lenge
try {
    const {name , description,sessionId } = await request.json()
    if (!sessionId) {
        return NextResponse.json({
      success:false , message:"No session Found"
      },{status:400})
    }
    if(!name||!description){
        return NextResponse.json({
      success:false , message:"Name and description about the subject is required"
      },{status:400})
    }
    
    const subjectCreate = await Subject.create({
        name:name,
        description:description,
        sessionId
    })

    return NextResponse.json({
        success:true , message:"subject created successfully",subjectCreate
    },{status:201})
} catch (error) {
    console.error("POST /api/Messages error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
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
    const getSubjects = await Subject.find({sessionId})
     return NextResponse.json({ success: true, getSubjects }, { status: 200 });
} catch (error) {
     return NextResponse.json({
        success:false , message:"subject not found"
    },{status:403})
}

}




export async function PUT(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "Missing 'id' query param" }, { status: 400 });

  try {
    const updates = await request.json();
    const Findsubject = await Subject.findByIdAndUpdate(id, updates, { new: true });
    if (!Findsubject) return NextResponse.json({ success: false, message: "Subject not found" }, { status: 404 });
    return NextResponse.json({ success: true, Findsubject }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/Subject error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}



export async function DELETE(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "Missing 'id' query param" }, { status: 400 });

  try {
    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: "Subject not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Subject deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/Subject error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
