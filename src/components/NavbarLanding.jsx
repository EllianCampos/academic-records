import Link from "next/link";

export default function NavbarLanding() {
  return (
    <nav className="navbar bg-dark">
      <div className="container-fluid d-flex justify-content-around  ">
        <Link className="navbar-brand text-light" href="/">Registro Estudiantil</Link>
        <div className="d-flex flex-row">
        <Link href='/signup' className="mt-2 nav-link text-light">Registrarse</Link>
        <Link href='/courses' className="btn btn-success ms-2">Ingresar</Link>
        </div>
      </div>
    </nav>
  )
}