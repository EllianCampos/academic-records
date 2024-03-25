'use client'
import GradeCard from "@/components/GradeCard";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function StudentsPage() {

	const [studentCedula, setStudentCedula] = useState('')
	const [studentBornDate, setStudentBornDate] = useState('')
	const [courseCode, setCourseCode] = useState('')

	const [course, setCourse] = useState({})
	const [student, setStudent] = useState({})
	const [grades, setGrades] = useState([])
	const [attendance, setAttendace] = useState({})
	const [note, setNote] = useState(0)

	const [showAttendance, setShowAttendance] = useState(false)

	const [showReport, setShowReport] = useState(false)

	const handleSubmit = (event) => {
		event.preventDefault()

		fetch(`/api/report?courseCode=${courseCode}&studentCedula=${studentCedula}&studentBornDate=${studentBornDate}`)
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
					setCourse(res[0])
					setStudent(res[1])
					setGrades(res[2])
					setAttendace(res[3])
					setNote(res[4])
					setShowReport(true)
				}
			})
	}



	return (
		<main>
			<Link href="/#more">
				<i className="bi bi-arrow-left-circle-fill display-5 ms-1"></i>
			</Link>
			<h2 className="text-center">Portal Estudiantes</h2>

			{!showReport ?
				<>
					<section className="container">
						<p>
							Si sos estudiante con tu número de cédula y el código del curso podes:&nbsp;
							<span className="fw-bold">
								consultar el resultado de las asignaciones revisadas hasta el momento y tu promedio final
							</span>
						</p>
						<div className="alert alert-warning">
							<p>Si no conoces el código del curso, se lo podés solicitar a tu profesor</p>
						</div>
					</section>

					<hr className="container my-4" />

					<section className="container">
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									value={courseCode}
									onChange={event => setCourseCode(event.target.value)}
									type="text"
									className="form-control"
								/>
								<label>Codigo del curso:</label>
							</div>
							<div className="form-floating mb-3">
								<input
									value={studentCedula}
									onChange={event => setStudentCedula(event.target.value)}
									type="number"
									className="form-control"
								/>
								<label>Cédula:</label>
							</div>
							<div className="form-floating mb-3">
								<input
									value={studentBornDate}
									onChange={event => setStudentBornDate(event.target.value)}
									type="date"
									className="form-control"
								/>
								<label>Fecha de nacimiento</label>
							</div>
							<button type="submit" className="btn btn-success form-control">Consultar</button>
						</form>
					</section>
				</>
				:
				<section className="container my-5">
					<div className="d-flex justify-content-end">
						<button
							className="btn btn-secondary"
							onClick={() => setShowReport(false)}
						>
							Cancelar
						</button>
					</div>

					<div>
						<p>
							<span className="fw-bold">Nombre del curso: </span>
							{course.name}
						</p>
						<p>
							<span className="fw-bold">Duración: </span>
							{course.durationHours} horas
						</p>
						<p>
							<span className="fw-bold">Horario: </span>
							{course.schedule}
						</p>
						<br />
						<span className="fw-bold">Estudiante: </span>
						{student.name} {student.lastname}
					</div>

					<div className="mt-5">
						<div className="d-flex justify-content-between ">
							<h2>Calificaciones</h2>
							<p>Nota: {note}/100</p>
						</div>

						{grades.length === 0 ?
							<p className="text-danger fw-bold text-center">El profesor aún no ha cargado ninguna calificación</p>
							:
							<>
								{
									grades.map((grade, index) => (
										<GradeCard key={index} grade={grade} />
									))
								}
							</>
						}
					</div>

					<div>
						<h4>
							Asistencia {attendance.percentaje}%/{course.attendacePercentaje}%
							<button
								className="btn btn-outline-secondary ms-2"
								onClick={() => setShowAttendance(!showAttendance)}
							>
								{showAttendance ?
									<i className="bi bi-caret-down-fill"></i>
									:
									<i className="bi bi-caret-right-fill"></i>
								}
							</button>
						</h4>
						{showAttendance && (
							<table className="table table-striped table-secondary">
								<thead>
									<tr>
										<th>Clase</th>
										<th>Estado</th>
									</tr>
								</thead>
								<tbody>
									{attendance.attendance.map((item, index) => (
										<tr key={index} >
											<td>{new Date(item.attendanceLine.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} ({item.attendanceLine.description})</td>
											<td>{item.attendanceLine.state}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</section>
			}
		</main >
	)
}