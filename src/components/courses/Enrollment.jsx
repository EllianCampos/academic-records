import AddStudentModal from "../Modals/AddStudentModal";

export default function Enrollment({ students, courseCode }) {
  return (
    <section className="mt-3">
      <div className="d-flex justify-content-between ">
        <h3 className="text-primary">Matrícula</h3>
        <AddStudentModal
          btnText='Nuevo estudiante'
          icon='bi bi-plus-square-fill'
          color='success'
          method='POST'
          id='editStudentModal'
          courseCode={courseCode}
        />
      </div>
      <div className="overflow-scroll">
        <table className="table table-striped mt-3 overflow-x-scroll">
          <thead className="">
            <tr>
              <th></th>
              <th>Cédula</th>
              <th>Apellidos</th>
              <th>Nombre</th>
              <th>Fecha de nacimiento</th>
              <th>Genero</th>
              <th>Teléfono</th>
              <th>Correo electrónico</th>
              <th>Discapacidad</th>
              <th>Descripción de la discapacidad</th>
              <th>Provincia</th>
              <th>Cantón</th>
              <th>Distrito</th>
              <th>Comunidad</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="position-relative ">
                <td>
                  <AddStudentModal btnText='' icon='bi bi-pencil-square' color='primary' method='PUT' student={student} id={student.id} courseCode={courseCode} />
                  {/* <br />
                  <br />
                  <p className="position-absolute bottom-0 start-0 ms-3 mb-4">
                    {student.updatedBy === null ?
                      <><span className="fw-bold">Matriculado por: </span> {student.createdBy} </>
                      :
                      <><span className="fw-bold">Datos actualizados por: </span> {student.updatedBy} </>
                    }
                  </p> */}
                </td>
                <td>{student.cedula}</td>
                <td>{student.lastname}</td>
                <td>{student.name}</td>
                <td>
                {/* {student.bornDate.substring(0,10)} */}
                <input type="date" value={student.bornDate.substring(0,10)} readOnly />
                </td>
                <td>{student.gender}</td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
                <td>{student.disability}</td>
                <td>{student.disabilityDescription}</td>
                <td>{student.provincia}</td>
                <td>{student.canton}</td>
                <td>{student.distrito}</td>
                <td>{student.comunidad}</td>
                <td>{student.observations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}