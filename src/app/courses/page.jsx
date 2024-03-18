'use client'
import Course from "@/components/Course"
import Link from "next/link"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function CoursesPage() {

	const [courses, setCourses] = useState([])
	const [invitations, setInvitations] = useState([])
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

	const fetchInvitations = () => {
		fetch(`/api/courses/share`)
			.then(res => res.json())
			.then(res => setInvitations(res))
	}

	const acceptInvitation = (courseCode) => {
		fetch('/api/courses/share/accept', {
			method: 'POST',
			headers: {
				'ContentType': 'application/json'
			},
			body: JSON.stringify({
				courseCode: courseCode
			})
		})
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
					Swal.fire(res.message)
						.then(result => {
							location.reload()
						})
				}
			})
	}

	const getCountOfInvitations = () => {
		let count = 0
		for (const invitacion of invitations) {
			count++
		}
		return count
	}

	useEffect(() => {
		fetchCourses()
		fetchInvitations()
	}, [])

	return (
		<main className="container">
			<nav className="mt-1">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><Link href="/">Home</Link></li>
					<li className="breadcrumb-item active">Mis Cursos</li>
				</ol>
			</nav>

			{invitations.length != 0 && (
				<div className="text-center my-4">
					<button type="button" className="btn btn-primary position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling">
						Invitaciones a formar parte de otros cursos
						<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
							{getCountOfInvitations()}
							<span className="visually-hidden">unread messages</span>
						</span>
					</button>
				</div>
			)}



			{/* <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">Enable body scrolling</button> */}

			<div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
				<div className="offcanvas-header">
					<h5 className="offcanvas-title" id="offcanvasScrollingLabel">Invitaciones</h5>
					<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
				</div>
				<div className="offcanvas-body">
					{invitations.map(invitation => (
						<div key={invitation.id}>
							<p>
								<b>{invitation.senderName} </b>
								Te ha invitado ha formar parte del curso
								<span className="fw-bold"> "{invitation.courseName}"</span>
							</p>
							<div className="d-flex justify-content-around">
								<button
									type="button"
									className="btn btn-success"
									onClick={() => acceptInvitation(invitation.courseCode)}
								>
									Aceptar
								</button>
								<button type="button" className="btn btn-danger">Aceptar</button>
							</div>
							<hr />
						</div>
					))}
				</div>
			</div>

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

			{courses.length === 0 && !isFetching ?
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