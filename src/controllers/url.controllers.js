import  db  from "../database/database.connection.js";
import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'

export async function postUrls (req, res){
	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getUrls (req, res){
	
	try{
		
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function getUrlsOpen (req, res){
	
	try{
		
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function deleteUrls(req,res){
	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		
	} catch (err) {
		res.status(500).send(err.message)
	}
}
