import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token_manger.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { static_string } from "../utils/constants.js";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
    const users = await User.find();
    return res.status(200).json({ message: "Ok", users });
        } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
        }
};

        // THIS IS THE CREATED USERSIGNUP ENDPOINT

export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
        try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        domain: "localhost",
        signed: true,
        path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7 );
    res.cookie("COOKIE_NAME", token, {
    path: "/",
    domain: "localhost",
    expires,
    httpOnly: true,
    signed : true,
    });

    return res.status(201).json({ message: "Ok", name: user.name, email: user.email});
            } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
        }
};
        //  THIS IS THE CREATED USERLOGIN ENDPOINT

export const verifyUser = async (
        req: Request,
        res: Response,
        next: NextFunction
) => {
        try {
    // user token check
    const user = await User.findById({ email: res.locals.jwtData.email.id});
    if (!user) {
        return res.status(401).send(static_string);
    }
    if  (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions did not match");
    }
    return res.status(200).json({ message: "Ok", name: user.name, email: user.email});
        } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
        }
};

export const userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
// user token check
const user = await User.findById({ email: res.locals.jwtData.email.id});
if (!user) {
    return res.status(401).send(static_string);
}
if  (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions did not match");
}
res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    domain: "localhost",
    signed: true,
    path: "/",
});

return res.status(200).json({ message: "Ok", name: user.name, email: user.email});
    } catch (error) {
console.log(error);
return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
