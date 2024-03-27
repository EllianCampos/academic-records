'use client'
import { useState } from "react"
import Required from "../Required"
import Swal from "sweetalert2"

export default function AddStudentModal({ btnText, icon, color, method, id, student, courseCode }) {
	const [cedula, setCedula] = useState(student ? student.cedula : '')
	const [name, setName] = useState(student ? student.name : '')
	const [lastname, setLastname] = useState(student ? student.lastname : '')
	const [bornDate, setBornDate] = useState(student ? student.bornDate.substring(0, 10) : '')
	const [gender, setGender] = useState(student ? student.gender : '')
	const [phone, setPhone] = useState(student ? student.phone : '')
	const [email, setemail] = useState(student ? student.email : '')
	const [disability, setDisability] = useState(student ? student.disability : '')
	const [disabilityDescription, setDisabilityDescription] = useState(student ? (student.disabilityDescription ? student.disabilityDescription : '') : '')
	const [provincia, setProvincia] = useState(student ? (student.provincia ? student.provincia : '') : '')
	const [canton, setcanton] = useState(student ? (student.canton ? student.canton : '') : '')
	const [distrito, setDistrito] = useState(student ? (student.distrito ? student.distrito : '') : '')
	const [comunidad, setComunidad] = useState(student ? (student.comunidad ? student.comunidad : '') : '')
	const [observations, setObservations] = useState(student ? (student.observations ? student.observations : '') : '')

	const [provinciaId, setProvinciaId] = useState(0)

	const [cantones, setCantones] = useState([])
	const [distritos, setDistritos] = useState([])


	const fetchCantones = (provinciaId) => {
		fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/cantones.json`)
			.then(res => res.json())
			.then(res => {
				let arr = []
				for (const key in res) {
					const value = res[key]
					arr.push({
						cantonId: key,
						name: value
					})
				}
				setCantones(arr)
			})
	}

	const fetchDistritos = (cantonId) => {
		fetch(`https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/canton/${cantonId}/distritos.json`)
			.then(res => res.json())
			.then(res => {
				let arr = []
				for (const key in res) {
					const value = res[key]
					arr.push({
						distritoId: key,
						name: value
					})
				}
				setDistritos(arr)
			})
	}

	const handleSubmit = (event) => {
		event.preventDefault()

		fetch('/api/students', {
			method: method,
			headers: {
				'ContentType': 'application/json'
			},
			body: JSON.stringify({
				courseCode: courseCode,
				cedula: Number(cedula),
				name,
				lastname,
				bornDate,
				gender,
				phone,
				email,
				disability,
				disabilityDescription,
				provincia,
				canton,
				distrito,
				comunidad,
				observations
			})
		})
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
					setCedula('')
					setName('')
					setLastname('')
					setBornDate('')
					setGender('')
					setPhone('')
					setemail('')
					setDisability('')
					setDisabilityDescription('')
					setProvincia('')
					setcanton('')
					setDistrito('')
					setComunidad('')
					setObservations('')
					Swal.fire(method === 'POST' ? 'Estudiante matriculado exitosamente' : 'Los datos del estudiante han sido actualizados exitosamente')
						.then(result => {
							document.getElementById(`btnCloseStudent${id}Modal`).click()
							location.href = `/courses/${courseCode}`
						})
				}
			})
	}

	return (
		<>
			<button type="button" className={`btn btn-${color}`} data-bs-toggle="modal" data-bs-target={`#student${id}Modal`}>
				{btnText && btnText}
				{btnText ? <i className={`${icon} ms-2`}></i> : <i className={icon}></i>}
			</button>

			<div className="modal fade" id={`student${id}Modal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5">
								{method == 'POST' ? 'Matricular estudiante' : 'Actualizar datos de un estudiante'}
							</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmit} id={`FormStudent${id}Modal`}>
								<div className="form-floating mb-3">
									<input
										value={cedula}
										onChange={event => setCedula(event.target.value)}
										type="number"
										className="form-control"
										id="cedula"
										required
									/>
									<label
										htmlFor="cedula"
									>
										Cédula
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={name}
										onChange={event => setName(event.target.value)}
										type="text"
										className="form-control"
										id="name"
										required
									/>
									<label
										htmlFor="name"
									>
										Nombre
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={lastname}
										onChange={event => setLastname(event.target.value)}
										type="text"
										className="form-control"
										id="lastname"
										required
									/>
									<label
										htmlFor="lastname"
									>
										Apellidos
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={bornDate}
										onChange={event => setBornDate(event.target.value)}
										type="date"
										className="form-control"
										id="bornDate"
										required
									/>
									<label
										htmlFor="bornDate"
									>
										Fecha de nacimiento
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<select
										id="gender"
										className="form-select"
										value={gender}
										onChange={event => setGender(event.target.value)}
										required
									>
										<option value=""></option>
										<option value="Femenino">Femenino</option>
										<option value="Masculino">Masculino</option>
										<option value="Otro">Otro</option>
										<option value="No se registra">No se registra</option>
									</select>
									<label
										htmlFor="gender"
									>
										Genero
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={phone}
										onChange={event => setPhone(event.target.value)}
										type="tel"
										className="form-control"
										id="phone"
										required
									/>
									<label
										htmlFor="phone"
									>
										Télefono
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={email}
										onChange={event => setemail(event.target.value)}
										type="email"
										className="form-control"
										id="email"
										required
									/>
									<label
										htmlFor="email"
									>
										Correo electrónico
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<select
										id="disability"
										className="form-select"
										value={disability}
										onChange={event => setDisability(event.target.value)}
										required
									>
										<option value=""></option>
										<option value="NO">NO</option>
										<option value="SI">SI</option>
									</select>
									<label
										htmlFor="disability"
									>
										¿Tiene alguna discapacidad?
										<Required />
									</label>
								</div>
								<div className="form-floating mb-3">
									<textarea
										value={disabilityDescription}
										onChange={event => setDisabilityDescription(event.target.value)}
										type="text"
										className="form-control"
										id="disabilityDescription"
										rows={3}
									/>
									<label
										htmlFor="disabilityDescription"
									>
										En caso de tener alguna discapacidad. Por favor indique cual.
									</label>
								</div>
								<div className="form-floating mb-3">
									{/* <input
										value={provincia}
										onChange={event => setProvincia(event.target.value)}
										type="text"
										className="form-control"
										id="provincia"
									/> */}
									<select
										defaultValue={provincia}
										onClick={(event) => {
											setcanton('')
											setCantones([])
											setDistrito('')
											setDistritos([])
											if (event.target.value !== '0') {
												const selectedOption = event.target.options[event.target.selectedIndex];
												const provinciaId = selectedOption.getAttribute('data-id');
												setProvinciaId(provinciaId);
												setProvincia(selectedOption.text);
												fetchCantones(provinciaId);
											}
										}}
										className="form-select"
									>
										<option value="0">-- Seleccione una Provincia --</option>
										<option value="San José" data-id="1">San José</option>
										<option value="Alajuela" data-id="2">Alajuela</option>
										<option value="Cartago" data-id="3">Cartago</option>
										<option value="Heredia" data-id="4">Heredia</option>
										<option value="Guanacaste" data-id="5">Guanacaste</option>
										<option value="Puntarenas" data-id="6">Puntarenas</option>
										<option value="Limón" data-id="7">Limón</option>
									</select>

									<label htmlFor="provincia" className="form-label d-block">
										Provincia
									</label>
								</div>
								<div className="form-floating mb-3">
									{/* <input
										value={canton}
										onChange={event => setcanton(event.target.value)}
										type="text"
										className="form-control"
										id="canton"
									/> */}
									<select
										defaultValue={canton}
										onChange={(event) => {
											setDistrito('')
											setDistritos([])
											if (event.target.value != 0) {
												const selectedOption = event.target.options[event.target.selectedIndex];
												const cantonId = selectedOption.getAttribute('data-id');
												setcanton(selectedOption.text)
												fetchDistritos(cantonId)
											}
										}}
										className="form-select"
									>
										<option value="0">
											{method === 'POST'
												? '-- Seleccione un Cantón --'
												: (canton != '' ? `${canton}` : '-- Seleccione un Cantón --')}
										</option>
										{cantones.map((cant) => (
											<option
												key={'canton' + cant.cantonId}
												value={cant.name}
												data-id={cant.cantonId}
											>
												{cant.name}
											</option>
										))}
									</select>
									<label htmlFor="canton">
										Cantón
									</label>
								</div>
								<div className="form-floating mb-3">
									{/* <input
										value={distrito}
										onChange={event => setDistrito(event.target.value)}
										type="text"
										className="form-control"
										id="distrito"
									/> */}
									<select
										defaultValue={distrito}
										className="form-select"
										onChange={(event) => setDistrito(event.target.value)}
									>
										<option value="">
											{method === 'POST'
												? '-- Seleccione un Distrito --'
												: (distrito != '' ? `${distrito}` : '-- Seleccione un Distrito --')}
										</option>
										{distritos.map((dist) => (
											<option key={'distrito' + dist.distritoId} value={dist.name}>{dist.name}</option>
										))}
									</select>
									<label htmlFor="distrito">
										Distrito
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={comunidad}
										onChange={event => setComunidad(event.target.value)}
										type="text"
										className="form-control"
										id="comunidad"
									/>
									<label htmlFor="comunidad">
										Comunidad
									</label>
								</div>
								<div className="mb-3">
									<label>Observaciones</label>
									<textarea
										value={observations}
										onChange={event => setObservations(event.target.value)}
										type="text"
										className="form-control"
										rows={6}
									/>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
										id={`btnCloseStudent${id}Modal`}
									>
										Descartar
									</button>
									<button type="submit" className="btn btn-primary">
										{method === 'POST' ? "Matricular" : "Guardar cambios"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}