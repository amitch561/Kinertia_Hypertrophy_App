
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button-component";
import { Home, Dumbbell, Plus, Calendar, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-light p-4 flex justify-around items-center shadow-lg z-50">
      <Button 
        variant="ghost" 
        className={isActive('/dashboard') ? "text-primary" : "text-gray-400"} 
        onClick={() => handleNavigation('/dashboard')}
      >
        <Home className="h-6 w-6" />
      </Button>
      <Button 
        variant="ghost" 
        className={isActive('/workout') ? "text-primary" : "text-gray-400"}
        onClick={() => handleNavigation('/workout')}
      >
        <Dumbbell className="h-6 w-6" />
      </Button>
      <Button 
        variant="ghost" 
        className={isActive('/create-workout') ? "text-primary" : "text-gray-400"}
        onClick={() => handleNavigation('/create-workout')}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <Button 
        variant="ghost" 
        className={isActive('/calendar') ? "text-primary" : "text-gray-400"}
        onClick={() => handleNavigation('/calendar')}
      >
        <Calendar className="h-6 w-6" />
      </Button>
      <Button 
        variant="ghost" 
        className={isActive('/profile') ? "text-primary" : "text-gray-400"}
        onClick={() => handleNavigation('/profile')}
      >
        <User className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default BottomNav;
