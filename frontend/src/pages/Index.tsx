
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6 flex-col">
          <img
            src="/lovable-uploads/ae0bbc4b-8585-4a7b-8ce8-7aee614f3756.png"
            alt="Kinertia Labs Logo"
            className="h-24 w-24 mb-4"
          />
          <h1 className="text-4xl font-bold text-primary">Kinertia Labs</h1>
        </div>
        <p className="text-xl text-neutral mb-8">Your Hypertrophy Workout Companion</p>
        <div className="animate-pulse-light w-16 h-1 bg-primary/30 mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default Index;
