"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  collection,
  DocumentReference,
  DocumentData,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebase"; // Firebase Firestore instance
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Resident } from "@/types/types";

// Types for the context state
interface Log {
  id: string;
  residentId: string;
  activityType?: string;
  incidentType?: string;
  description?: string;
  severity?: "Low" | "Medium" | "High";
  timestamp: string;
}

interface AppContextProps {
  residents: Resident[];
  logs: Log[];
  resident: Resident | null;
  documents: any[];
  loading: boolean;
  residentLoading: boolean;
  error: string | null;
  fetchResidents: () => Promise<void>;
  fetchResident: (residentId: string) => Promise<void>;
  addResident: (residentData: Omit<Resident, "id">) => Promise<Resident>; // Updated to return a full Resident object
  updateResident: (
    residentId: string,
    updatedData: Partial<Resident>
  ) => Promise<void>;
  deleteResident: (residentId: string) => Promise<void>;
  createActivityLog: (activityData: Log) => Promise<void>;
  createIncidentLog: (incidentData: Log) => Promise<void>;
  fetchAllLogs: () => Promise<void>;
  fetchResidentLogs: (residentId: string) => Promise<void>;
  uploadImageForResident: (
    fullName: string,
    imageFile: File
  ) => Promise<string>;
  uploadDocumentForResident: (
    residentId: string,
    file: File,
    fileName?: string
  ) => Promise<string>;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Export a custom hook to use the context
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// AppProvider Component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [resident, setResident] = useState<Resident | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [residentLoading, setResidentLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all residents
  const fetchResidents = async (): Promise<Resident[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "residents"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Resident[];
    } catch (error) {
      console.error("Error fetching residents:", error);
      throw new Error("Failed to fetch residents");
    }
  };

  // Fetch a single resident
  const fetchResident = async (residentId: string) => {
    try {
      setResidentLoading(true);
      const docRef = doc(db, "residents", residentId);
      const residentDoc = await getDoc(docRef);
      if (residentDoc.exists()) {
        setResident({
          id: residentDoc.id,
          ...residentDoc.data(),
        } as Resident);
      } else {
        setError("Resident not found");
      }
    } catch (err) {
      setError("Failed to fetch resident");
      console.error(err);
    } finally {
      setResidentLoading(false);
    }
  };

  // Add a new resident
  const addResident = async (
    residentData: Omit<Resident, "id">
  ): Promise<Resident> => {
    try {
      const docRef: DocumentReference<DocumentData> = await addDoc(
        collection(db, "residents"),
        residentData
      );

      // Create the resident object with the generated id
      const newResident: Resident = { id: docRef.id, ...residentData };

      // Update the state to include the new resident
      setResidents((prevResidents) => [...prevResidents, newResident]);

      // Return the complete resident object
      return newResident;
    } catch (error) {
      console.error("Error adding resident:", error);
      throw new Error("Failed to add resident");
    }
  };

  // Update a resident
  const updateResident = async (
    residentId: string,
    updatedData: Partial<Resident>
  ) => {
    try {
      await updateDoc(doc(db, "residents", residentId), updatedData);
      setResidents((prev) =>
        prev.map((resident) =>
          resident.id === residentId
            ? { ...resident, ...updatedData }
            : resident
        )
      );
    } catch (err) {
      console.error(err);
      throw new Error("Failed to update resident");
    }
  };

  // Delete a resident
  const deleteResident = async (residentId: string) => {
    try {
      await deleteDoc(doc(db, "residents", residentId));
      setResidents((prev) =>
        prev.filter((resident) => resident.id !== residentId)
      );
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete resident");
    }
  };

  // Create activity log
  const createActivityLog = async (activityData: Log) => {
    try {
      await addDoc(collection(db, "activities"), {
        ...activityData,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error(err);
      throw new Error("Failed to log activity");
    }
  };

  // Create incident log
  const createIncidentLog = async (incidentData: Log) => {
    try {
      await addDoc(collection(db, "incidents"), {
        ...incidentData,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error(err);
      throw new Error("Failed to log incident");
    }
  };

  // Fetch all logs
  const fetchAllLogs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "activities"));
      const logsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Log[];
      setLogs(logsData);
    } catch (err) {
      setError("Failed to fetch logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs for a specific resident
  const fetchResidentLogs = async (residentId: string) => {
    try {
      setLoading(true);
      const logsQuery = query(
        collection(db, "activities"),
        where("residentId", "==", residentId)
      );
      const logsSnapshot = await getDocs(logsQuery);
      const logsData = logsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Log[];
      setLogs(logsData);
    } catch (err) {
      setError("Failed to fetch resident logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upload an image for a resident
  const uploadImageForResident = async (
    fullName: string,
    imageFile: File
  ): Promise<string> => {
    try {
      const imageRef = ref(storage, `residents/${fullName}/${imageFile.name}`);
      console.log("Image reference created:", imageRef);

      const uploadTask = uploadBytesResumable(imageRef, imageFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (err) => {
            console.error("Upload failed:", err);
            reject(err);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File uploaded successfully:", url);
              resolve(url);
            } catch (err) {
              console.error("Error getting download URL:", err);
              reject(err);
            }
          }
        );
      });
    } catch (err) {
      console.error("Error in uploadImageForResident:", err);
      throw new Error("Failed to upload image");
    }
  };

  // Upload a document for a resident
  const uploadDocumentForResident = async (
    residentId: string,
    file: File,
    fileName?: string
  ): Promise<string> => {
    try {
      const fileRef = ref(
        storage,
        `residents/${residentId}/documents/${file.name}`
      );
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "residents", residentId), {
              documents: arrayUnion({
                name: fileName || file.name,
                url: downloadUrl,
                uploadedAt: new Date(),
              }),
            });
            resolve(downloadUrl); // Ensure this resolves to a string
          }
        );
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      throw new Error("Failed to upload document");
    }
  };

  // Context value
  const value = {
    residents,
    logs,
    resident,
    documents,
    loading,
    residentLoading,
    error,
    fetchResidents,
    fetchResident,
    addResident,
    updateResident,
    deleteResident,
    createActivityLog,
    createIncidentLog,
    fetchAllLogs,
    fetchResidentLogs,
    uploadImageForResident,
    uploadDocumentForResident,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
