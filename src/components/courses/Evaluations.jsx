import { useState } from "react"
import Swal from "sweetalert2"

export default function Evaluations(props) {

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [points, setPoints] = useState('')
  const [percentaje, setPercentaje] = useState('')
  const [isAutoCalculated, SetIsAutoCalculated] = useState(false)

  const [method, setMethod] = useState('POST')
  const [showHelp, setShowHelp] = useState(false)

  const getTotal = () => {
    let total = 0
    for (const evaluation of props.evaluations) {
      total += Number(evaluation.percentaje)
    }
    total += props.attendacePercentaje
    return total
  }

  const cancel = () => {
    setId('')
    setName('')
    setPercentaje('')
    setPoints('')
    SetIsAutoCalculated(false)
    setShowHelp(false)
    setMethod('POST')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    fetch(`/api/evaluations${method === 'PUT' ? `/${id}` : ''}`, {
      method: method,
      headers: {
        'ContentType': 'application/json'
      },
      body: JSON.stringify({
        courseCode: props.courseCode,
        name,
        percentaje: Number(percentaje),
        points: isAutoCalculated ? 1 : Number(points),
        isAutoCalculated
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.issues) {
          // alert(res.issues[0].message)
          Swal.fire({
            title: 'Información incompleta',
            text: res.issues[0].message,
            icon: 'warning',
            confirmButtonText: 'Lo corregiré'
          })
        } else if (res.errorMessage) {
          // alert(res.errorMessage)
          Swal.fire({
            title: 'Error, algo salio mal',
            text: res.errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        } else {
          cancel()
          if (method === 'POST') {
            props.setEvaluations([...props.evaluations, res])
          } else {
            const temp = [...props.evaluations]
            const evaluation = temp.find(evaluation => evaluation.id == id)
            evaluation.name = res.name
            evaluation.points = res.points
            evaluation.percentaje = res.percentaje
            props.setEvaluations(temp)
          }
        }
      })
  }

  const handleDelete = () => {
    fetch(`/api/evaluations/${id}?courseCode=${props.courseCode}`, { method: 'DELETE' })
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
          const temp = [...props.evaluations]
          const filtered = temp.filter(evaluation => evaluation.id !== id)
          props.setEvaluations(filtered)
        }
      })
  }

  return (
    <section>
      <h3>Las evaluaciones corresponden a los rubros a evaluar en el curso</h3>

      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="form-floating mb-1 col-12">
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
          <label htmlFor="name">Nombre de la evaluación</label>
        </div>
        {method === 'POST' && (
          <>
            <div className="mt-3">
              <input
                checked={isAutoCalculated}
                onChange={event => SetIsAutoCalculated(event.target.checked)}
                type="checkbox"
                className="form-check-input"
                id="isAutoCalculated"
              />
              <label className="form-check-label ms-3">
                Evaluación con distribución automática de porcentaje
                <button
                  type="button"
                  className="btn btn-warning ms-2"
                  onClick={event => setShowHelp(!showHelp)}
                >
                  <i className="bi bi-question-octagon"></i>
                </button>
              </label>
            </div>
            {showHelp && (
              <div className="mt-2 alert alert-info ">
                Si tu rubro a evaluar puede tener un número indeterminado de actividades puedes elegir que el porcentaje se distribuya según vayas creando las actividades
                <br />
                <br />
                <span className="fw-bold"> Por ejemplo: </span>
                Puedes crear una evaluación Tareas con un porcentaje 15 porciento. Si asignas 3 tareas cada una tendra un valor de 5% pero si asignados 2 cada una tendrá un valor de 7,5%
              </div>
            )}
          </>
        )}
        <div className="form-floating col-6">
          <input
            type=""
            className="form-control"
            id="percentaje"
            value={percentaje}
            onChange={event => setPercentaje(event.target.value)}
          />
          <label htmlFor="percentaje">Porcentaje</label>
        </div>
        {!isAutoCalculated &&
          <div className="form-floating col-6">
            <input
              type="text"
              className="form-control"
              id="points"
              value={points}
              onChange={event => setPoints(event.target.value)}
            />
            <label htmlFor="points">Puntos</label>
          </div>
        }

        <div className="text-center d-flex justify-content-around">
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
            <th>Porcentaje</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Asistencia</td>
            <td></td>
            <td>{props.attendacePercentaje}%</td>
            <td></td>
          </tr>
          {props.evaluations.map(evaluation => (
            <tr key={evaluation.id}>
              <td>{evaluation.name}</td>
              <td>{evaluation.isAutoCalculated ? '' : evaluation.points}</td>
              <td>{evaluation.percentaje}%</td>
              <td>
                <button className="btn btn-primary" onClick={() => {
                  setId(evaluation.id)
                  setName(evaluation.name)
                  setPercentaje(evaluation.percentaje)
                  setPoints(evaluation.points)
                  SetIsAutoCalculated(evaluation.isAutoCalculated)
                  setMethod('PUT')
                }}>
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td>Total: {getTotal()}%</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}