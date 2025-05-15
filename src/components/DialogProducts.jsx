import React from "react";
import { Dialog, Portal, VStack, Flex, Button, CloseButton, Input, Text } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { MdCheck, MdAdd } from "react-icons/md";
import { FileUpload } from "@chakra-ui/react";

export default function DialogProduto ({
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
                  placeholder="Digite o nome do Produto!"
                  variant="subtle"
                  mr={2}
                  value={input}
                  onChange={(valor) => setInput(valor.target.value)}
                />
                <Input
                  placeholder="Digite a descrição do Produto!"
                  variant="subtle"
                  mr={2}
                  value={description}
                  onChange={(valor) => setDescription(valor.target.value)}
                />
                <Input
                  placeholder="Digite o valor do Produto!"
                  variant="subtle"
                  mr={2}
                  value={price}
                  onChange={(valor) => setPrice(valor.target.value)}
                />
                <Input
                  placeholder="Digite o ID da Categoria do Produto!"
                  variant="subtle"
                  mr={2}
                  value={idCategory}
                  onChange={(valor) => setIdCategory(valor.target.value)}
                />
                <FileUpload.Root>
                    <FileUpload.HiddenInput onChange={(e) => setFile(e.target.files[0])} />
                    <FileUpload.Dropzone>
                        <FileUpload.Trigger asChild>
                        <Button variant="outline" size="sm">
                            <HiUpload /> Upload da Imagem
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