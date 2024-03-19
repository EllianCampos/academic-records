import Link from "next/link";

export default function Course({ course, color }) {
	return (
		<div className="">
			<Link
				href={`/courses/${course.code}`}
				key={course.code}
				// style={{ width: '400px', textDecoration: 'none', overflow: 'hidden' }}
				// className="border border-1 m-3 w-30 text-black bg-light rounded"
				// className="col-xs-4 col-sm-4 col-md-4 col-lg-4"
				className="text-decoration-none"
			>
				<div className="text-light">
					<h3
						className="text-center p-2 m-0 rounded-top-2 font_resize"
						style={{ background: color }}
					>
						{course.name}
					</h3>
				</div>

				<div className="bg-light px-2 py-4 text-dark">
					<p className="m-0">
						<span className="fw-bold">Horario: </span>
						{course.schedule}
					</p>
					<p className="m-0 mt-3">
						<span className="fw-bold">Profesor(es): </span>
						{course.usercourses.map(teacher => (
							<span key={teacher.id}>
								<br />
								{`- ${teacher.users.name} ${teacher.users.lastname}`}
							</span>
						))}
					</p>
				</div>

				<div className="text-center bg-secondary text-light rounded-bottom-2">
					<div className="row">
						<div className="col-6 p-0">
							<span className="fw-bold fs-2 d-block">{course.numberStudentsEnrolled}</span>
							<span>Estudiantes</span>
						</div>
						<div className="col-6">
							<span className="fw-bold fs-2 d-block">{course.quota}</span>
							<span>Máximo</span>
						</div>
					</div>
				</div>
			</Link>
		</div>

	)
}