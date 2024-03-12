'use client'
import Course from "@/components/Course"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CoursesPage() {

	const [courses, setCourses] = useState([])

	const fetchCourses = () => {
		fetch('api//courses')
			.then(res => res.json())
			.then(res => setCourses(res))
	}

	useEffect(() => {
		fetchCourses()
	}, [])

	return (
		<main className="container">
			<div className="d-flex justify-content-between">
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
			<section className="d-flex justify-content-start align-items-start flex-wrap">
				{courses.map(course => (
					course.usercourses.length === 1 ? (
						<Course key={course.code} course={course} color='#249bba' />
					) : (
						<Course key={course.code} course={course} color='#28aa42' />
					)
				))}
			</section>
		</main>
	)
}



// Color verde #28aa42
// #249bba