export default function GetAttendanceReport(data) {
  let attendanceReport = {}
  attendanceReport.attendance = []
  attendanceReport.percentaje = 0

  const totalAttendancePercentaje = Number(data.courses.attendacePercentaje)
  const countAttendace = Number(data.courses._count.attendance)
  let presentClasess = 0

  for (const item of data.courses.attendance) {
    if (item.attendancelines[0]) {
      let state = item.attendancelines[0].state

      if (state != 'AUSENTE') {
        presentClasess++
      }

      const attendanceLine = {
        description: item.description,
        date: item.date,
        state: item.attendancelines[0].state,
        observations: item.attendancelines[0].observations
      }

      attendanceReport.attendance.push({ attendanceLine })
    }
  }

  let attendacePercentaje = 0
  attendacePercentaje = (totalAttendancePercentaje * presentClasess) / countAttendace
  attendanceReport.percentaje = isNaN(attendacePercentaje) ? 0: Number(attendacePercentaje.toFixed(2))
  
  return [attendanceReport, attendanceReport.percentaje]
}