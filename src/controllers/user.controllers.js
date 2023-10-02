import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'
import db from "../database/database.connection.js";

export async function postSignUp (req, res){
	const {name, email, password, confirmPassword} = req.body

	const passwordHash = bcrypt.hashSync(password, 10);

	try{
		if (confirmPassword !== password ) return res.status(422).send("Senha confirmada incorreta")

		const user = await db.query(`SELECT email FROM users WHERE email = '${email}';`)
		if(user.rows.length > 0) return res.status(409).send("Email já cadastrado")

		const u = await db.query(`INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${passwordHash}');`)
		res.status(201).send(u)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function postSignIn (req, res){
	const { email, password } = req.body

	try{
		const user = await db.query(`SELECT * FROM users WHERE email = '${email}';`)
		if (user.rows.length === 0) return res.status(401).send("Usuario não cadastrado")
		console.log(user.rows)
		const passwordIsCorrect = bcrypt.compareSync(password, user.rows[0].password)
		if (!passwordIsCorrect) return res.status(401).send("Senha incorreta")

		const token = uuid()
		
		const obj ={ token:token }

		await db.query(`INSERT INTO sessions ("userID", token) VALUES ('${user.rows[0].id}', '${token}');`)
		res.status(200).send(obj)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getUsers (req, res){
	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		const session = await db.query(`SELECT * FROM sessions WHERE token = '${token}';`)
		if(session.rows.length === 0) return res.status(401).send("Envie um token valido")
		//console.log(session.rows[0]);

		const count = await db.query(
			`SELECT users.id, users.name, SUM("visitCount") AS "visitCount"
				FROM users
				JOIN counts ON users.id = counts."userID"
				WHERE users.id = ${session.rows[0].userID}
				GROUP BY users.id;
		`)
		//console.log(count.rows[0]);

		const urls =  await db.query(
			`SELECT urls.id, urls."shortUrl", urls.url, SUM("visitCount") AS "visitCount"
				FROM counts
				JOIN urls ON urls.id = counts."urlID"
				WHERE urls."userID"=${session.rows[0].userID}
				GROUP BY urls.id;
		`)
		//console.log(urls.rows.length);

		const obj = {
			...count.rows[0],
			shortenedUrls: urls.rows
		}

		//console.log(obj);

		res.status(200).send(obj)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getRanking(req,res){
	
	try{


		const linksCount = await db.query(`SELECT COUNT(*) FROM urls`)

		const urls =  await db.query(
			`SELECT urls.id, urls."shortUrl", urls.url, SUM("visitCount") AS "visitCount"
				FROM counts
				JOIN urls ON urls.id = counts."urlID"
				GROUP BY urls.id;
		`)
		console.log(urls.rows.length);

	} catch (err) {
		res.status(500).send(err.message)
	}
}
