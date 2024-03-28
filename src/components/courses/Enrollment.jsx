'use client'
import Swal from "sweetalert2";
import AddStudentModal from "../Modals/AddStudentModal";

export default function Enrollment({ students, courseCode, fetchStudents }) {

  const handleDelete = (id) => {
    Swal.fire({
      title: "Eliminar estudiante",
      text: "¿Estás seguro que deseas eliminar el estudiante?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "##6c757d",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading()
        fetch(`/api/students/${id}?courseCode=${courseCode}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(res => {
            Swal.close()
            if (res.errorMessage) {
              Swal.fire({
                title: 'Error, algo salio mal',
                text: res.errorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              })
            } else {
              Swal.fire({
                title: "Estudiante Eliminado",
                text: res.message,
                icon: "success"
              }).then(result => {
                location.href = `/courses/${courseCode}`
              })
            }
          })
      }
    });
  }

  return (
    <section className="mt-3">
      <div className="d-flex justify-content-between mt-3">
        <h3 className="text-primary">Matrícula</h3>
        <AddStudentModal
          btnText='Nuevo estudiante'
          icon='bi bi-plus-person-plus'
          color='success'
          method='POST'
          id='editStudentModal'
          courseCode={courseCode}
          fetchStudents={fetchStudents}
        />
      </div>
      <div className="table-responsive" style={{ maxHeight: "50vh" }}>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th className="sticky-top"></th>
              <th className="sticky-top">Cédula</th>
              <th className="sticky-top">Apellidos</th>
              <th className="sticky-top">Nombre</th>
              <th className="sticky-top">Fecha de nacimiento</th>
              <th className="sticky-top">Genero</th>
              <th className="sticky-top">Teléfono</th>
              <th className="sticky-top">Correo electrónico</th>
              <th className="sticky-top">Discapacidad</th>
              <th className="sticky-top">Descripción de la discapacidad</th>
              <th className="sticky-top">Provincia</th>
              <th className="sticky-top">Cantón</th>
              <th className="sticky-top">Distrito</th>
              <th className="sticky-top">Comunidad</th>
              <th className="sticky-top">Observaciones</th>
            </tr>
          </thead>
          <tbody className="mt-3">
            {students.map((student, index) => (
              <tr key={index}>
                <td className="d-flex p-3">
                  <AddStudentModal
                    icon='bi bi-pencil-square'
                    color='primary'
                    method='PUT'
                    student={student}
                    id={student.id}
                    courseCode={courseCode}
                    fetchStudents={fetchStudents}
                  />
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDelete(student.cedula)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
                <td>{student.cedula}</td>
                <td>{student.lastname}</td>
                <td>{student.name}</td>
                <td><input type="date" value={student.bornDate.substring(0, 10)} readOnly /></td>
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