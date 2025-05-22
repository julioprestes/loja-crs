'use client';
import { Box, Heading, VStack, HStack, Button, Link as ChakraLink, Text } from "@chakra-ui/react";
import CadastroInput from "@/components/cadastroInput";
import NextLink from "next/link";

export default function CadastroPage() {
  return (
    <Box 
      w="100vw"
      h="100vh"
      minH="100vh"
      minW="100vw"
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="whiteAlpha.950"
    >
      <Box position="absolute" top={6} right={8} zIndex={10}>
        <HStack>
          <Text color="black"> Já possui uma conta? </Text>
          <Button as={NextLink} href="/login" color="white" bg="black">
            Fazer Login
          </Button>
        </HStack>
      </Box>
      <Box w="50%" h="100vh" zIndex={2}></Box>
      <Box
        w="40%"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        zIndex={2}
      >
        <VStack align="left" spacing={4}>
          <Heading mb={4} fontSize="3xl" color="black">Cadastro</Heading>
          <CadastroInput />
        </VStack>
      </Box>
    </Box>
  );
}