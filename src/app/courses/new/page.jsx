'use client'
import Required from "@/components/Required"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function NewEditCoursePage({ params }) {
	const router = useRouter()

	const [name, setName] = useState('')
	const [durationHours, setDurationHours] = useState('')
	const [schedule, setSchedule] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [quota, setQuota] = useState('')
	const [isFinished, setIsFinished] = useState(false)
	const [attendacePercentaje, setAttendacePercentaje] = useState('')
	const [amICreator, setAmICreator] = useState(false)

	const fetchCourseData = () => {
		fetch(`/api/courses/${params.code}`)
			.then(res => res.json())
			.then(res => {
				const data = res.courses
				setName(data.name)
				setDurationHours(data.durationHours)
				setQuota(data.quota)
				setStartDate(data.startDate.substring(0, 10))
				setEndDate(data.endDate.substring(0, 10))
				setAttendacePercentaje(data.attendacePercentaje)
				setSchedule(data.schedule)
				setIsFinished(data.isFinished)
				setAmICreator(res.isCreator ? true : false)
			})
	}

	const handleSubmit = (event) => {
		event.preventDefault()

		fetch(`/api/courses/${params.code ? params.code : ''}`, {
			method: params.code ? 'PUT' : 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				durationHours: Number(durationHours),
				schedule,
				startDate,
				endDate,
				quota: Number(quota),
				isFinished: params.code ? isFinished : false,
				attendacePercentaje: Number(attendacePercentaje)
			})
		})
			.then(res => {
				return res.json()
			})
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
					Swal.fire({
						title: params.code ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente',
						text: "",
						icon: "success"
					});
					router.push(`/courses/${res.code}`)
				}
			})
	}

	const handleDelete = () => {
		Swal.fire({
			title: "Eliminar curso",
			text: "¿Estás seguro que deseas eliminar el curso con toda la información?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "##6c757d",
			confirmButtonText: "Si, Eliminar",
			cancelButtonText: "Cancelar"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`/api/courses/${params.code}`, { method: 'DELETE' })
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
							title: "Curso Eliminado",
							text: res.message,
							icon: "success"
						});
						router.push(`/courses`)
					}
				})
			}
		});
	}

	useEffect(() => {
		if (params.code) fetchCourseData()
	}, [])

	return (
		<main className="container my-3">
			<h1 className="text-center">{params.code ? "Editar curso" : "Nuevo curso"}</h1>
			<form onSubmit={handleSubmit}>
				<div className="mt-3">
					<label htmlFor="name" className="form-label">Nombre del curso <Required /></label>
					<input
						value={name}
						onChange={event => setName(event.target.value)}
						type="text"
						className="form-control"
						id="name"
						required
					/>
				</div>
				<div className="mt-3">
					<label htmlFor="durationHours" className="form-label">Duración en horas <Required /></label>
					<input
						value={durationHours}
						onChange={event => setDurationHours(event.target.value)}
						type="number"
						className="form-control"
						id="durationHours"
						required
					/>
				</div>
				<div className="mt-3">
					<label htmlFor="quota" className="form-label">Cupo máximo <Required /></label>
					<input
						value={quota}
						onChange={event => setQuota(event.target.value)}
						type="number"
						className="form-control"
						id="quota"
						required
					/>
				</div>
				<div className="mt-3">
					<label htmlFor="startDate" className="form-label">Fecha de inicio <Required /></label>
					<input
						value={startDate}
						onChange={event => setStartDate(event.target.value)}
						type="date"
						className="form-control"
						id="startDate"
						required
					/>
				</div>
				<div className="mt-3">
					<label htmlFor="endDate" className="form-label">Fecha de finalización <Required /></label>
					<input
						value={endDate}
						onChange={event => setEndDate(event.target.value)}
						type="date"
						className="form-control"
						id="endDate"
						required
					/>
				</div>
				<div className="mt-3">
					<label htmlFor="attendacePercentaje" className="form-label">Porcentaje de asistencia <Required /></label>
					<input
						value={attendacePercentaje}
						onChange={event => setAttendacePercentaje(event.target.value)}
						type="number"
						className="form-control"
						id="attendacePercentaje"
					/>
				</div>
				<div className="mt-3">
					<label htmlFor="schedule" className="form-label">Horario del curso</label>
					<textarea
						value={schedule}
						onChange={event => setSchedule(event.target.value)}
						className="form-control"
						id="schedule"
						rows={5}
					/>
				</div>
				{params.code && (
					<div className="mt-3">
						<input
							checked={isFinished}
							onChange={event => setIsFinished(event.target.checked)}
							type="checkbox"
							className="form-check-input"
							id="isFinished"
						/>
						<label htmlFor="isFinished" className="form-check-label ms-3">Curso finalizado</label>
					</div>
				)}
				{/* Buttons */}
				<div className="mt-3 d-flex justify-content-between">
					<Link
						href={params.code ? `/courses/${params.code}` : '/courses'}
						className='btn btn-warning'
					>
						Descartar
					</Link>
					{params.code && (
						<button type="button" className="btn btn-danger" onClick={handleDelete} >
							{amICreator ? 'Eliminar' : 'Abandonar curso'}
						</button>
					)}
					<button
						type="submit"
						className="btn btn-success"
					>
						{params.code ? "Guardar cambios" : "Crear curso"}
					</button>
				</div>
			</form>
		</main>
	)
}