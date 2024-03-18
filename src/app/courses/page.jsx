'use client'
import Course from "@/components/Course"
import Link from "next/link"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function CoursesPage() {

	const [courses, setCourses] = useState([])
	const [isFetching, setIsFetching] = useState(true)

	const fetchCourses = () => {
		Swal.showLoading()
		fetch('api//courses')
			.then(res => res.json())
			.then(res => {
				setCourses(res)
				setIsFetching(false)
				Swal.close()
			})
	}

	useEffect(() => {
		fetchCourses()
	}, [])

	return (
		<main className="container">
			<nav className="mt-1">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><Link href="/">Home</Link></li>
					<li className="breadcrumb-item active">Mis Cursos</li>
				</ol>
			</nav>

			<div className="d-flex justify-content-between py-2">
				<h1 className="mt-3">Mis cursos</h1>
				<div>
					<Link
						href='/courses/new'
						className="btn btn-outline-success mt-3"
					>
						Crear nuevo curso
						<i className="bi bi-plus-square ms-2"></i>
					</Link>
				</div>
			</div>

			{courses.length === 0 && !isFetching?
				<section className="d-flex justify-content-center">
					<div className="bg-light text-primary fw-bold fs-5 p-5 rounded-5">
						<p>Aun no tienes cursos</p>
						<Link href='/courses/new' className="text-success">Crear mi primer curso</Link>
					</div>
				</section>
				:
				<section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
					{courses.map(course => (
						course.usercourses.length === 1 ? (
							<Course key={course.code} course={course} color='#249bba' />
						) : (
							<Course key={course.code} course={course} color='#28aa42' />
						)
					))}
				</section>
			}
			{/* {courses.map(course => (
					course.usercourses.length === 1 ? (
						<Course key={course.code} course={course} color='#249bba' />
					) : (
						<Course key={course.code} course={course} color='#28aa42' />
					)
				))} */}

		</main>
	)
}