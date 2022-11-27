import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth } from "../firebase";

export interface IFirebaseContext {
  currentUser: User | null;
  signInWithGooglePopup: (options?: { redirectTo?: string }) => Promise<any>;
}

const FirebaseContext = createContext<IFirebaseContext | null>(null);

export const useFirebase = () => {
  const state = useContext(FirebaseContext);
  if (state !== null && !state) {
    throw new Error("Wrap the firebase hook inside firebase provider");
  }
  return state;
};

const googleAuthProvider = new GoogleAuthProvider();

type TFirebaseProviderProps = {} & PropsWithChildren;

export const FirebaseProvider: React.FunctionComponent<
  TFirebaseProviderProps
> = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCorrentUser] = useState<User | null>(null);

  const handleOnAuthStateChange = useCallback(
    (e: User | null) => setCorrentUser(e),
    []
  );

  const signInWithGooglePopup = useCallback(
    async (options?: { redirectTo?: string }) => {
      const result = await signInWithPopup(auth, googleAuthProvider);

      if (result.user) {
        if (options && options.redirectTo) {
          router.replace(options.redirectTo);
        }
      }
      return result;
    },
    []
  );

  useEffect(() => {
    const unsubscriptAuthStateChange = onAuthStateChanged(
      auth,
      handleOnAuthStateChange
    );

    return () => {
      unsubscriptAuthStateChange();
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ currentUser, signInWithGooglePopup }}>
      {children}
    </FirebaseContext.Provider>
  );
};
