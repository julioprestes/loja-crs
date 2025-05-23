'use client'
import { Text, Button, Stack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import {
  PasswordInput,
} from "@/components/ui/password-input"
import { InputGroup } from "@/components/ui/input-group"
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import React from 'react';
import { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import DialogRecuperarSenha from "@/components/DialogRecuperarSenha"; 

export default function LoginInput({ mandarDadosdofilho }) {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const content = { email: Email, password: Password };
  const router = useRouter();

  const mandarDados = async () => {
    if (!Password || !Email) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error"
      })
      return;
    }
    mandarDadosdofilho(content);
  };

  const cadastrarDados = async () => {
    router.push("/cadastro")
  };

  const recuperarSenha = async () => {
    if (!Email) {
      toaster.create({
        title: "Por favor, insira seu e-mail para recuperar a senha.",
        type: "error",
      });
      return;
    }
    try {
      const response = await api.post('/users/recuperar-senha', { email: Email });
      console.log("Resposta do servidor:", response);
      if (response.status === 200) {
        toaster.create({
          title: "Código de recuperação enviado",
          type: "success",
        });
        setIsDialogOpen(true);
      } else {
        toaster.create({
          title: response.data.message || "Erro ao recuperar a senha.",
          type: "error",
        });
      }
    } catch (error) {
      toaster.create({
        title: error.response?.data?.message || "Erro ao conectar ao servidor.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        mandarDados();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mandarDados]);


  return (
    <Stack>
      <InputGroup mt="7%" startElement={<FaUser color="white" opacity={0.8} />} w="100%" >
        <Input
          variant="outline"
          placeholder="Login"
          onChange={(e) => setEmail(e.target.value)}
          color="white"
        />
      </InputGroup>
      <InputGroup mt="2%" startElement={<FaLock color="white" opacity={0.8} />} w="100%" >
        <PasswordInput
          variant="outline"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          color="white"
        />
      </InputGroup>
      <Text
        m="0"
        mt="1%"
        cursor="pointer"
        opacity={0.8}
        onClick={recuperarSenha}
        color="whiteAlpha.950"
      >
        Esqueceu a senha?
      </Text>
      <DialogRecuperarSenha
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        email={Email}
        color="whiteAlpha.950"
      />
      <Button
        onClick={mandarDados}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            mandarDados();
          }
        }}
        mt="5%"
        borderRadius={5}
        _hover={{ bg: "#eb8f34" }}
        tabIndex={0}
        bg="whiteAlpha.950"
        color="black"
      >Entrar
      </Button>
      <Text m="0" mt="1%" mb="1%" textAlign={"center"} color="whiteAlpha.950" >OU</Text>
      <Button
        onClick={cadastrarDados}
        borderRadius={5}
        _hover={{ bg: "#eb8f34" }}
        bg="whiteAlpha.950"
        color="black"
      >Cadastrar
      </Button>
      <Toaster />
    </Stack>
  );
}