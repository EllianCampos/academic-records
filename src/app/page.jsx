import Link from "next/link";
import NavbarLanding from "@/components/NavbarLanding";
import CommentsForm from "@/components/CommentsForm";

export default function HomePage() {
  return (
    <>
      <header className="mb-3">
        <NavbarLanding />
      </header>

      <main>
        {/* <section className="p-3 text-light bg-opacity-75 bg-dark  ">
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
        </section> */}

        <section className="container p-5">
          <h2>Soy un estudiante</h2>
          <p>Si sos un estudiante podes consultar tus calificaciones y el estado de tus cursos</p>
          <Link href="/students" className="btn btn-success" >Ir al portal de estudiantes</Link>
        </section>

        <section className="container-fluid bg-dark text-info py-5">
          <div className="container border border-5 rounded-5 border-light p-3 p-md-5 text-small">
            <p className="font_resize">
              Nuestro sistema está diseñado para facilitar la labor de los docentes. Con esta plataforma, los profesores pueden&nbsp;
              <span className="fw-bold text-light">
                registrar a sus estudiantes, crear evaluaciones personalizadas, revisar el progreso de los alumnos y generar calificaciones de manera eficiente.
              </span>
              &nbsp;Ya no tendrás que lidiar con montones de papeles y hojas de cálculo; todo está centralizado en un solo lugar. Además, podrás acceder a las notas y estadísticas de tus estudiantes de forma rápida y sencilla.
            </p>
          </div>
        </section>

        {/* <section className="d-flex justify-content-center align-items-center  min-vh-100 ">
          <SignInPage hideBackBotton={true} />
        </section> */}

        <section className="container py-4">
          <h2>Comentarios</h2>
          <CommentsForm />
        </section>
      </main>

      <footer className="container-fluid bg-dark text-light row p-5">
        <div className="col">
          <p>
            Plataforma desarrolla y mantenida por:
            <span className="fw-bold"> Ellian Campos Ceciliano</span>
          </p>
        </div>
        <div className="col">
          <h3>Contacto</h3>
          <div>
            <a
              href="https://api.whatsapp.com/send?phone=50684838466&text=Hola%20Ellian%2C%20te%20escribo%20por%20motivo%20la%20plataforma%20de%20registro%20estudiantil%2C%20te%20comento%20que%3A"
              className="text-success text-decoration-none"
              target="_blank"
            >
              <i className="bi bi-whatsapp"> 8483-8466</i>
            </a>
            <br />
            <a
              href="mailto:ellian.campos12@gmail.com"
              className="text-light text-decoration-none mt-3"
              target="_blank"
            >
              <i className="bi bi-envelope"> ellian.campos12@gmail.com</i>
            </a>
            <br />
            <a
              href="https://elliancampos.netlify.app/"
              className="text-light text-decoration-none"
              target="_blank"
            >
              <i className="bi bi-globe2"> https://elliancampos.netlify.app</i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
