import { Button, CloseButton, Dialog, Portal, Input, Flex, VStack } from "@chakra-ui/react"
import { MdCheck, MdAdd } from 'react-icons/md'
import { withMask } from "use-mask-input"
import { PasswordInput } from "@/components/ui/password-input"

export default function DialogUsuario ({
    headers,
    input,
    setInput,
    senha,
    setSenha,
    email,
    setEmail,
    cpf,
    setCpf,
    role,
    setRole,
    username,
    setUsername,
    phone,
    setPhone,
    submit,
    editingIndex,
    isOpen,
    onClose,
    loadingSave,
}) {
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
                  placeholder="Digite o nome de um Usuário!"
                  variant="subtle"
                  mr={2}
                  value={input}
                  onChange={(valor) => setInput(valor.target.value)}
                />
                <PasswordInput
                  placeholder="Digite a senha de um Usuário!"
                  variant="subtle"
                  mr={2}
                  value={senha}
                  onChange={(valor) => setSenha(valor.target.value)}
                />
                <Input
                  placeholder="Digite o email de um Usuário!"
                  variant="subtle"
                  mr={2}
                  value={email}
                  onChange={(valor) => setEmail(valor.target.value)}
                />
                <Input
                  placeholder="Digite o CPF de um Usuário!"
                  ref={withMask("999.999.999-99")}
                  variant="subtle"
                  mr={2}
                  value={cpf}
                  onChange={(valor) => setCpf(valor.target.value)}
                />
                <Input
                  placeholder="Digite o cargo do Usuário!"
                  variant="subtle"
                  mr={2}
                  value={role}
                  onChange={(valor) => setRole(valor.target.value)}
                />
                <Input
                  placeholder="Digite o username do Usuário!"
                  variant="subtle"
                  mr={2}
                  value={username}
                  onChange={(valor) => setUsername(valor.target.value)}
                />
                <Input
                  placeholder="Digite o Telefone de um Usuário!"
                  ref={withMask("99999-9999")}
                  variant="subtle"
                  mr={2}
                  value={phone}
                  onChange={(valor) => setPhone(valor.target.value)}
                />
              </VStack>
              <Flex mb={4}>
                <Button 
                  onClick={() => {
                    submit();
                    onClose();
                  }}
                  background="green"
                  color="white"
                  loading={loadingSave}
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
  )
}