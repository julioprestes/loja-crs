import { Button, CloseButton, Dialog, Portal, Input, Flex, VStack} from "@chakra-ui/react"
import { MdCheck, MdAdd } from 'react-icons/md'

export default function DialogCupom ({
  buttonName,
  headers,
  input,
  setInput,
  type,
  setType,
  value,
  setValue,
  uses,
  setUses,
  submit,
  editingIndex,
  isOpen,
  onClose,
  loadingSave
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
                        placeholder="Digite o codigo do cupom!"
                        variant="subtle"
                        mr={2}
                        value={input}
                        onChange={(valor) => setInput(valor.target.value)}
                    />
                    <Input
                        placeholder="Digite o tipo de cupom!"
                        variant="subtle"
                        mr={2}
                        value={type}
                        onChange={(valor) => setType(valor.target.value)}
                    />
                    <Input
                        placeholder="Digite o valor do Cupom!"
                        variant="subtle"
                        mr={2}
                        value={value}
                        onChange={(valor) => setValue(valor.target.value)}
                    />
                    <Input
                        placeholder="Digite a quantidade de usos do Cupom!"
                        variant="subtle"
                        mr={2}
                        value={uses}
                        onChange={(valor) => setUses(valor.target.value)}
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
                        loading ={loadingSave}
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

