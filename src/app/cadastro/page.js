'use client';
import { Box, Heading, VStack } from "@chakra-ui/react";
import CadastroInput from "@/components/cadastroInput";



export default function CadastroPage() {
  return (
    <Box 
      w="100%" h="80vh" display="flex" justifyContent="center" alignItems="center" 
      filter="contrast(95%)"
      bg="whiteAlpha.900"
    >
      <VStack align="center" >
        <Heading mb={4} fontSize="3xl" color="black">Cadastro</Heading>
        <CadastroInput />
      </VStack>
    </Box>
  );
}