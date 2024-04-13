'use client'
import { useState } from "react"
import Swal from "sweetalert2"

export default function AttendanceForm(props) {

  const [id, setId] = useState('')
  const [edit, setEdit] = useState(false)
  const [reg, setReg] = useState(
    props.item.attendancelines[0] == null ? false : true
  )

  const [state, setState] = useState(reg ? props.item.attendancelines[0].state : '')
  const [observations, setObservations] = useState(reg ? props.item.attendancelines[0].observations : '')

  const cancel = () => {
    setEdit(false)
    setReg(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    fetch(`/api/attendance-lines${edit ? `/${props.item.attendancelines[0].id}` : ''}`, {
      method: edit ? 'PUT' : 'POST',
      headers: {
        'ContentType': 'application/json'
      },
      body: JSON.stringify({
        courseCode: props.courseCode,
        attendanceId: props.attendanceId,
        studentId: props.item.id,
        state,
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
          const temp = [...props.data]
          let itemFound = temp.find(x => x.id == props.item.id)
          itemFound.attendancelines = [res]
          props.setData(temp)
          cancel()
        }
      })
  }

  if (reg && !edit) {
    return (
      <div style={{ backgroundColor: '#ddd' }} className=" mb-3 p-3 rounded">
        <p>
          <span className="fw-bold">Estudiante: </span>
          {props.item.lastname} {props.item.name}
        </p>
        <p className="fw-bold fs-4 bg-black text-light text-center py-2">
          {props.item.attendancelines[0].state}
        </p>
        <p>
          <span className="fw-bold">Anotaciones: </span>
          {props.item.attendancelines[0].observations}
        </p>
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => setEdit(true)}
        >
          Editar
        </button>
      </div>
    )
  }

  // Show form
  return (
    <form 
      className="row mb-3 p-3 rounded g-0" 
      style={{ backgroundColor: '#ddd' }}
      onSubmit={handleSubmit}
    >

      <label htmlFor="state">
        <span className="fw-bold">Estudiante: </span>
        {props.item.lastname} {props.item.name}
      </label>


      <select
        id="state"
        className="form-control mt-2"
        value={state}
        onChange={event => setState(event.target.value)}
        required
      >
        <option value=""></option>
        <option value="PRESENTE">PRESENTE</option>
        <option value="AUSENTE">AUSENTE</option>
        <option value="AUSENTE - JUSTIFICADO">AUSENTE - JUSTIFICADO</option>
        {/* <option value="LLEGADA TARDIA">LLEGADA TARDIA</option> */}
        {/* <option value="LLEGADA TARDIA - JUSTIFICADA">LLEGADA TARDIA - JUSTIFICADA</option> */}
      </select>

      <div className="form-floating mt-3">
        <textarea  
          rows="10" 
          className="form-control" 
          value={observations}
          onChange={event => setObservations(event.target.value)}
        />
        <label>Anotaciones</label>
      </div>

      <div className="d-flex justify-content-between ">
        <button
          type="submit"
          className={`btn btn-${edit ? 'warning' : 'success'} mt-3`}>
          {props.item.attendancelines[0] == null ? 'Guardar' : 'Modificar'}
        </button>

        {edit && (
          <button
            type="button"
            onClick={() => cancel()}
            className="btn btn-secondary mt-3"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}