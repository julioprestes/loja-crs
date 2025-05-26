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
      justifyContent="flex-start"
      alignItems="center"
      bg="whiteAlpha.950"
      backgroundImage="url('/pizzaria-fundo-cadastro.JPG')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
    >
      <Box position="absolute" top={6} left={8} zIndex={10}>
        <HStack>
          <Text color="white"> Já possui uma conta? </Text>
          <Button as={NextLink} href="/login" color="black" bg="white" _hover={{ bg: "orange" }}>
            Fazer Login
          </Button>
        </HStack>
      </Box>
      <Box
        w="40%"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        zIndex={2}
        ml="20vw"
      >
        <VStack align="left" spacing={4}>
          <Heading mb={4} fontSize="3xl" color="white" textAlign="center">Cadastro</Heading>
          <CadastroInput />
        </VStack>
      </Box>
    </Box>
  );
}