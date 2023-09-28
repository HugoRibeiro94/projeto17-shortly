import express from "express"
import cors from "cors"
import routerUser from "./routes/user.routes.js";
import routerUrl from "./routes/url.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(routerUser)
app.use(routerUrl)

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})