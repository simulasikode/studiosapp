// app/service/color-process/hooks/useFirebaseCalculations.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/firebase/config"; // Assuming you have a firebase/config file
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useToast } from "../utils/toast"; // Assuming you have a toast utility
import { CalculationData } from "../utils/types"; // Assuming you have a types file
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  DocumentData,
  SnapshotOptions,
} from "firebase/firestore";

// Define a custom converter for CalculationData
const calculationConverter = {
  toFirestore: (data: CalculationData): DocumentData => {
    // Remove the id before saving
    const { ...rest } = data; // Destructure the id
    return rest;
  },
  fromFirestore: (
    snapshot: any,
    options: SnapshotOptions | undefined,
  ): CalculationData => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Add the document ID *directly* in the return
      ...data,
    } as CalculationData;
  },
};

export const useFirebaseCalculations = () => {
  const [user, setUser] = useState<any>(null); // Assuming user object from Firebase
  const [isLoading, setIsLoading] = useState(true);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<CalculationData[]>(
    [],
  );
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { showToast } = useToast(); // Your toast utility

  const fetchCalculations = useCallback(
    async (uid: string) => {
      if (!uid) return;
      setIsLoading(true);
      try {
        const calculationsQuery = query(
          collection(db, `users/${uid}/calculations`),
          orderBy("timestamp", "desc"),
        );
        const querySnapshot = await getDocs(
          calculationsQuery.withConverter(calculationConverter),
        ); // Use the converter

        const calculations: CalculationData[] = querySnapshot.docs.map((doc) =>
          doc.data(),
        );

        setSavedCalculations(calculations);
      } catch (error) {
        console.error("Error fetching calculations:", error);
        showToast("Error", "Failed to load saved calculations.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setSavedCalculations, showToast],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsGuestUser(currentUser.isAnonymous || false);
        fetchCalculations(currentUser.uid);
      } else {
        setUser(null);
        setIsGuestUser(false);
        setSavedCalculations([]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [fetchCalculations]);

  const getUserDisplayName = () => {
    return user?.displayName || user?.email || "User";
  };

  const saveCalculation = useCallback(
    async (calculationData: CalculationData) => {
      if (!user) {
        showToast("Error", "No user logged in.", "error");
        return;
      }
      try {
        const calculationDocRef = doc(
          db,
          `users/${user.uid}/calculations`,
          calculationData.id,
        ).withConverter(calculationConverter); // Apply the converter
        await setDoc(calculationDocRef, calculationData);
        showToast("Success", "Calculation saved!", "success");
        fetchCalculations(user.uid);
      } catch (error) {
        console.error("Error saving calculation:", error);
        showToast("Error", "Failed to save calculation.", "error");
      }
    },
    [user, showToast, fetchCalculations],
  );

  const deleteCalculation = useCallback(
    async (id: string) => {
      if (!user) {
        showToast("Error", "No user logged in.", "error");
        return;
      }
      try {
        const calculationDocRef = doc(db, `users/${user.uid}/calculations`, id);
        await deleteDoc(calculationDocRef);
        showToast("Success", "Calculation deleted!", "success");
        fetchCalculations(user.uid);
      } catch (error) {
        console.error("Error deleting calculation:", error);
        showToast("Error", "Failed to delete calculation.", "error");
      }
    },
    [user, showToast, fetchCalculations],
  );

  const signOut = useCallback(async () => {
    try {
      setIsSigningOut(true);
      await firebaseSignOut(auth);
      showToast("Success", "Logged out successfully!", "success");
    } catch (error: any) {
      console.error("Error signing out:", error);
      showToast("Error", "Failed to log out.", "error");
    } finally {
      setIsSigningOut(false);
    }
  }, [showToast, setIsSigningOut]);

  return {
    user,
    isLoading,
    isGuestUser,
    savedCalculations,
    isSigningOut,
    saveCalculation,
    deleteCalculation,
    getUserDisplayName,
    signOut,
  };
};
