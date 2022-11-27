import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

import { CiSearch } from "react-icons/ci";
import { MdPeople } from "react-icons/md";
import { IFirebaseContext, useFirebase } from "../context/FirebaseContext";
import { User } from "../types";
type TLobbyProps = {
  users: User[];
  handleClick: (user: User) => void;
};
const Lobby: React.FunctionComponent<TLobbyProps> = ({
  users,
  handleClick,
}) => {
  const { currentUser } = useFirebase() as IFirebaseContext;
  return (
    <Stack spacing={9} height="full">
      <Flex align="center" width="full" justify="space-between">
        <Flex align="center" gap={3}>
          <Box borderBottom="2px" borderColor="blue.400" p={2}>
            <Text textAlign="center" fontWeight="semibold">
              Online People
            </Text>
          </Box>
          <Flex>
            <InputGroup>
              <InputLeftElement>
                <CiSearch />
              </InputLeftElement>
              <Input placeholder="Username" variant="filled" />
            </InputGroup>
          </Flex>
        </Flex>
        <Button
          colorScheme="green"
          bg="green.400"
          color="white"
          height="32px"
          leftIcon={<MdPeople size="28" />}
        >
          Start room
        </Button>
      </Flex>
      <Flex height="100%">
        {users
          .filter(
            (user) =>
              user.username !==
              `${currentUser?.displayName} - ${currentUser?.email}`
          )
          .map((item) => (
            <Flex
              key={item.socketID}
              onClick={() => handleClick(item)}
              cursor="pointer"
              align="center"
              justify="center"
              rounded="xl"
              direction="column"
              px={2}
              py={2}
              _hover={{
                bg: "whiteAlpha.200",
              }}
            >
              <Avatar src={item.displayPicture} size="lg" name="Sabbr Raham">
                <AvatarBadge boxSize="1em" borderColor="black" bg="green" />
              </Avatar>
              <Text fontWeight="semibold">{item.username.split("-")[0]}</Text>
            </Flex>
          ))}
      </Flex>
    </Stack>
  );
};

export default Lobby;
