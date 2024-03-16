'use client'
import { useEffect, useState } from "react"
import AttendanceForm from "../AttendanceForm"

export default function AttendanceModal(props) {

  const [data, setData] = useState([])

  const fetchAttendanceLines = () => {
    fetch(`/api/attendance-lines?courseCode=${props.courseCode}&attendanceId=${props.attendanceHeader.id}`)
    .then(res => res.json())
    .then(res => setData(res))
  }

  useEffect(() => {
    fetchAttendanceLines()
  }, [])

  return (
    <>
      <button
        type="button"
        className='btn btn-secondary m-2'
        data-bs-toggle="modal"
        data-bs-target={`#attendance${props.attendanceHeader.id}Modal`}
        onClick={() => {
          if (!isAutoCalculated) {
            setShowSecondarySelect(false)
          }
        }}
      >
        Pasar Lista
      </button>

      <div className="modal fade" id={`attendance${props.attendanceHeader.id}Modal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                {/* {`Asistencia ${props.attendanceHeader.date.substring(0,10)}(${props.attendanceHeader.description})`} */}
                Asistencia 
                <input type="date" className="mx-2" value={props.attendanceHeader.date != null && (props.attendanceHeader.date.substring(0,10))} readOnly />
                ({props.attendanceHeader.description})
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {data.map(item => (
                <AttendanceForm 
                  key={item.id} 
                  item={item} 
                  attendanceId={props.attendanceHeader.id}
                  courseCode={props.courseCode} 
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