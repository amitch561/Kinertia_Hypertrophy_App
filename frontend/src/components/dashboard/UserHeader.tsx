
import React from 'react';

interface UserHeaderProps {
  userName: string;
}

const UserHeader = ({ userName }: UserHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="/lovable-uploads/ae0bbc4b-8585-4a7b-8ce8-7aee614f3756.png" 
            alt="Kinertia Labs Logo" 
            className="h-8 w-8 mr-2"
          />
          <span className="text-sm text-gray-400">Kinertia</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back,</h1>
        <h2 className="text-2xl font-bold">{userName}!</h2>
      </div>
    </div>
  );
};

export default UserHeader;
