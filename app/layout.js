import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Rentogram - Rent Laptops, Monitors & Tech Gadgets",
  description:
    "Rent quality tech goodies like laptops and monitors, with reliable servicing support.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
