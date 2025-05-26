import {
  Dialog, Portal, Input, Button, CloseButton
} from "@chakra-ui/react";

export default function DialogCarrinho({
  open,
  onClose,
  editQuantity,
  setEditQuantity,
  saveEdit
}) {
  return (
    <Dialog.Root open={open} onClose={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edição de Quantidade</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input
                type="number"
                min={1}
                value={editQuantity}
                onChange={e => setEditQuantity(Number(e.target.value))}
                mb={2}
                placeholder="Quantidade"
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
              </Dialog.ActionTrigger>
              <Button colorScheme="green" onClick={saveEdit}>Salvar</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
