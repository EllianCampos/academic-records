'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"

export default function AccountPage() {
	const [user, setUser] = useState({})
	const [password, setpassword] = useState('')
	const [passwordRepeat, setPasswordRepeat] = useState('')
	const [changePassMode, setChangePassMode] = useState(false)

	const fetchData = () => {
		fetch('/api/auth/account')
			.then(res => res.json())
			.then(res => setUser(res))
	}

	useEffect(() => {
		fetchData()
	}, [])

	const handleSubmit = (event) => {
		event.preventDefault()

		fetch('/api/auth/change-password', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password, passwordRepeat
			})
		})
			.then(res => {
				if (res.ok) {
					alert('Contraseña actualizada exitosamente')
					signOut()
				} else {
					alert('Algo salio mal, No ha sido posible cambiar la contraseña')
				}
			})
	}

	return (
		<main>
			<Link href="/courses">
				<i className="bi bi-arrow-left-circle-fill display-5 ms-1"></i>
			</Link>
			<h2 className="text-center p-3">Configuración de mi cuenta de profesor</h2>

			<section className="container">
				<h3>Datos:</h3>
				<p><span className="fw-bold">Nombre:</span>{` ${user.name}`}</p>
				<p><span className="fw-bold">Apellidos:</span>{` ${user.lastname}`}</p>
				<p><span className="fw-bold">Correo:</span>{` ${user.email}`}</p>
			</section>

			{!changePassMode && (
				<section className="container">
					<button
						className="btn btn-outline-danger"
						onClick={() => setChangePassMode(true)}
					>
						Actualizar contraseña
					</button>
				</section>
			)}

			<section className="container">
				{changePassMode && (
					<>
						<h3 className="text-center">Actualizar contraseña</h3>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									value={password}
									onChange={event => setpassword(event.target.value)}
									type="password"
									className="form-control"
									id="floatingInput"
								/>
								<label htmlFor="floatingInput">Ingrese la nueva contraseña</label>
							</div>
							<div className="form-floating mb-3">
								<input
									value={passwordRepeat}
									onChange={event => setPasswordRepeat(event.target.value)}
									type="password"
									className="form-control"
									id="floatingInput" />
								<label htmlFor="floatingInput">Vuelva a ingresar la contraseña</label>
							</div>
							<div className="d-flex justify-content-between">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => {
										setpassword('')
										setPasswordRepeat('')
										setChangePassMode(false)
									}}
								>
									Cancelar
								</button>
								<button type="submit" className="btn btn-success">Actualizar</button>
							</div>
						</form>
					</>
				)}
			</section>
		</main>
	)
}