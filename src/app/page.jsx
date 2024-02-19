import Link from "next/link";
import SignInPage from '@/app/signin/page'

export default function HomePage() {
  return (
    <>
      <header className="mb-3">
        <h1 className="text-center">Registro estudiantil - control de estudiantes y calificaciones</h1>
      </header>

      <main>
        <section className="p-3 text-light bg-opacity-75 bg-dark  ">
          <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner text-center">
              <div className="carousel-item active" data-bs-interval="1500">
                <h2>Cursos</h2>
              </div>
              <div className="carousel-item" data-bs-interval="1500">
                <h2>Matrícula</h2>
              </div>
              <div className="carousel-item" data-bs-interval="1500">
                <h2>Reportes</h2>
              </div>
              <div className="carousel-item" data-bs-interval="1500">
                <h2>Estudiantes</h2>
              </div>
              <div className="carousel-item" data-bs-interval="1500">
                <h2>Asistencia</h2>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
              <span className="carousel-control-prev-icon text-primary " aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>

        <section className="container p-4">
          <h2>Soy un estudiante</h2>
          <p>Si sos un estudiante podes consultar tus calificaciones y el estado de tus cursos</p>
          <Link href="/students" className="btn btn-success" >Ir al portal de estudiantes</Link>
        </section>

        <section className="container-fluid bg-dark text-info p-5">
          <div className="container border border-5 rounded-5 border-light p-5">
            <p style={{ fontSize: '1.8rem' }}>
              Nuestro sistema está diseñado para facilitar la labor de los docentes. Con esta plataforma, los profesores pueden&nbsp;
              <span className="fw-bold text-light">
                registrar a sus estudiantes, crear evaluaciones personalizadas, revisar el progreso de los alumnos y generar calificaciones de manera eficiente.
              </span>
              &nbsp;Ya no tendrás que lidiar con montones de papeles y hojas de cálculo; todo está centralizado en un solo lugar. Además, podrás acceder a las notas y estadísticas de tus estudiantes de forma rápida y sencilla.
            </p>
          </div>
        </section>

        <section className="my-5 pb-5 min-vh-100 ">
          <SignInPage />
        </section>
      </main>
    </>
  );
}
