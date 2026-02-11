import dbConnect from "@/lib/dbConnect";
import  UserModel  from "@/model/UserModel";
import bcrypt from "bcryptjs";


export async function POST(request: Request){
    await dbConnect();

    try{
     const {username, email,password}= await request.json();
     const existingUserByUsername = await UserModel.findOne({
        username: username,
     });

     if(existingUserByUsername){
        return Response.json({
            success: false,
            message: "Username is already taken",
        },
        {
            status: 400,
        }
        )
     }
     const existingUserByEmail = await UserModel.findOne({
        email: email,
     });
     if(existingUserByEmail){
        return Response.json({
            success: false,
            message: "User already exists with this email! Try another",
        },
        {
            status: 400,
        }
        )
     }
     else{
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new UserModel({
            username: username,
            email: email,
            password: hashedPassword,
            avatar: randomAvatar,
        });
        await newUser.save();
        return Response.json({
            success: true,
            message: "User registered successfully!",
        },
        {
            status: 201,
        }
        )
     }

    } catch(error){
        console.error("Error registering user: ",error);
        return Response.json({
            success: false,
            message: "Error registering user",
        },
        {
            status: 500,
        }
        )

    }

}