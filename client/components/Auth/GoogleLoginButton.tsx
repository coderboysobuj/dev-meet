import { Button } from "@chakra-ui/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IFirebaseContext, useFirebase } from "../../context/FirebaseContext";

const GoogleLoginButton: React.FunctionComponent = () => {
  const { signInWithGooglePopup } = useFirebase() as IFirebaseContext;
  return (
    <Button variant="outline" gap={2} onClick={() => signInWithGooglePopup()}>
      <FcGoogle size="30" />
      Login with goole
    </Button>
  );
};

export default GoogleLoginButton;
