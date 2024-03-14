'use client'

import Swal from "sweetalert2"

export default function CommentsForm() {

  const handleSubmit = (event) => {
    event.preventDefault()
    Swal.showLoading()

    fetch('/api/comments', {
      method: 'POST',
      headers: {
        'ContentType': 'application/json'
      },
      body: JSON.stringify({
        description: event.target.description.value
      })
    })
      .then(res => res.json())
      .then(res => {
        Swal.close()

        if (res.issues) {
          Swal.fire({
            title: 'Información incompleta',
            text: res.issues[0].message,
            icon: 'warning',
            confirmButtonText: 'Lo corregiré'
          })
        } else if (res.errorMessage) {
          Swal.fire({
            title: 'Error, algo salio mal',
            text: res.errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        } else {
          Swal.fire({
            title: "Recibido",
            text: res.message,
            icon: "success"
          });
        }
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Aquí podés enviar tus comentarios, reportes o sugerencias de forma anonima</label>
      <textarea rows="10" className="form-control" name="description" required></textarea>
      <div className="d-flex justify-content-end ">
        <button
          type="submit"
          className="btn btn-success mt-2"
        >
          Enviar
        </button>
      </div>
    </form>
  )
}