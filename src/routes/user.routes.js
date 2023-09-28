import { Router } from "express";
import { getRanking, getUsers, postSignIn, postSignUp } from "../controllers/user.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { userSchema } from "../schemas/user.schemas.js";

const routerUser = Router()

routerUser.post('/signup',validateSchema(userSchema), postSignUp)

routerUser.post('/signin', postSignIn)

routerUser.get('/users/me', getUsers)

routerUser.get("/ranking", getRanking)

export default routerUser