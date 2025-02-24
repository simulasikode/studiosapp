// hooks/auth/useGoogleSignIn.ts
import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Adjust path
import { useToast } from "../../utils/toast"; // Adjust path
import { getErrorMessage } from "./authUtils"; // <-- IMPORT getErrorMessage from authUtils.ts

const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getAuth(), provider);
      const user = result.user;

      // Check if user document exists. If not, create one.
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(
          docRef,
          {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: "google",
            createdAt: new Date(),
            role: "user",
          },
          { merge: true },
        );
        showToast(
          "Success",
          "Signed in with Google and data stored!",
          "success",
        );
      } else {
        showToast("Success", "Signed in with Google!", "success");
      }
      return user; // Return the user after successful Google Sign-in
    } catch (error: any) {
      const errorMessage = getErrorMessage(error); // Now getErrorMessage is correctly imported!
      showToast("Error", errorMessage, "error");
      throw error; // Re-throw the error for the component to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  return { googleSignIn, isLoading };
};

export default useGoogleSignIn;
