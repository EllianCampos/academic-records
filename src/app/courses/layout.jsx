import Navbar from "@/components/Navbar";

export default function CoursesLayout({ children }) {
	return (
		<>
			<Navbar />
			{children}
		</>
	)
}