import Link from "next/link";

export default function Course({ course, color }) {
	return (
		<Link
			href={`/courses/${course.code}`}
			key={course.code}
			style={{ width: '400px', textDecoration: 'none', overflow: 'hidden' }}
			className="border border-1 m-3 w-30 text-black bg-light rounded"
		>
			<h3
				className="text-center text-light p-2"
				style={{ background: color }}
			>
				{course.name}
			</h3>
			<div className="p-2">
				<p>
					<span className="fw-bold">Horario: </span>
					{course.schedule}
				</p>
				<p>
					<span className="fw-bold">Profesor(es): </span>
					{course.usercourses.map(teacher => (
						<span key={teacher.id}>
							<br />
							{`- ${teacher.users.name} ${teacher.users.lastname}`}
						</span>
					))}
				</p>
			</div>
			<div className="row text-center bg-secondary text-light">
						<div className="col-6 p-0">
							<span className="fw-bold fs-2 d-block">{course.numberStudentsEnrolled}</span>
							<span>Estudiantes</span>
						</div>
						<div className="col-6">
							<span className="fw-bold fs-2 d-block">{course.quota}</span>
							<span>Máximo</span>
						</div>
			</div>
		</Link>
	)
}