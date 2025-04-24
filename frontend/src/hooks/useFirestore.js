import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const useFirestore = () => {
  const addData = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  };

  return { addData };
};

export default useFirestore;
