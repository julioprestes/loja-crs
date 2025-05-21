import { Button, CloseButton, Dialog, Portal, Input, Flex, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster";

export default function DialogRecuperarSenha({
  isOpen,
  onClose,
  email,
}) {
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const redefinirSenha = async () => {
    if (!codigo || !novaSenha || !confirmarSenha) {
      toaster.create({
        title: "Preencha todos os campos!",
        type: "error",
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toaster.create({
        title: "As senhas não coincidem!",
        type: "error",
      });
      return;
    }

    try {
      const response = await api.post('/usuario/redefinir-senha', {
        email,
        codigo,
        novaSenha,
      });

      if (response.status === 200) {
        toaster.create({
          title: "Senha redefinida com sucesso!",
          type: "success",
        });
        onClose();
      } else {
        toaster.create({
          title: response.data.message || "Erro ao redefinir a senha.",
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

  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Redefinir Senha</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={4} mb={4}>
                <Text mb={2} textAlign="left">Insira o código enviado ao seu e-mail:</Text>
                <Input
                  placeholder="Código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  mb={4}
                />
                <Text mb={2} textAlign="left">Insira a sua nova senha:</Text>
                <Input
                  placeholder="Nova Senha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  mb={4}
                />
                <Text mb={2} textAlign="left">Confirme sua nova senha:</Text>
                <Input
                  placeholder="Confirmar Nova Senha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </VStack>
              <Flex mb={4}>
                <Button colorScheme="blue" mr={3} onClick={redefinirSenha}>
                  Redefinir
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              </Flex>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}