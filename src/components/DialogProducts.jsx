import React from "react";
import { Dialog, Portal, VStack, Flex, Button, CloseButton, Input, Text } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { MdCheck, MdAdd } from "react-icons/md";
import { FileUpload } from "@chakra-ui/react";

export default function DialogFilme ({
    headers,
    input,
    setInput,
    description,
    setDescription,
    price,
    setPrice,
    idCategory,
    setIdCategory,
    file,
    setFile,
    imagemAtual,
    submit,
    editingIndex,
    isOpen,
    onClose,
    loadingSave
}) {
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", input);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("idCategory", idCategory);
    if (file) {
      formData.append("arquivo", file); 
    }
    submit(formData); 
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {headers.map((header) => (
                <Dialog.Title key={header}>{header}</Dialog.Title>
              ))}
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={4} mb={4}>
                <Input
                  placeholder="Digite o nome do Filme!"
                  variant="subtle"
                  mr={2}
                  value={input}
                  onChange={(valor) => setInput(valor.target.value)}
                />
                <Input
                  placeholder="Digite a descrição do filme!"
                  variant="subtle"
                  mr={2}
                  value={descricao}
                  onChange={(valor) => setDescricao(valor.target.value)}
                />
                <Input
                  placeholder="Digite o nome do autor do Filme!"
                  variant="subtle"
                  mr={2}
                  value={autor}
                  onChange={(valor) => setAutor(valor.target.value)}
                />
                <Input
                  placeholder="Digite a duração do filme! (Em minutos)"
                  variant="subtle"
                  mr={2}
                  value={duracao}
                  onChange={(valor) => setDuracao(valor.target.value)}
                />
                <FileUpload.Root>
                    <FileUpload.HiddenInput onChange={(e) => setFile(e.target.files[0])} />
                    <FileUpload.Dropzone>
                        <FileUpload.Trigger asChild>
                        <Button variant="outline" size="sm">
                            <HiUpload /> Upload da Capa do Filme
                        </Button>
                        </FileUpload.Trigger>
                        {file && <Text mt={2}>Arquivo selecionado: {file.name}</Text>}
                    </FileUpload.Dropzone>
                </FileUpload.Root>
              </VStack>
              <Flex mb={4}>
                <Button 
                  onClick={handleSubmit}
                  background="green"
                  color="white"
                  isLoading={loadingSave}
                  loadingText="Salvando..."
                >
                  {editingIndex !== null ? <MdCheck /> : <MdAdd />}
                </Button>
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