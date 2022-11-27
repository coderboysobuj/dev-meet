import React from "react";
import { Center, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FaCode } from "react-icons/fa";
import GoogleLoginButton from "./GoogleLoginButton";
const Login: React.FunctionComponent = () => {
  return (
    <Center height="100vh">
      <Stack spacing={5}>
        <Flex align="center" gap={2}>
          <FaCode size="50" />
          <Heading>DeV Meeting</Heading>
        </Flex>
        <GoogleLoginButton />
      </Stack>
    </Center>
  );
};

export default Login;
