import { useEffect, useState } from "react"
import Required from "../Required"
import { useRouter } from "next/navigation"
export default function AddStudentModal({ btnText, icon, color, method, id, student, courseCode }) {

	const router = useRouter()

	// const [cedula, setCedula] = useState(student ? student.cedula : '')
	// const [name, setName] = useState(student ? student.name : '')
	// const [lastname, setLastname] = useState(student ? student.lastname : '')
	// const [bornDate, setBornDate] = useState(student ? student.bornDate : '')
	// const [gender, setGender] = useState(student ? student.gender : '')
	// const [phone, setPhone] = useState(student ? student.phone : '')
	// const [email, setemail] = useState(student ? student.email : '')
	// const [disability, setDisability] = useState(student ? student.disability : '')
	// const [disabilityDescription, setDisabilityDescription] = useState(student ? student.disabilityDescription : "")
	// const [provincia, setProvincia] = useState(student ? student.provincia : '')
	// const [canton, setcanton] = useState(student ? student.canton : '')
	// const [distrito, setDistrito] = useState(student ? student.distrito : '')
	// const [comunidad, setComunidad] = useState(student ? student.comunidad : '')
	// const [observations, setObservations] = useState(student ? student.observations : "")


	const [cedula, setCedula] = useState('')
	const [name, setName] = useState('')
	const [lastname, setLastname] = useState('')
	const [bornDate, setBornDate] = useState('')
	const [gender, setGender] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setemail] = useState('')
	const [disability, setDisability] = useState('')
	const [disabilityDescription, setDisabilityDescription] = useState('Descripcion')
	const [provincia, setProvincia] = useState('')
	const [canton, setcanton] = useState('')
	const [distrito, setDistrito] = useState('')
	const [comunidad, setComunidad] = useState('')
	const [observations, setObservations] = useState('Obser')

	const loadStudentData = () => {
		setCedula(student.cedula)
		setName(student.name)
		setLastname(student.lastname)
		setBornDate(student.bornDate)
		setGender(student.gender)
		setPhone(student.phone)
		setemail(student.email)
		setDisability(student.disability)
		// setDisabilityDescription(student.disabilityDescription)
		setDisabilityDescription('text...')
		setProvincia(student.provincia)
		setcanton(student.canton)
		setDistrito(student.distrito)
		setComunidad(student.comunidad)
		// setObservations(student.observations)
		setObservations('text...')
	}

	useEffect(() => {
		if (method === 'PUT') {
			loadStudentData()
		}
	}, [])

	const handleSubmit = (event) => {
		event.preventDefault()
		console.log(courseCode)
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
				console.log(res)
				if (res.issues) {
					alert(res.issues[0].message)
				} else if (res.errorMessage) {
					alert(res.errorMessage)
				} else {
					alert(method === 'POST' ? 'Estudiante matriculado exitosamente' : 'Los datos del estudiante han sido actualizados exitosamente')
					router.push(`/courses/${courseCode}`)
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
								{method == 'POST' ? 'Matricular estudiante min' : 'Actualizar datos de un estudiante'}
							</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmit}>
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
										value={bornDate.substring(0,10)}
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
									<input
										value={provincia}
										onChange={event => setProvincia(event.target.value)}
										type="text"
										className="form-control"
										id="provincia"
									/>
									<label
										htmlFor="provincia"
									>
										Provincia
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={canton}
										onChange={event => setcanton(event.target.value)}
										type="text"
										className="form-control"
										id="canton"
									/>
									<label
										htmlFor="canton"
									>
										Cantón
									</label>
								</div>
								<div className="form-floating mb-3">
									<input
										value={distrito}
										onChange={event => setDistrito(event.target.value)}
										type="text"
										className="form-control"
										id="distrito"
									/>
									<label
										htmlFor="distrito"
									>
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
									<label
										htmlFor="comunidad"
									>
										Comunidad
									</label>
								</div>
								<div className="mb-3">
									<label
										htmlFor="observations"
									>
										Observaciones
									</label>
									<textarea
										value={observations}
										onChange={event => setObservations(event.target.value)}
										type="text"
										className="form-control"
										id="observations"
										rows={3}
									/>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
										Descartar
									</button>
									<button type="submit" className="btn btn-primary">
										{method === 'POST' ? "Matricular" : "Guradar cambios"}
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