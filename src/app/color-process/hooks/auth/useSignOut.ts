// hooks/auth/useSignOut.ts
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useToast } from "../..//utils/toast"; // Adjust path
import { getErrorMessage } from "./authUtils";

const useSignOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const signUserOut = async () => {
    setIsLoading(true);
    try {
      await signOut(getAuth());
      showToast("Success", "Signed out successfully!", "success");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error); // Assuming you have getErrorMessage utility
      showToast("Error", errorMessage, "error");
      throw error; // Re-throw the error for the component to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  return { signUserOut, isLoading };
};

export default useSignOut;
