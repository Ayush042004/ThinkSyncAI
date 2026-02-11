import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from '@/model/UserModel';
import  Session  from "@/model/Session";
import  Document  from "@/model/document";
import { success } from "zod";
import { User } from "next-auth";


export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

      if(!session || !session?.user) {
        return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try{
    const userId = user._id;
    const { sessionId, subjectId, topicId, uploadedBy, fileName, fileUrl, fileType, size } = await request.json();
    const session = await Session.findById(sessionId);
    if(!session) {
      return Response.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }
    //agar session id nhi mila mtlb user aaya hi pehli bar hai usko sign up krna pdega
    //ek aur case bhi ho skta hai ki agar sessionid session ke andar userid mili mtlb ki woh sign in kr toh chuka hai lekin iss session ka part nhi hai

    
    if(!session.members.includes(userId as any)) {
      return Response.json({
        success:false,message:'You are no the member of this session'
        
      },{status:403})

    }

    //before submitting the doc there will be a size limitation which is necessary
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes
    const MIN_FILE_SIZE = 1; // 1 byte
    if(size>MAX_FILE_SIZE){
      return Response.json(
        { success: false, message: 'File size exceedss the limit' },
        { status: 400 }
      );

    }
    if (size < MIN_FILE_SIZE) {
      return Response.json({
        success: false,
        message: 'File size is too small',
      })
    }

    //ab filename pr check lgane ki koi jarurat nhi hai kyonki woh default hoga hi
    //next aage file types mai agar file types pdf docs pptx txt ya csv ke alawa kuch hua then allow nhi krna 

    const fileTypes = ['pdf', 'docx', 'pptx', 'txt', 'csv'];
    if (!fileTypes.includes(fileType)) {
      return Response.json(
        { success: false, message: 'Invalid file type' },
        { status: 403}
      );
    }

    

    const doc = await Document.create({
      sessionId,
      subjectId,
      topicId,
      uploadedBy,
      fileName,
      fileUrl,
      fileType,
      size
    });
    await Session.findByIdAndUpdate(sessionId, { $push: { documents: doc._id } });

    return Response.json(
      { success: true, message: 'Document created successfully', doc },
      { status: 200 }
    );

  }catch(error){
    console.log(error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();
   const {searchParams} = new URL(request.url);
   const sessionId = searchParams.get('sessionId');

   if (!sessionId) {
    return NextResponse.json({
      success:false , message:'Missing SessionId'
    },{status:400})
   }

    try {
        const docs = await Document.find({ sessionId })
        .populate('uploadedBy', 'username');

    return NextResponse.json(
      { success: true, docs },
      { status: 200 }
    );
      
    } catch (error) {
      console.error('GET /api/Document error:', error)
      return NextResponse.json({
        success: false, message: 'Internal server error'
      },{status: 500})
    }
   

}



//delete a document and update and document 

//delte a document 
//directly  delete from id

export async function DELETE(request:NextRequest){
 await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

  try {
     const deletedDoc = await Document.findByIdAndDelete(id);

    if (!deletedDoc) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Document deleted successfully", deletedDoc },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/Document error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }

}


//update a document 

export async function PUT(request:NextRequest){
  await dbConnect()
  const {searchParams} = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json({
      success:false,message:"id is missing"
    },{status:400})
  }
  try {
    const updates = await request.json()
    const updated = await Document.findByIdAndUpdate(id,{ $set: updates }, { new: true, runValidators: true });
    if(!updated){
      return NextResponse.json({
        success:false,
        message:'Document not found'
      },{status:404})

    }
    return NextResponse.json({ success: true, document: updated }, { status: 200 });

  }catch (error) {
    console.error("PUT /api/Document error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}