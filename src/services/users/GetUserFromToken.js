import { getToken } from "next-auth/jwt";

export default async function GetUserFromToken(req) {
  let user = {}
	try {
		let token = await getToken({ req })
		user = token.user
	} catch (error) {
		return ['Acceso NO autorizado', null]
	}

  return [null, user]
}