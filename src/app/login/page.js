'use client'
import { Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import React from 'react';
import LoginInput from "@/components/loginInput";
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from "@/utils/axios";
import { useRouter } from 'next/navigation';

export default function LoginPc() {
  const router = useRouter();


  const loginUsuario = async (content) => {
    router.push('/login');
    try {
      const response = await axios.post(`/users/login`, { ...content });
      if (response.status == 200) {
        toaster.create({
          description: "Login realizado com sucesso! Redirecionando...",
          type: "success",
        });
        
        localStorage.setItem('token', response.data.response);
        router.push('/');
      } else {
        toaster.create({
          description: "Erro ao fazer login!",
          type: "error",
        })
      }
    } catch (error) {
      toaster.create({
        description: "ERROR!",
        type: "error",
      })
    }
  }

  const receberDadosdoFilho = async (content) => {
    await loginUsuario(content)
  };


  return (
    <Box
    w="100%" h="100vh" display="flex" justifyContent="center" alignItems="center" 
    filter="contrast(95%)"
    bgSize="100% 115%"
    bgPosition="center"
    bgRepeat="no-repeat"
  >
    {/* Remova o Box vazio */}
    <Box w="50%" h="100vh">
      <Image
        width="100%"
        height="100%"
        objectFit="cover"
        src="/mercadin.png"
        alt="Loading..."
      />
    </Box>
    <Box
      w="40%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack align="left" >
        <Heading color="white" textAlign="center" as="h1" fontSize={40} fontWeight={600} >
          Bem-Vindo
          <span style={{ fontFamily: "monospace", fontSize: "1.2em", color: "white" }} >!</span>
        </Heading>
        <Text m="0" fontSize="lg" color="white" textAlign="center" opacity={0.8} >
          Cadastre-se no Mercado!
        </Text>
        <LoginInput mandarDadosdofilho={receberDadosdoFilho} />
      </VStack>
    </Box>
    <Toaster />
  </Box>
  );
} 