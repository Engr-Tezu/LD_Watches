import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HashScrollHandler from "@/components/layout/HashScrollHandler";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-ld-black">
      <HashScrollHandler />
      <Navbar />
      <main className="flex-1 bg-ld-black">{children}</main>
      <Footer />
    </div>
  );
}
