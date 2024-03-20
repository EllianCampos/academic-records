'use client'
import Attendance from "@/components/courses/Attendance";
import Enrollment from "@/components/courses/Enrollment";
import Evaluations from "@/components/courses/Evaluations";
import Grades from "@/components/courses/Grades";
import Info from "@/components/courses/Info";
import Reports from "@/components/courses/Reports";
import Teachers from "@/components/courses/Teachers";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CoursePage({ params }) {
	const [course, setCourse] = useState({})
	const [students, setStudents] = useState([])
	const [evaluations, setEvaluations] = useState([])
	const [amICreator, setAmICreator] = useState(false)
	const [teachers, setTeachers] = useState([])

	const fetchCourseData = () => {
		fetch(`/api/courses/${params.code}`)
			.then(res => res.json())
			.then(res => {
				if (res.errorMessage) {
					return location.href = '../'
				}

				if (res.isCreator) {
					setAmICreator(true)
				}
				setCourse(res.courses)
				setTeachers(res.teachers)
			})
	}

	const fetchStudents = () => {
		fetch(`/api/students?courseCode=${params.code}`)
			.then(res => res.json())
			.then(res => {
				if (res.errorMessage) {
					return location.href = '../'
				}

				setStudents(res)
			})
	}

	const fetchEvaluations = () => {
		fetch(`/api/evaluations?courseCode=${params.code}`)
			.then(res => res.json())
			.then(res => {
				if (res.errorMessage) {
					return location.href = '../'
				}

				setEvaluations(res)
			})
	}

	useEffect(() => {
		fetchCourseData()
		fetchStudents()
		fetchEvaluations()
	}, [])

	return (
		<main className="container">
			<nav className="mt-1">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><Link href="/">Home</Link></li>
					<li className="breadcrumb-item"><Link href="/courses">Mis cursos</Link></li>
					<li className="breadcrumb-item active">Curso</li>
				</ol>
			</nav>

			<div className="accordion mt-3 mb-4" id="accordionExample">

				{/* Info */}
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
							Información del curso
						</button>
					</h2>
					<div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
						<div className="accordion-body" style={{ backgroundColor: '#eee' }} >
							{/* Información del curso */}
							<Info course={course} courseCode={params.code} teachers={teachers} />
						</div>
					</div>
				</div>

				{/* Teachers */}
				{amICreator && (
					<div className="accordion-item">
						<h2 className="accordion-header">
							<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
								Profesores
							</button>
						</h2>
						<div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
							<div className="accordion-body" style={{ backgroundColor: '#eee' }}>
								{/* Profesores */}
								<Teachers courseCode={params.code} teachers={teachers} />
							</div>
						</div>
					</div>
				)}


				{/* Enrollment */}
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
							Matrícula
						</button>
					</h2>
					<div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
						<div className="accordion-body style={{ backgroundColor: '#eee' }}">
							{/* Matrícula */}
							<Enrollment
								students={students}
								setStudents={setStudents}
								courseCode={params.code}
								fetchStudents={fetchStudents}
							/>
						</div>
					</div>
				</div>

				{/* Evaluations */}
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
							Evaluaciones
						</button>
					</h2>
					<div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
						<div className="accordion-body" style={{ backgroundColor: '#eee' }}>
							<Evaluations
								evaluations={evaluations}
								attendacePercentaje={Number(course.attendacePercentaje)}
								courseCode={params.code}
								setEvaluations={setEvaluations}
							/>
						</div>
					</div>
				</div>

				{/* Grades */}
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
							Calificaciones
						</button>
					</h2>
					<div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
						<div className="accordion-body" style={{ backgroundColor: '#eee' }}>
							<Grades
								evaluations={evaluations}
								courseCode={params.code}
							/>
						</div>
					</div>
				</div>

				{/* Attendance */}
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
							Asistencia
						</button>
					</h2>
					<div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
						<div className="accordion-body" style={{ backgroundColor: '#eee' }}>
							<Attendance
								courseCode={params.code}
							/>
						</div>
					</div>
				</div>

				{/* Reports */}
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
							Reporte
						</button>
					</h2>
					<div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
						<div className="accordion-body" style={{ backgroundColor: '#eee' }}>
							<Reports courseCode={params.code} />
						</div>
					</div>
				</div>

			</div>
		</main>
	)
}