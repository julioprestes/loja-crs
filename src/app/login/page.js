'use client'
import { Box, Image, Heading, Text, VStack, Button, Link as ChakraLink } from "@chakra-ui/react";
import React from 'react';
import LoginInput from "@/components/loginInput";
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from "@/utils/axios";
import { useRouter } from 'next/navigation';
import NextLink from "next/link";


export default function LoginPc() {
  const router = useRouter();


  const loginUsuario = async (content) => {
      if (!content.email || !content.email.includes('@')) {
        toaster.create({
          description: "Por favor, insira um e-mail válido.",
          type: "error",
        });
        return;
      }
  try {
    console.log("Tentando login com:", content);
    const response = await axios.post(`/users/login`, { ...content });
    console.log("Resposta do backend:", response);

    if (response.status == 200) {
      toaster.create({
        description: "Login realizado com sucesso! Redirecionando...",
        type: "success",
      });
      // Corrija aqui:
      localStorage.setItem("token", response.data.response); 
      localStorage.setItem("userId", response.data.user.id);
      router.push('/');
      return;
    } else {
      toaster.create({
        description: "Erro ao fazer login!",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    toaster.create({
      description: error?.response?.data?.message || "ERROR!",
      type: "error",
    });
  }
}

  const receberDadosdoFilho = async (content) => {
    await loginUsuario(content)
  };


  return (
    <Box
      w="100vw"
      h="100vh"
      minH="100vh"
      minW="100vw"
      position="relative"
      display="flex"
      justifyContent="center"s
      alignItems="center"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      backgroundImage="url('/pizzaria-fundo.jpg')"
    >
      <Box position="absolute" top={6} right={8} zIndex={2}>
        <Button as={NextLink} href="/" color="black" bg="white" _hover={{ bg: "#eb8f34" }}>
          Voltar à Pizzaria
        </Button>
      </Box>
      <Box w="50%" h="100vh" zIndex={2}></Box>
      <Box
        w="40%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={2}
      >
        <VStack align="left" >
          <Box display="flex" justifyContent="center">
            <Image
              src="/Pizza_Steve.png"
              alt="Logo Steve" 
              objectFit="contain"
              boxSize="120px"
            />
          </Box>
          <Heading textAlign="center" as="h1" fontSize={40} fontWeight={600} color="whiteAlpha.950" >
            Bem-Vindo!
          </Heading>
          <Text m="0" fontSize="lg" color="whiteAlpha.950" textAlign="center" opacity={0.8} >
            Cadastre-se na Pizzaria!
          </Text>
          <LoginInput mandarDadosdofilho={receberDadosdoFilho} />
        </VStack>
      </Box>
      <Toaster />
    </Box>
  );
} 