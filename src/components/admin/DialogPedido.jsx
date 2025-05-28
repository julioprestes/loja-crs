import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Input,
  Flex,
  VStack,
  HStack,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { MdCheck, MdAdd } from 'react-icons/md';




export default function DialogPedido({
  headers,
  status,
  setStatus,
  total,
  setTotal,
  idUserCustomer,
  setIdUserCustomer,
  idUserDeliver,
  setIdUserDeliver,
  idAddress,
  setIdAddress,
  idPayment,
  setIdPayment,
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
                  placeholder="Status"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                />
                <Input
                  placeholder="Total"
                  value={total}
                  onChange={e => setTotal(e.target.value)}
                />
                <Input
                  placeholder="ID Cliente"
                  value={idUserCustomer}
                  onChange={e => setIdUserCustomer(e.target.value)}
                />
                <Input
                  placeholder="ID Entregador"
                  value={idUserDeliver}
                  onChange={e => setIdUserDeliver(e.target.value)}
                />
                <Input
                  placeholder="ID Endereço"
                  value={idAddress}
                  onChange={e => setIdAddress(e.target.value)}
                />
                <Input
                  placeholder="ID Pagamento"
                  value={idPayment}
                  onChange={e => setIdPayment(e.target.value)}
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
                  loading={loadingSave ? 1 : 0}
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