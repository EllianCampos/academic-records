export default function Teachers() {

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="my-3">
				<h2 className="text-primary">Profesores</h2>
				<p>Esta sección solo es visible para el profesor creador del curso, y le permite invitar o eliminar profesores</p>

				<h4>Invitar un profesor</h4>
				<form className="row mb-3">
					<div className="col-12 col-sm-4 col-md-3 text-center ">
						<label htmlFor="email">Correo electrónico</label>
					</div>
					<div className="col-12 col-sm-8 col-md-5">
						<input type="email" id="email" className="form-control" />
					</div>
					<div className="col-12 col-md-4 mt-3 mt-md-0 ">
						<input type="submit" value="Enviar invitación" className="form-control btn btn-outline-success" />
					</div>
				</form>

				<table className="table">
					<thead>
						<tr>
							<th>Apellidos</th>
							<th>Nombre</th>
							<th>Correo electrónico</th>
							<th></th>
						</tr>
					</thead>
				</table>
			</section>
  )
}