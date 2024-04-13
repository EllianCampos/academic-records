import StudentForm from "../forms/StudentForm";

export default function AddStudentModal({ btnText, icon, color, method, id, student, courseCode }) {
	
	return (
		<>
			<button type="button" className={`btn btn-${color}`} data-bs-toggle="modal" data-bs-target={`#student${id}Modal`}>
				{btnText && btnText}
				{btnText ? <i className={`${icon} ms-2`}></i> : <i className={icon}></i>}
			</button>

			<div className="modal fade" id={`student${id}Modal`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5">
								{method == 'POST' ? 'Matricular estudiante' : 'Actualizar datos de un estudiante'}
							</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							<StudentForm 
								method={method}
								id={id}
								student={student}
								courseCode={courseCode}
								enrolledByTeacher={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}