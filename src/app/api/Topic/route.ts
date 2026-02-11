import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Topic  from "@/model/topic";



//create a topic
//get a topic
//update a topic
//delete a topic

//create a topic
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { subjectId, name, order = 0 } = await request.json();

    if (!subjectId) return NextResponse.json({ success: false, message: "Missing subjectId" }, { status: 400 });
    if (!name || typeof name !== "string") return NextResponse.json({ success: false, message: "Missing or invalid name" }, { status: 400 });

    const topic = await Topic.create({ subjectId, name, order });
    return NextResponse.json({ success: true, topic }, { status: 201 });
  } catch (error) {
    console.error("POST /api/Topic error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


//get a topic
export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const subjectId = searchParams.get("subjectId");

  try {
    if (id) {
      const topic = await Topic.findById(id);
      if (!topic) return NextResponse.json({ success: false, message: "Topic not found" }, { status: 404 });
      return NextResponse.json({ success: true, topic }, { status: 200 });
    }

    if (subjectId) {
      const topics = await Topic.find({ subjectId }).sort({ order: 1 });
      return NextResponse.json({ success: true, topics }, { status: 200 });
    }

    const topics = await Topic.find().sort({ order: 1 });
    return NextResponse.json({ success: true, topics }, { status: 200 });
  } catch (error) {
    console.error("GET /api/Topic error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


//Delete a topic
//id se hi delete kr do
export async function DELETE(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

  try {
    const deleted = await Topic.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: "Topic not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Topic deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/Topic error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


//update a topic
export async function PUT(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

  try {
    const updates = await request.json();
    const topic = await Topic.findByIdAndUpdate(id, updates, { new: true });
    if (!topic) return NextResponse.json({ success: false, message: "Topic not found" }, { status: 404 });
    return NextResponse.json({ success: true, topic }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/Topic error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}