import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import { userValidationSchema } from '../validators/uservalidation.js';
// post registe user
export const registerUser = async (req, res) => {

    console.log("req reached api called",req.body);
    // Validate user input

    // Show loading state

    // Send signup API request

    try {
        const parsedData = userValidationSchema.safeParse(req.body);

        if (!parsedData.success) {
        return res.status(400).json({
            errors: parsedData.error.errors.map((err) => err.message),
        });
        }
    
        const { username,  mobileno,email, password } = req.body;
        console.log(username);

            // Validation
        if (!username || !email || !password || !mobileno) {
            console.log("one field not found");
            return res.status(400).json({ error: "Please fill in all fields" });
        }
    
        // Check if user already exists
        // console.log(req.body);
         const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        // Create user in database
        const newUser = new User({
                username,
                email,
                mobileno,
                password: hashPassword, 
            });
        console.log("new user ",newUser);
        // Generate JWT
        if(newUser){
            await newUser.save();
            
            // Attach token as HttpOnly(res.cookie( , , {httpOnly : true})) cookie 
            generateTokenAndSetCookie(newUser._id,res);
            
            // Send success response
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                mobileno: newUser.mobileno,
                // token : 
            });
            console.log('registered user');
        }
        else {
                res.status(400).json({ error: "Unable to save user in db" });
            }
    } catch (error) {
        console.log('error salting password and creating user in db');
        res.status(500).json({ error: "Internal Server Error" });
    }

    // Receive user data

    // Update global auth state

    // Redirect to dashboard
};

// post login request
export const loginUser = async (req, res) => {
    // Validate user input

    // Show loading state

    // Send login API request
    
    console.log('login api reached');
    try {
        const {email,password} = req.body;
        console.log(email,password);
        ////////////////////////////////////////////
        ////////////////////////////////////////////
        // login user not found but hNDLING ON ui is remaining
        
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }
    
        // Check if user exists in database
        const user = await User.findOne({ email });
    
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    
        if (!user || !isPasswordCorrect) {
            console.log('user not found');
            return res.status(400).json({ error: "Invalid email or password" });
        }
    
        generateTokenAndSetCookie(user._id,res);
    
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            mobileno: user.mobileno,
        })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logoutUser = async(req,res)=>{


    // res.cookie('jwt', '', {
    //     httpOnly: true, 
    //     expires: new Date(0) // Expire immediately (1970)
    // });
    
    try {
        res.clearCookie('jwt', { httpOnly: true});

        res.status(201).json({ message: "User logged out successfully" });

    } catch (error) {
        res.status(500).json('internal server error logout failed');
    }
}