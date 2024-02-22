import User from "../models/User.js";
import { static_string } from "../utils/constants.js";
import { configureOpenAI } from "../config/openai_config.js";
import { OpenAIApi } from "openai";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res.status(401).json({ message: static_string });
        // grab chats of user
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // snd all chats with new one to OpenAI APIs
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({ model: "gpt-3.5-turbo", messages: chats, });
        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something wen wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        // user token check
        const user = await User.findById({ email: res.locals.jwtData.email.id });
        if (!user) {
            return res.status(401).send(static_string);
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions did not match");
        }
        return res.status(200).json({ message: "Ok", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        // user token check
        const user = await User.findById({ email: res.locals.jwtData.email.id });
        if (!user) {
            return res.status(401).send(static_string);
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions did not match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "Ok" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat_controllers.js.map