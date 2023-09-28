import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'
import db from "../database/database.connection.js";

export async function postSignUp (req, res){
	const {name, email, password, confirmPassword} = req.body

	const passwordHash = bcrypt.hashSync(password, 10);

	try{
		if (confirmPassword !== password ) return res.status(409).send("Senha confirmada incorreta")

		const user = await db.query(`SELECT name FROM users WHERE name = '${name}';`)
		if(user.rows.length > 0) return res.status(409).send("Nome já cadastrado")

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
		if (user.rows.length === 0) return res.status(404).send("Usuario não cadastrado")
		console.log(user.rows)
		const passwordIsCorrect = bcrypt.compareSync(password, user.rows[0].password)
		if (!passwordIsCorrect) return res.status(401).send("Senha incorreta")

		const token = uuid()
		
		const obj ={ token:token , idUser: user._id, name: user.name}

		await db.query(`INSERT INTO sessions ("userID", token) VALUES ('${user.rows[0].id}', '${token}');`)
		res.status(200).send(token)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getUsers (req, res){
	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		res.sendStatus(200)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getRanking(req,res){
	

	try{
		
	} catch (err) {
		res.status(500).send(err.message)
	}
}
