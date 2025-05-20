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
import { useEffect, useState, useRef } from "react";
import api from "@/utils/axios";



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
  produtos,
  setProdutos,
  produtoAtual,
  setProdutoAtual,
  adicionarProduto,
  submit,
  editingIndex,
  isOpen,
  onClose,
  loadingSave
}) {

  const [produtosApi, setProdutosApi] = useState([]);
  const contentRef = useRef(null);


  useEffect(() => {
  if (isOpen) {
    api.get('/products')
      .then(res => setProdutosApi(res.data.data || []))
      .catch(() => setProdutosApi([]));
  }
}, [isOpen]);

  const produtosCollection = createListCollection({
    items: produtosApi.map(prod => ({
      label: `${prod.name} (ID: ${prod.id})`,
      value: String(prod.id),
    })),
  });

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
                <HStack>
                  <Select.Root
                    collection={produtosCollection}
                    value={produtoAtual.idProduct || ''}
                    onValueChange={value =>
                      setProdutoAtual({ ...produtoAtual, idProduct: value })
                    }
                    size="sm"
                  >
                    <Select.HiddenSelect />
                    <Select.Label>Produto</Select.Label>
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Selecione o Produto" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal container={contentRef}>
                      <Select.Positioner>
                        <Select.Content>
                          {produtosCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                  <Input
                    placeholder="Qtd"
                    value={produtoAtual.quantity || ''}
                    onChange={e => setProdutoAtual({ ...produtoAtual, quantity: e.target.value })}
                  />
                  <Input
                    placeholder="Preço"
                    value={produtoAtual.priceProducts || ''}
                    onChange={e => setProdutoAtual({ ...produtoAtual, priceProducts: e.target.value })}
                  />
                  <Button onClick={adicionarProduto} leftIcon={<MdAdd />}>Add</Button>
                </HStack>
                <VStack align="start" w="100%">
                  {produtos.map((p, idx) => (
                    <Flex key={idx} justify="space-between" w="100%">
                      <span>Produto: {p.idProduct} | Qtd: {p.quantity} | Preço: {p.priceProducts}</span>
                    </Flex>
                  ))}
                </VStack>
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