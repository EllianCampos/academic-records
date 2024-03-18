'use client'
import { useState } from "react"
import Swal from "sweetalert2"

export default function Teachers(props) {

	const [emailreceptor, setEmailReceptor] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()

		fetch(`/api/courses/share?courseCode=${props.courseCode}&emailReceptor=${emailreceptor}`, { method: 'POST' })
			.then(res => res.json())
			.then(res => {
				if (res.issues) {
					Swal.fire({
						title: 'Información incompleta',
						text: res.issues[0].message,
						icon: 'warning',
						confirmButtonText: 'Lo corregiré'
					})
				} else if (res.errorMessage) {
					Swal.fire({
						title: 'Error, algo salio mal',
						text: res.errorMessage,
						icon: 'error',
						confirmButtonText: 'Aceptar'
					})
				} else {
					Swal.fire(res.message)
					setEmailReceptor('')
				}
			})
	}

	const deleteTeacher = (id, teacherFullname) => {
		Swal.fire({
			title: 'Eliminar acceso al profesor',
			text: `¿Estás seguro que deseas eliminar el acceso al profesor "${teacherFullname}" a este curso`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "##6c757d",
			confirmButtonText: 'Si, Eliminar',
			cancelButtonText: "Cancelar"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`/api/courses/share/delete?courseCode=${props.courseCode}&userId=${id}`, { method: 'DELETE' })
					.then(res => res.json())
					.then(res => {
						if (res.errorMessage) {
							Swal.fire({
								title: 'Error, algo salio mal',
								text: res.errorMessage,
								icon: 'error',
								confirmButtonText: 'Aceptar'
							})
						} else {
							Swal.fire({
								title: 'Profesor eliminado',
								text: res.message,
								icon: "success"
							})
								.then(result => location.href = `/courses/${props.courseCode}`)
						}
					})
			}
		});
	}

	return (
		<section className="my-3">
			<h2 className="text-primary">Profesores</h2>
			<p>Esta sección solo es visible para el profesor creador del curso, y le permite invitar o eliminar profesores</p>
			<table className="table">
				<thead>
					<tr>
						<th>Profesor</th>
						<th>Correo electrónico</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{props.teachers.map(teacher => (
						<tr key={teacher.id}>
							<td>{teacher.fullname}</td>
							<td>{teacher.email}</td>
							<td>
								{!teacher.isCreator && (
									<button
										className="btn btn-danger ms-2"
										onClick={() => deleteTeacher(teacher.id, teacher.fullname)}
									>
										<i className="bi bi-trash"></i>
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<h4>Invitar un profesor</h4>
			<form className="row mb-3" onSubmit={handleSubmit}>
				<div className="col-12 col-sm-4 col-md-3 text-center ">
					<label htmlFor="email">Correo electrónico</label>
				</div>
				<div className="col-12 col-sm-8 col-md-5">
					<input type="email" id="email" className="form-control" value={emailreceptor} onChange={event => setEmailReceptor(event.target.value)} />
				</div>
				<div className="col-12 col-md-4 mt-3 mt-md-0 ">
					<input type="submit" value="Enviar invitación" className="form-control btn btn-outline-success" />
				</div>
			</form>


		</section>
	)
}