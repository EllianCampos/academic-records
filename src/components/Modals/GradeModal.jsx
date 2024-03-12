'use client'
import { useEffect, useState } from "react"
import GradeForm from "../GradeForm"

export default function GradeModal({ evaluationId, gradeHeaderId, title, fulltitle, isAutoCalculated, courseCode, setShowSecondarySelect }) {

  const [data, setData] = useState([])
  const [modalId, setModalId] = useState(evaluationId ? `grade${evaluationId}Modal` : `gradeHeader${gradeHeaderId}Modal`)

  const getURL = () => {
    if (isAutoCalculated) {
      return `/api/grades-lines?courseCode=${courseCode}&gradeHeaderId=${gradeHeaderId}`
    } else {
      return `/api/grades?courseCode=${courseCode}&evaluationId=${evaluationId}`
    }
  }

  const fetchGrades = () => {
    fetch(getURL())
      .then(res => res.json())
      .then(res => setData(res))
  }
  
  useEffect(() => {
    fetchGrades()
  }, [])

  return (
    <>
      <button
        type="button"
        className='btn btn-secondary m-2'
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
        onClick={() => {
          if (!isAutoCalculated) {
            setShowSecondarySelect(false)
          }
        }}
      >
        {title}
      </button>

      <div className="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                {fulltitle}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {data.map(item => (
                <GradeForm
                  key={item.id}
                  item={item}
                  isAutoCalculated={isAutoCalculated}
                  courseCode={courseCode}
                  evaluationId={evaluationId}
                  gradeHeaderId={gradeHeaderId}
                  data={data}
                  setData={setData}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}