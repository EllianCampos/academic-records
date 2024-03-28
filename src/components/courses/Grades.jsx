'use client'
import { useState } from "react"
import GradeModal from "../Modals/GradeModal"
import Swal from "sweetalert2"

export default function Grades(props) {

  const [id, setId] = useState(null)
  const [name, setName] = useState('')
  const [points, setPoints] = useState('')

  const [evaluationId, setEvaluationId] = useState('')
  const [headerName, setHeaderName] = useState('')


  const [gradesHeaders, setGradesHeaders] = useState([])
  const [showSecondarySelect, setShowSecondarySelect] = useState(false)

  const [method, setMethod] = useState('POST')


  const fetchGradesHeaders = (evaluationId) => {
    fetch(`/api/grades-headers?courseCode=${props.courseCode}&evaluationId=${evaluationId}`)
      .then(res => res.json())
      .then(res => setGradesHeaders(res))
  }

  const cancel = () => {
    setMethod('POST')
    setName('')
    setPoints('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    fetch(`/api/grades-headers${method === 'PUT' ? `/${id}` : ''}`, {
      method: method,
      headers: {
        'ContentType': 'application/json'
      },
      body: JSON.stringify({
        courseCode: props.courseCode,
        evaluationId,
        name,
        points: Number(points)
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
            setGradesHeaders([...gradesHeaders, res])
          } else {
            const temp = [...gradesHeaders]
            const item = temp.find(x => x.id == id)
            item.name = res.name
            item.points = res.points
          }
        }
      })
  }

  const handleDelete = () => {
    fetch(`/api/grades-headers/${id}?courseCode=${props.courseCode}&evaluationId=${evaluationId}`, { method: 'DELETE' })
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
          const temp = [...gradesHeaders]
          const filtered = temp.filter(x => x.id !== id)
          setGradesHeaders(filtered)
        }
      })
  }

  return (
    <main>
      <h3 className="text-primary">Calificaciones</h3>

      <section className="mt-4">
        <p>Selecciona una evaluacion para calificar</p>
        {props.evaluations.map(evaluation => evaluation.isAutoCalculated ?
          <button
            key={evaluation.id}
            className="btn btn-secondary m-2"
            onClick={() => {
              setShowSecondarySelect(true)
              fetchGradesHeaders(evaluation.id)
              setHeaderName(evaluation.name)
              setEvaluationId(evaluation.id)
            }}
          >
            {evaluation.name}
          </button>
          :
          <GradeModal
            key={evaluation.id}
            evaluationId={evaluation.id}
            title={evaluation.name}
            fulltitle={`${evaluation.name} (${evaluation.points})ptos`}
            isAutoCalculated={false}
            courseCode={props.courseCode}
            setShowSecondarySelect={setShowSecondarySelect}
          />
        )}

        {showSecondarySelect && (
          <>
            <hr className="" />
            <h4>
              Actividades de la evaluación
              <span className="fw-bold text-success"> {headerName}</span>
            </h4>

            <form className="row g-0 my-4" onSubmit={handleSubmit}>
              <div className="form-floating col mx-1">
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={event => setName(event.target.value)}
                />
                <label>Nombre</label>
              </div>
              <div className="form-floating col mx-1">
                <input
                  type="number"
                  className="form-control"
                  value={points}
                  onChange={event => setPoints(event.target.value)}
                />
                <label>Puntos</label>
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
                  <th>Nombre</th>
                  <th>Puntos</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {gradesHeaders.map(gradeHeader => (
                  <tr key={gradeHeader.id}>
                    <td>{gradeHeader.name}</td>
                    <td>{gradeHeader.points}</td>
                    <td className="d-flex justify-content-center">
                      <GradeModal
                        key={gradeHeader.id}
                        gradeHeaderId={gradeHeader.id}
                        title={gradeHeader.name}
                        fulltitle={`${gradeHeader.name} (${gradeHeader.points})ptos`}
                        isAutoCalculated={true}
                        courseCode={props.courseCode}
                        setShowSecondarySelect={setShowSecondarySelect}
                      />
                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setId(gradeHeader.id)
                            setName(gradeHeader.name)
                            setPoints(gradeHeader.points)
                            setMethod('PUT')
                          }}
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </main>
  )
}