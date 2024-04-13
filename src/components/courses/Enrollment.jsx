'use client'
import Swal from "sweetalert2";
import AddStudentModal from "../Modals/AddStudentModal";
import { useState } from "react";

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
          <thead className="sticky-top">
            <tr>
              <th ></th>
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