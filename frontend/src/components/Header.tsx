
// Add a back arrow icon to Header when not on dashboard route

import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <header className="bg-neutral-light border-b border-neutral py-4 px-6">
      <div className="container flex justify-center items-center relative">
        {!isDashboard && (
          <button
            className="absolute left-0 flex items-center text-[#8E9196] hover:text-primary focus:outline-none"
            onClick={() => navigate("/dashboard")}
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center mx-auto">
          <img 
            src="/lovable-uploads/ae0bbc4b-8585-4a7b-8ce8-7aee614f3756.png"
            alt="Kinertia Labs Logo"
            className="h-10 w-10 mr-2"
          />
          <h1 className="text-xl font-bold text-primary">Kinertia Labs</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
