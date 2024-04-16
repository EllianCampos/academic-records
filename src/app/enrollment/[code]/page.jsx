'use client'

import { useEffect, useState } from "react"
import Link from "next/link";
import StudentForm from "@/components/forms/StudentForm";

export default function EnrollmentPage(props) {

  const [showError, setShowError] = useState(false)

  const fetchCourseEnrollmentState = () => {
    fetch(`/api/enrollment/${props.params.code}`)
      .then(res => res.json())
      .then(res => {
        if (res.ok) {

        } else {
          setShowError(true)
        }
      })
  }

  useEffect(() => {
    fetchCourseEnrollmentState()
  }, [])

  return (
    <section className="container">
      <h1 className="mt-5 text-center">Matrícula</h1>
      {showError ? (
        <>
          <div className="alert alert-danger mt-3 fs-4 text-center">
            <p className="m-0">La matricula para este curso no esta disponible</p>
          </div>
          <div className="d-flex justify-content-center">
            <Link href="/" className="btn btn-success">Volver</Link>
          </div>
        </>
      ) : (
        <StudentForm 
          method='POST'
          id='publicEnrollment'
          student={null}
          courseCode={props.params.code}
          enrolledByTeacher={false}
        />
      )}
    </section>
  )
}