// hooks/auth/useSignup.ts
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useToast } from "../../utils/toast"; // Adjust path
import { createUserDocument, getErrorMessage } from "./authUtils"; // We'll create this next

const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await updateProfile(user, {
        // Update user profile with displayName
        displayName: displayName,
      });
      await createUserDocument(user, "email/password", displayName);
      showToast("Success", "Account created!", "success");
      return user; // Return the user if signup is successful
    } catch (error: any) {
      const errorMessage = getErrorMessage(error); // Assuming you have getErrorMessage utility
      showToast("Error", errorMessage, "error");
      throw error; // Re-throw the error for the component to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};

export default useSignup;
