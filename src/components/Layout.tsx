import Background from "./shared/Backgound";
import { Header } from "./elements/Header";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Background /> 
      <Header />
      <main className="relative flex flex-col gap-y-20 md:gap-y-32 overflow-hidden z-10">
        {children}
      </main>
    </>
  );
}

export default Layout;