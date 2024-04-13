import GetStudentsByCourse from "./GetSudentsByCourse";

export default async function GetStudentByCedulaAndCourse(cedula, code) {
  const students = await GetStudentsByCourse(code)
  const studentFound = students.find(x => x.cedula == cedula)
  return studentFound
}