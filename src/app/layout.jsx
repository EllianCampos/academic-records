import Bootstrap from "@/components/Bootstrap";
import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "Registro Estudiantil",
  description: "Plataforma para el registro de estudiantes y sus calificaciones",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
          <Bootstrap />
        </Providers>
      </body>
    </html>
  );
}
