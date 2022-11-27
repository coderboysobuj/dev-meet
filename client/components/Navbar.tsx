import { Avatar, Container, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { IFirebaseContext, useFirebase } from "../context/FirebaseContext";
import { FaCode } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar: React.FunctionComponent = () => {
  const { currentUser } = useFirebase() as IFirebaseContext;
  return (
    <Flex align="center" justify="space-between">
      <Flex align="center" gap={2}>
        <FaCode size="40" />
        <Heading size="lg">Dev Meet</Heading>
      </Flex>
      <Flex align="center" gap={2}>
        <Text fontSize="lg" fontWeight="semibold">
          {currentUser?.displayName}
        </Text>
        <Avatar
          size="md"
          cursor="pointer"
          onClick={() => signOut(auth)}
          name={currentUser?.displayName as string}
          src={currentUser?.photoURL as string}
        />
      </Flex>
    </Flex>
  );
};

export default Navbar;
