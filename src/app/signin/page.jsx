'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from 'next-auth/react'

export default function SignInPage(props) {
	const router = useRouter()
	const [error, setError] = useState(null)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [hideBackBotton, setHideBackBotton] = useState(props.hideBackBotton ? props.hideBackBotton : false)

	const handleSubmit = (event) => {
		event.preventDefault()

    signIn('credentials', {
      email, password, redirect: false
    })
    .then(authres => {
      if (authres.error) {
       return setError(authres.error)
      }
      if (authres.ok) {
       return router.push('/courses')
      }
    })
	}

	return (
		<main>
			{!hideBackBotton && (
				<Link href="/#more">
				<i className="bi bi-arrow-left-circle-fill display-5 ms-1"></i>
			</Link>
			)}
			<h2 className="text-center">Iniciar sesión como profesor</h2>
			<section className="d-flex justify-content-center ">
				<form onSubmit={handleSubmit} className="col-8">
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
					<button type="submit" className="btn btn-success w-100">Ingresar</button>
					<hr className="mt-4" />
					<Link href='/signup' className="btn btn-primary w-100">
						Crear una cuenta
						<i className="bi bi-person-add ms-2"></i>
					</Link>
				</form>
			</section>
		</main>
	)
}