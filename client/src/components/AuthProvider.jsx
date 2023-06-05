import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { observer } from "mobx-react-lite";

export const AuthProvider = observer(({ userContext }) => {
  const auth = getAuth(app);
  userContext.setAuth(auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCandidate) => {
      if (userCandidate !== null) {
        return userContext.setUser(userCandidate);
      }
    });

    return unsubscribe;
  }, []);
});
