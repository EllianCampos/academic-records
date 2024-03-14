'use client'
import { useState } from "react"

export default function GradeCard({ grade }) {

  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="m-2 p-2" >

      <p className="fw-bold m-1">
        {grade.name} ({grade.gettedPercentaje}%/{grade.totalPercentaje}%)
        <button
          className="btn btn-outline-secondary ms-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ?
            <i className="bi bi-caret-down-fill"></i>
            :
            <i className="bi bi-caret-right-fill"></i>
          }
        </button>
      </p>


      <div className="d-flex justify-content-center">
        {showDetails && (
          <div className="bg-light">
            <h3 className="bg-dark text-light text-center p-3 rounded-top-2 ">
              Calificación
              <span className="fw-bold text-light"> {grade.name}</span>
            </h3>
            <div className="p-2 pb-3">
              <p className="m-1">Puntos: {grade.gettedPoints}/{grade.totalPoints}</p>
              <p className="m-1">Porcentaje: {grade.gettedPercentaje}/{grade.totalPercentaje}</p>
              <p className="m-1">Nota: {grade.gettedNote}/100</p>
            </div>
            {grade.feedback && (
              <div className="bg-dark text-light p-2 rounded-bottom-2">
                <p>
                  <span className="fw-bold">Retroalimentación: </span>
                  {grade.feedback}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <hr className="mt-3" />
    </div>
  )
}