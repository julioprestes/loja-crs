'use client'
import { Text, Button, Stack, HStack, RadioGroup } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import { PasswordInput } from "@/components/ui/password-input"
import { withMask } from "use-mask-input"


export default function CadastroInput() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [cpf, setCpf] = useState('');
  const router = useRouter();

  const mandarDados = async () => {
    if (!nome || !email || !password || !cpf || !username || !phone) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error"
      });
      return;
    }

    try {
        const response = await api.post('/users', {
            nome: nome,
            email: email,
            password: password,
            cpf: cpf,
            role: 'user',
            username: username,
            phone: phone,
            });

        if (response.status === 201) {
            toaster.create({
              title: "Cadastro feito com sucesso.",
              type: "success"
            });
            router.push('/login'); 
          } else {
            toaster.create({
              title: response.data.message || "Erro ao realizar cadastro!",
              type: "error"
            });
          }
        } catch (error) {
          console.error("Erro na requisição:", error.response?.data || error.message);
          toaster.create({
            title: error.response?.data?.message || "Erro ao conectar com o servidor!",
            type: "error"
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
  }, [nome, email, password, cpf, phone, username]);

  return (
    <Stack spacing={4}>
      <Input
        variant="outline"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        color="black"
      />
      <Input
        variant="outline"
        placeholder="Usuário (deve ser único)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        color="black"
      />
      <Input
        variant="outline"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        color="black"
      />
      <PasswordInput
        placeholder="Senha"
        variant="outline"
        mr={2}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        color="black"
      />
      <Input
        placeholder="CPF"
        ref={withMask("999.999.999-99")}
        variant="outline"
        mr={2}
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        color="black"
      />
      <Input
        placeholder="Telefone"
        ref={withMask('99999-9999')}
        variant="outline"
        mr={2}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        color="black"
      />
      <Button onClick={mandarDados} colorScheme="blue" color="white" bg="black">
        Cadastrar
      </Button>
      <Toaster />
    </Stack>
  );
}