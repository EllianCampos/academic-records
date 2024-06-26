import Link from "next/link";

export default function Info(props) {
  return (
    <section className="mt-3 position-relative">
      <h3 className="text-primary">Información del curso</h3>
      <div className="row">
        <div className="col">
          <p><span className="fw-bold">Código: </span>{props.course.code}</p>
          <p><span className="fw-bold">Nombre: </span>{props.course.name}</p>
          <p>
            <span className="fw-bold">Duración: </span>
            {props.course.durationHours} Horas
          </p>

          <p>
            <span className="fw-bold">Curso finalizado: </span>
            {props.course.isFinished ? 'SI' : 'NO'}
          </p>

          <p><span className="fw-bold">Valor de la asistencia: </span>{props.course.attendacePercentaje}%</p>
        </div>
        <div className="col">
          <p><span className="fw-bold">Cantidad de estudiantes matriculados: </span>{props.course.numberStudentsEnrolled}</p>
          <p><span className="fw-bold">Cupo máximo: </span>{props.course.quota}</p>

          <p>
            <span className="fw-bold">
              Fecha de inicio:
            </span>
            {/* {props.course.startDate} */}
            <input type="date" className="ms-2" value={props.course.startDate != null && (props.course.startDate.substring(0, 10))} readOnly />
          </p>
          <p>
            <span className="fw-bold">
              Fecha de finalización:
            </span>
            {/* {props.course.endDate} */}
            <input type="date" className="ms-2" value={props.course.endDate != null && (props.course.endDate.substring(0, 10))} readOnly />
          </p>
        </div>
      </div>
      <div className="">
        <p className="mt-3 me-2">
          <span className="fw-bold">Matrícula abierta: </span>
          {props.course.openEnrollment ? 'SI' : 'NO'}
        </p>
        {props.course.openEnrollment && (
          <>
            <div className="alert alert-info">
              <a href={`https://academic-records.vercel.app/enrollment/${props.course.code}`} target="_blank">academic-records.vercel.app/enrollment/{props.course.code}</a>
            </div>
          </>
        )}
      </div>
      <div className="row">
        <p><span className="fw-bold">Horario: </span>{props.course.schedule}</p>
      </div>
      <div className="row">
        <p className="fw-bold">Profesores: </p>
        {props.teachers.map(teacher => (
          <p key={teacher.id}>
            {`- ${teacher.fullname}`}
          </p>
        ))}
      </div>
      <Link href={`/courses/edit/${props.courseCode}`} className="position-absolute top-0 end-0">Editar</Link>
    </section>
  )
}