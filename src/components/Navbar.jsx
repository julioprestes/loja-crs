import { Box, Button, Flex, Spacer, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

export default function Navbar() {

  return (
    <Flex as="nav"  bg="#323591" color="white" p={4} align="center">
      <Box fontWeight="bold" fontSize="xl">
        Mercado
      </Box>
      <Spacer />
        <>
          <Button as={NextLink} href="/login" colorScheme="teal" variant="solid" mr={2}>
            Login
          </Button>
          <Button as={NextLink} href="/cadastro" colorScheme="teal" variant="solid">
            Cadastro
          </Button>
        </>

    </Flex>
  );
}