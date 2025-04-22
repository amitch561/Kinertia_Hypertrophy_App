
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20">
        {children}
      </div>
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export default Layout;
