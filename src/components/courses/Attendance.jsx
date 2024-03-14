'use client'
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import AttendanceModal from "../Modals/AttendanceModal"

export default function Attendance(props) {

  const [id, setId] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  const [method, setMethod] = useState('POST')
  const [attendanceHeaders, setAttendanceHeaders] = useState([])

  const fetchAttendanceHeaders = () => {
    fetch(`/api/attendance?courseCode=${props.courseCode}`)
      .then(res => res.json())
      .then(res => setAttendanceHeaders(res))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    fetch(`/api/attendance${method === 'PUT' ? `/${id}` : ''}`, {
      method,
      headers: {
        'ContentType': 'application/json'
      },
      body: JSON.stringify({
        courseCode: props.courseCode,
        description,
        date
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
          cancel()
          if (method === 'POST') {
            setAttendanceHeaders([...attendanceHeaders, res])
          } else {
            const temp = [...attendanceHeaders]
            const item = temp.find(x => x.id == id)
            item.date = res.date
            item.description = res.description
          }
        }
      })
  }

  const handleDelete = () => {
    fetch(`/api/attendance/${id}?courseCode=${props.courseCode}`, { method: 'DELETE' })
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
          cancel()
          const temp = [...attendanceHeaders]
          const filtered = temp.filter(x => x.id !== id)
          setAttendanceHeaders(filtered)
        }
      })
  }

  const cancel = () => {
    setDate('')
    setDescription('')
    setMethod('POST')
  }

  useEffect(() => {
    fetchAttendanceHeaders()
  }, [])

  return (
    <main>
      <h3 className="text-primary">Asistencia</h3>

      <section>
        <form className="row g-0 my-4" onSubmit={handleSubmit}>
          <div className="form-floating col mx-1">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={event => setDate(event.target.value)}
            />
            <label>Fecha</label>
          </div>
          <div className="form-floating col mx-1">
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={event => setDescription(event.target.value)}
            />
            <label>Descripción</label>
          </div>
          <div className="text-center d-flex justify-content-around mt-2">
            <button type="submit" className="btn btn-success">
              {method === 'POST' ? 'Crear' : 'Guardar cambios'}
            </button>
            {method === 'POST' ? '' :
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete()}
              >
                Eliminar
              </button>
            }
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => cancel()}
            >
              Cancelar
            </button>
          </div>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attendanceHeaders.map(item => (
              <tr key ={item.id}>
                <td>{item.date.substring(0, 10)}</td>
                <td>{item.description}</td>
                <td>
                  <AttendanceModal attendanceHeader={item} courseCode={props.courseCode} />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setMethod('PUT')
                      setId(item.id)
                      setDate(item.date.substring(0, 10))
                      setDescription(item.description)
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}