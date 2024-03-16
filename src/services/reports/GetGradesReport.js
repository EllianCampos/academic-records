export default function GetGradesReport(data) {
  let gradesReport = []
  let note = 0

  for (const item of data.courses.evaluations) {
    console.log(item)
    if (!item.isAutoCalculated && item.grades[0]) {
      const totalPoints = Number(item.points)
      const totalPercentaje = Number(item.percentaje)
      const gettedPoints = Number(item.grades[0].points)

      const gettedPercentaje = (totalPercentaje * gettedPoints) / totalPoints
      const gettedNote = (gettedPoints * 100) / totalPoints

      const grade = {
        name: item.name,
        totalPoints,
        gettedPoints,
        totalPercentaje: totalPercentaje.toFixed(0),
        gettedPercentaje: gettedPercentaje.toFixed(2),
        gettedNote: gettedNote.toFixed(2),
        feedback: item.grades[0].feedback
      }

      note += gettedPercentaje
      gradesReport.push(grade)
    } else if (item.isAutoCalculated && item.gradesheaders) {
      const totalPercentaje = Number(item.percentaje) / Number(item._count.gradesheaders)

      for (const header of item.gradesheaders) {
        if (header.gradeslines[0]) {
          const totalPoints = Number(header.points)
          const gettedPoints = Number(header.gradeslines[0].points)

          const gettedPercentaje = (totalPercentaje * gettedPoints) / totalPoints
          const gettedNote = (gettedPoints * 100) / totalPoints

          const grade = {
            name: header.name,
            totalPoints,
            gettedPoints,
            totalPercentaje: totalPercentaje.toFixed(2),
            gettedPercentaje: gettedPercentaje.toFixed(2),
            gettedNote: gettedNote.toFixed(2),
            feedback: header.gradeslines[0].feedback
          }

          note += gettedPercentaje
          gradesReport.push(grade)
        }
      }
    }
  }

  return [gradesReport, note]
}