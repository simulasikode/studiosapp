// hooks/auth/useLogin.ts
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "../../utils/toast"; // Adjust path
import { getErrorMessage } from "./authUtils"; // <-- IMPORT getErrorMessage from authUtils.ts

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Success", "Logged in successfully!", "success");
      return getAuth().currentUser; // Return the current user after login
    } catch (error: any) {
      const errorMessage = getErrorMessage(error); // Now getErrorMessage is correctly imported!
      showToast("Error", errorMessage, "error");
      throw error; // Re-throw the error for the component to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};

export default useLogin;
