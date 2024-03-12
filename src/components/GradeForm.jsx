'use client'
import { useState } from "react"
import Swal from "sweetalert2"

export default function GradeForm({ evaluationId, gradeHeaderId, item, isAutoCalculated, courseCode, data, setData }) {

  const [edit, setEdit] = useState(false)
  const [reg, setReg] = useState(item.grades[0] == null ? false : true)

  const [points, setPoints] = useState(reg ? item.grades[0].points : '')
  const [feedback, setFeedback] = useState(reg ? item.grades[0].feedback : '')

  const getURL = () => {
    if (isAutoCalculated) {
      return `/api/grades-lines${edit ? `/${reg ? item.grades[0].id : null}` : ''}?courseCode=${courseCode}&gradeHeaderId=${gradeHeaderId}`
    } else {
      return `/api/grades${edit ? `/${reg ? item.grades[0].id : null}` : ''}`
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    fetch(getURL(), {
      method: edit ? 'PUT' : 'POST',
      headers: {
        'ContentType': 'application/json'
      },
      body: JSON.stringify({
        courseCode: courseCode,
        studentId: Number(item.id),
        gradeHeaderId: Number(isAutoCalculated ? gradeHeaderId : null),
        evaluationId: Number(isAutoCalculated ? null : evaluationId),
        points: Number(points),
        feedback
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
          const temp = [...data]
          let itemFound = temp.find(x => x.id == item.id)
          itemFound.grades = [res]
          setData(temp)
          cancel()
        }
      })
  }

  const cancel = () => {
    setEdit(false)
    setReg(true)
  }

  if (reg && !edit) {
    return (
      <div style={{ backgroundColor: '#ddd' }} className=" mb-3 p-3 rounded">
        <h5>
          <span className="fw-bold">Estudiante: </span>
          {item.lastname} {item.name}
        </h5>
        <p className="mb-1">Puntos: {points}</p>
        <p>Retroalimentación: {feedback}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setEdit(true)}
        >
          Editar
        </button>
      </div>
    )
  }

  return (
    <form
      style={{ backgroundColor: '#ddd' }}
      className="mb-3 p-3 rounded"
      onSubmit={handleSubmit}
    >
      <h5>
        <span className="fw-bold">Estudiante: </span>
        {item.lastname} {item.name}
      </h5>

      <div className="form-floating mt-3">
        <input
          type="number"
          id="points"
          value={points}
          onChange={event => setPoints(event.target.value)}
          className="form-control"
        />
        <label htmlFor="points">Puntos obtenidos</label>
      </div>

      <div className="form-floating mt-3">
        <input
          type="text"
          id="feedback"
          value={feedback}
          onChange={event => setFeedback(event.target.value)}
          className="form-control"
        />
        <label htmlFor="feedback">Retroalimentación</label>
      </div>

      <div className="d-flex justify-content-between ">
        <button
          type="submit"
          className={`btn btn-${edit ? 'warning' : 'success'} mt-3`}>
          {item.grades[0] == null ? 'Guardar' : 'Modificar'}
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