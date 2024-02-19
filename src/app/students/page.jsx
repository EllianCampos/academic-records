'use client'

import Link from "next/link";
import { useState } from "react";

export default function StudentsPage() {

	const [studentCedula, setStudentCedula] = useState('')
	const [courseCode, setCourseCode] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()

		alert('Funcionalidad en desarrollo // Cédula: ' + studentCedula + ' /// Código del curso: ' + courseCode)
	}

	return (
		<main>
			<Link href="/#more">
				<i className="bi bi-arrow-left-circle-fill display-5 ms-1"></i>
			</Link>
			<h2 className="text-center">Portal Estudiantes</h2>

			<section className="container">
				<p>
					Si sos estudiante con tu número de cédula y el código del curso podes:&nbsp;
					<span className="fw-bold">
						consultar el resultado de las asignaciones revisadas hasta el momento y tu promedio final
					</span>
				</p>
				<div className="alert alert-warning">
					<p>Si no conoces el código del curso, se lo podes solicitar a tu profesor</p>
				</div>
			</section>

			<hr className="container my-4" />

			<section className="container">
				<form onSubmit={handleSubmit}>
					<div className="form-floating mb-3">
						<input
							value={studentCedula}
							onChange={event => setStudentCedula(event.target.value)}
							type="text"
							className="form-control"
							id="floatingInput"
						/>
						<label htmlFor="floatingInput">Cédula 0-000-0000:</label>
					</div>
					<div className="form-floating mb-3">
						<input
							value={courseCode}
							onChange={event => setCourseCode(event.target.value)}
							type="text"
							className="form-control"
							id="floatingInput" />
						<label htmlFor="floatingInput">Codigo del curso:</label>
					</div>
					<button type="submit" className="btn btn-success form-control">Consultar</button>
				</form>
			</section>
		</main>
	)
}