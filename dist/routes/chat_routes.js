import { Router } from "express";
import { verifyToken } from "../utils/token_manger.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatsToUser } from "../controllers/chat_controllers.js";
//Protectected APIs
const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletionValidator), verifyToken, generateChatCompletion);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
export default chatRoutes;
//# sourceMappingURL=chat_routes.js.map