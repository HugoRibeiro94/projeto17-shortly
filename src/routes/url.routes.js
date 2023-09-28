import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { urlSchema } from "../schemas/url.schemas.js";
import { deleteUrls, getUrls, getUrlsOpen, postUrls } from "../controllers/url.controllers.js";

const routerUrl = Router()

routerUrl.post('/urls/shorten',validateSchema(urlSchema), postUrls)

routerUrl.get('/urls/:id', getUrls)

routerUrl.get('/urls/open/:shortUrl', getUrlsOpen)

routerUrl.delete("/urls/:id", deleteUrls)

export default routerUrl