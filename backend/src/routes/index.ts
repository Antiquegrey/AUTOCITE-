import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";
import documentRoutes from "./document-routes.js";

const appRouter = Router();

appRouter.use("/user", userRoutes); //domain/api/v1/user
appRouter.use("/chat", chatRoutes); //domain/api/v1/chats
appRouter.use("/document", documentRoutes); //domain/api/v1/document

export default appRouter;