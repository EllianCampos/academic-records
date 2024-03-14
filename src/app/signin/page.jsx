'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from 'next-auth/react'
import Swal from "sweetalert2"
import NavbarLanding from "@/components/NavbarLanding"

export default function SignInPage(props) {
	const router = useRouter()
	const [error, setError] = useState(null)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		Swal.showLoading()

		signIn('credentials', {
			email, password, redirect: false
		})
			.then(authres => {
				Swal.close()
				if (authres.error) {
					return setError(authres.error)
				}
				if (authres.ok) {
					return router.push('/courses')
				}
			})
	}

	return (
		<>
			<header>
				<NavbarLanding />
			</header>
			<main className="d-flex flex-column align-items-center mt-3">
				<h1 className="text-center">Iniciar sesión como profesor</h1>
				<section className="container ">
					<form onSubmit={handleSubmit}>
						<div className="row mb-1">
							{
								error !== null && (
									<div className='alert alert-danger'>
										{error}
									</div>
								)
							}
						</div>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">Correo</label>
							<input onChange={event => setEmail(event.target.value)} value={email} type="email" name="email" id="email" className="form-control" />
						</div>
						<div className="mb-3">
							<label htmlFor="password" className="form-label">Contraseña</label>
							<input onChange={event => setPassword(event.target.value)} value={password} type="password" name="password" id="password" className="form-control" />
						</div>
						<button type="submit" className="btn btn-success mt-3">Ingresar</button>
						{/* <hr className="mt-4" /> */}
						{/* <Link href='/signup' className="btn btn-primary w-100">
							Crear una cuenta
							<i className="bi bi-person-add ms-2"></i>
						</Link> */}
					</form>
				</section>
			</main>
		</>

	)
}