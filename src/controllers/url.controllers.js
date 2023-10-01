import  db  from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function postUrls (req, res){
	const {url} = req.body

	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		//console.log(token);
		//console.log(url);

		const session = await db.query(`SELECT * FROM sessions WHERE token = '${token}';`)
		if(session.rows.length === 0) return res.status(401).send("Envie um token valido")
		//console.log(session.rows);

		const shortUrl = nanoid();
		//console.log(shortUrl);

		await db.query(`INSERT INTO urls ("userID","shortUrl", url) VALUES('${session.rows[0].userID}','${shortUrl}','${url}');`)

		const urls = await db.query(`SELECT * FROM urls WHERE "shortUrl"='${shortUrl}';`)
		const body = urls.rows.map( b => {
			const obj = {
				id: b.id,
				shortUrl:b.shortUrl
			}
			return obj
		})
		//console.log(body);
		res.status(201).send(body[0])
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getUrls (req, res){
	const {id} = req.params
	try{
		console.log(id);
		const urls = await db.query(`SELECT * FROM urls WHERE id = $1;`,[id])
		if (urls.rows.length == 0) return res.sendStatus(404)
		console.log(urls.rows);
		const body = urls.rows.map( b => {
			const obj = {
				id: b.id,
				shortUrl:b.shortUrl,
				url:b.url
			}
			return obj
		})
		console.log(body);
		res.status(200).send(body[0])
	} catch (err) {
		res.status(500).send(err.message)
	}
}
function hello(){
	console.log("opa");
}
export async function getUrlsOpen (req, res){
	//Adicionar contagem de visitas
	const {shortUrl} = req.params
	try{
		const urls = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`,[shortUrl])
		if (urls.rows.length == 0) return res.status(404).send("Envie uma url valida")
		

		await db.query(`INSERT INTO counts ("urlID","userID","visitCount") VALUES (${urls.rows[0].id},${urls.rows[0].userID},1);`)

		res.redirect(302,`/urls/open/${shortUrl}`)
		setTimeout(hello,5000)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function deleteUrls(req,res){
	const {id} = req.params

	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		console.log(id);

		const session = await db.query(`SELECT * FROM sessions WHERE token = '${token}';`)
		if(session.rows.length === 0) return res.status(401).send("Envie um token valido")
		console.log(session.rows)

		const urls = await db.query(`SELECT * FROM urls WHERE id = $1;`,[id])
		if (urls.rows.length == 0) return res.status(404).send("Envie um id valido")
		console.log(urls.rows);

		if(session.rows[0].userID !== urls.rows[0].userID) return res.status(401).send("Envie um id valido")

		if(!urls.rows[0].shortUrl ) return res.status(404).send("Não ha url válida")

		await db.query(`DELETE FROM urls WHERE id = $1;`,[id])
		res.sendStatus(204)
	} catch (err) {
		res.status(500).send(err.message)
	}
}
