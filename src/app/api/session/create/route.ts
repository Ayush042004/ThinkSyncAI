import dbConnect from "@/lib/dbConnect";
import  Session  from "@/model/Session";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import {nanoid} from "nanoid";
import  UserModel  from "@/model/UserModel";
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
    const userId = user._id;
    const { name, description } = await request.json();

    if (!name) {
        return Response.json(
      { success: false, message: 'Name is required' },
      { status: 400 }
    );
    }
    const code = nanoid(6);
    try{
        const newSession = new Session({
        name,
        code,
        description,
        creator: userId,
        members: [userId],
    });
        await newSession.save();

        await UserModel.findByIdAndUpdate(
            userId,
            {$push: {sessionsCreated: newSession._id, sessionsJoined: newSession._id}},
            {new: true}
        );
        return Response.json(
      {
        success: true,
        message: 'Session created successfully',
        session: newSession,
      },
      { status: 201 }
    );
    

    } catch(error){
        console.error('Error creating session:', error);
    return Response.json(
      { success: false, message: 'Error creating session' },
      { status: 500 }
    );
    }


}
