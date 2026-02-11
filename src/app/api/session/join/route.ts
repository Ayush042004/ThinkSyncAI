import dbConnect from "@/lib/dbConnect";
import  Session  from "@/model/Session";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import  UserModel  from "@/model/UserModel";
import { User } from "next-auth";

export async function PUT(request: NextRequest) {
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
  const {code} = await request.json();
  try{
    
    const sessionToJoin = await Session.findOne({code});
    if(!sessionToJoin) {
        return Response.json(
      { success: false, message: 'Session not found or invalid code' },
      { status: 404 }
    );
    }

    if(userId && !sessionToJoin.members.includes(userId as any)){
        sessionToJoin.members.push(userId as any);
        await sessionToJoin.save();

        await UserModel.findByIdAndUpdate(userId,{
            $push: {sessionsJoined: sessionToJoin._id},
        },
        {new: true}
        );
        }
        return Response.json(
      {
        success: true,
        message: 'Joined session successfully',
        session: sessionToJoin,
      },
      { status: 200 }
    );
    }

  catch(error){
        console.error('Error joining session:', error);
    return Response.json(
      { success: false, message: 'Error joining session' },
      { status: 500 }
    );
    }
}