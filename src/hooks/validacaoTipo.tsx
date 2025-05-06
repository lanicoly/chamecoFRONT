// hooks/useUserType.ts
import { useEffect, useState } from 'react';

export function useUserType() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const type = localStorage.getItem("userType");
    setUserType(type);
    
    const handleStorageChange = () => {
      const newType = localStorage.getItem("userType");
      setUserType(newType);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return userType;
}