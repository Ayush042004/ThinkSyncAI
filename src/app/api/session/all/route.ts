import dbConnect from "@/lib/dbConnect";
import  Session  from "@/model/Session";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function GET(){
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

    try{
        const sessions = await Session.find({
            members: userId,
        }).populate('creator', 'username email avatar').exec(); 

        return Response.json(
      {
        success: true,
        message: 'Sessions retrieved successfully',
        sessions,
      },
      { status: 200 }
    );
    } catch(error){
        console.error('Error retrieving sessions:', error);
    return Response.json(
      { success: false, message: 'Error retrieving sessions' },
      { status: 500 }
    );
    }
}