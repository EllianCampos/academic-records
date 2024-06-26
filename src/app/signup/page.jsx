'use client'

import Link from "next/link"
import { useState } from "react"
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import NavbarLanding from "@/components/NavbarLanding"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState(null)

  const [name, setName] = useState('')
  const [lastname, setlastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    Swal.showLoading()

    fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, lastname, email, password
      })
    })
      .then(response => {
        Swal.close()
        if (response.status === 201) {
          setError(null)
          signIn('credentials', {
            email, password, redirect: false
          })
            .then(authres => {
              if (authres.ok) {
                router.push('/courses')
              }
            })
        } else {
          return response.json()
        }
      })
      .then(response => {
        if (response) {
          setError(response.errorMessage)
        }
      })
  }

  return (
    <>
    <header>
      <NavbarLanding />
    </header>
    <main className='text-center m-3'>
      <h1>Crea tu cuenta de profesor</h1>
      <form onSubmit={handleSubmit} className='m-5'>
        <div className="row mb-1">
          {
            error !== null && (
              <div className='alert alert-danger text-start'>
                {error}
              </div>
            )
          }
        </div>
        <div className="row mb-3">
          <label htmlFor="name" className='col-sm-2 col-form-label'>Nombre</label>
          <div className="col-sm-10">
            <input
              onChange={event => setName(event.target.value)}
              value={name}
              type="text"
              id="name"
              className='form-control'
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="lastname" className='col-sm-2 col-form-label'>Apellidos</label>
          <div className="col-sm-10">
            <input
              onChange={event => setlastname(event.target.value)}
              value={lastname}
              type="text"
              id="lastname"
              className='form-control'
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="email" className='col-sm-2 col-form-label'>Correo</label>
          <div className="col-sm-10">
            <input
              onChange={event => setEmail(event.target.value)}
              value={email}
              type="email"
              id="email"
              className='form-control'
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="password" className='col-sm-2 col-form-label'>Contraseña</label>
          <div className="col-sm-10">
            <input
              onChange={event => setPassword(event.target.value)}
              value={password}
              type="password"
              name="password"
              id="password"
              className='form-control'
            />
          </div>
        </div>
        <div>
        <button type="submit" className='btn btn-success col-12 col-md-6 mt-2'>Enviar datos</button>
        {/* <Link href="/signin" className='btn btn-primary col-12 col-md-6 mt-2'>Ya tengo una cuenta</Link> */}
        </div>
      </form>
    </main>
    </>
  )
}