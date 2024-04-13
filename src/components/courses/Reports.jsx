'use client'
import CalcAge from "@/libs/CalcAge"
import { useState } from "react"
import Swal from "sweetalert2"

export default function Reports(props) {

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
  }

  return (
    <section>
      <div className="d-flex justify-content-around mb-2">
        <button
          className="btn btn-success"
          onClick={() => fetchData()}
        >
          Cargar Reporte
        </button>
        <button
          className="btn btn-info"
          onClick={() => {
            Swal.fire('Puedes copiar el reporte hacia Excel solo asegúrate de que tu cursor(mouse) se encuentre dentro de la tabla a la hora de copiar')
          }}>
          Copiar información
        </button>
      </div>

      <div className="table-responsive" style={{ maxHeight: "75vh" }}>
        <table className="table table-striped">
          <thead>
            <tr>
              {reportDataHeaders.map((header, index) => (
                <th className="sticky-top" key={index}>{header}</th>
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