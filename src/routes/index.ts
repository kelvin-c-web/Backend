import {Router} from "express";
import userRoutes from "./user_routes.js";
import chatRoutes from "./chat_routes.js";

const appRouter = Router();

appRouter.use("/user", userRoutes); //domain/api/v1
appRouter.use("/chat", chatRoutes);

export default appRouter;