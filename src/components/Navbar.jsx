'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from "next/navigation";

export default function Navbar() {
	const pathname = usePathname()
	const { data: session } = useSession()

	const [fullname, setFullname] = useState('')
	const [email, setEmail] = useState('')

	useEffect(() => {
		if (session?.user) {
			setFullname(session.user.name + ' ' + session.user.lastname)
			setEmail(session.user.email)
		}
	}, [session])

	return (
		<nav className="navbar navbar-expand-smx navbar-light bg-light">
			<div className="container-fluid">
				<Link href={pathname === '/courses' ? '../' : '/courses'} className="navbar-brand">
					<i className="bi bi-house-door me-2"></i>
					Registro Estudiantil
				</Link>
				{/* <button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
				>
					<span className="navbar-toggler-icon"></span>
				</button> */}
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						{/* <li className="nav-item">
							<Link href="/courses" className="nav-link">Cursos</Link>
						</li> */}
					</ul>
				</div>

				<div className="dropdown">
					<div className="dropdown-toggle d-flex " id="dropdownMenuUser" data-bs-toggle="dropdown">
						<div className="d-none d-sm-inline">
							<h5 className="m-0 p-0">{fullname}</h5>
							<p className="m-0 p-0">{email}</p>
						</div>
						<i className="bi bi-person-gear display-6"></i>
					</div>

					<div className="dropdown-menu dropdown-menu-end pt-0">
						<div className="dropdown-header">
							<strong>Cuenta</strong>
						</div>
						<Link href="/account" className="btn">Mi perfil</Link>
						<div className="dropdown-divider"></div>
						<button className="btn" onClick={() => { signOut() }} >
							<i className="bi bi-box-arrow-left me-1"></i>
							Cerrar sesión
						</button>
					</div>
				</div>
			</div>
		</nav>
	)
}