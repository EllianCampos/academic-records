'use client'
import CalcAge from "@/libs/CalcAge"
import { useState } from "react"
import Swal from "sweetalert2"

export default function Reports(props) {

  // const [data, setData] = useState([])
  const [reportDataHeaders, setReportDataHeaders] = useState([])
  const [reportDataRows, setReportDataRows] = useState([])

  const fetchData = () => {
    Swal.showLoading()
    fetch(`/api/report/all?courseCode=${props.courseCode}`)
      .then(res => res.json())
      .then(res => {
        fullReport(res)
      })
  }

  const fullReport = (data) => {
    let reportRows = []
    let reportHeadersSet = new Set()
    reportHeadersSet.add('Cédula')
    reportHeadersSet.add('Nombre')
    reportHeadersSet.add('Edad')
    reportHeadersSet.add('Genero')
    reportHeadersSet.add('Teléfono')
    reportHeadersSet.add('Correo electrónico')
    reportHeadersSet.add('Discapacidad')
    reportHeadersSet.add('Provincia')
    reportHeadersSet.add('Cantón')
    reportHeadersSet.add('Distrito')
    reportHeadersSet.add('Comunidad')
    reportHeadersSet.add('Asistencia')

    // Add headers
    for (const item of data) {
      for (const grade of item[2]) {
        reportHeadersSet.add(grade.name)
      }
    }
    reportHeadersSet.add('Nota Final')
    let reportHeaders = Array.from(reportHeadersSet)
    // console.log(reportHeaders)

    for (const row of data) {
      let cedula = row[1].cedula
      let fullname = row[1].lastname + ' ' + row[1].name
      let bornDate = CalcAge(row[1].bornDate)
      const gender = row[1].gender
      const phone = row[1].phone
      const email = row[1].email
      const disability = row[1].disability
      const provincia = row[1].provincia
      const canton = row[1].canton
      const distrito = row[1].distrito
      const comunidad = row[1].comunidad
      let attendance = row[3].percentaje

      let reportRow = [
        cedula,
        fullname,
        bornDate,
        gender,
        phone,
        email,
        disability,
        provincia,
        canton,
        distrito,
        comunidad,
        attendance
      ]

      for (const grade of row[2]) {
        reportRow[reportHeaders.indexOf(grade.name)] = grade.gettedPercentaje
      }

      reportRow[reportHeaders.indexOf('Nota Final')] = row[4]

      reportRows.push(reportRow)
    }

    setReportDataHeaders(Array.from(reportHeaders))
    setReportDataRows(reportRows)
    Swal.close()
    console.log(reportRows)
  }

  return (
    <section className="overflow-hidden ">
      <div className="d-flex justify-content-center ">
        <button
          className="btn btn-success"
          onClick={() => fetchData()}
        >
          Cargar Reporte
        </button>
      </div>

      <div className="overflow-scroll">
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              {reportDataHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportDataRows.map((row, indexRow) => (
              <tr key={indexRow}>
                {reportDataHeaders.map((header, indexHeader) => (
                  <td key={`rowHead${indexHeader}x${indexRow}`}>
                    {row[indexHeader]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}