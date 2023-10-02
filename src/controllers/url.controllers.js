import  db  from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function postUrls (req, res){
	const {url} = req.body

	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		const session = await db.query(`SELECT * FROM sessions WHERE token = '${token}';`)
		if(session.rows.length === 0) return res.status(401).send("Envie um token valido")

		const shortUrl = nanoid();

		await db.query(`INSERT INTO urls ("userID","shortUrl", url) VALUES('${session.rows[0].userID}','${shortUrl}','${url}');`)

		const urls = await db.query(`SELECT * FROM urls WHERE "shortUrl"='${shortUrl}';`)
		const body = urls.rows.map( b => {
			const obj = {
				id: b.id,
				shortUrl:b.shortUrl
			}
			return obj
		})
	
		res.status(201).send(body[0])
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getUrls (req, res){
	const {id} = req.params
	try{
		const urls = await db.query(`SELECT * FROM urls WHERE id = $1;`,[id])
		if (urls.rows.length == 0) return res.sendStatus(404)
		
		const body = urls.rows.map( b => {
			const obj = {
				id: b.id,
				shortUrl:b.shortUrl,
				url:b.url
			}
			return obj
		})

		res.status(200).send(body[0])
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getUrlsOpen (req, res){
	const {shortUrl} = req.params
	
	try{
		const urls = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`,[shortUrl])
		if (urls.rows.length == 0) return res.status(404).send("Envie uma url valida")
		

		await db.query(`INSERT INTO counts ("urlID","userID","visitCount") VALUES (${urls.rows[0].id},${urls.rows[0].userID},1);`)

		res.sendStatus(302)
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
