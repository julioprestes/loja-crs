'use client';
import { useState, useEffect } from "react";
import {
  Box, Heading, Text, Button, Image, Input, VStack, HStack, Flex, CloseButton, Dialog, Portal
} from "@chakra-ui/react";
import api from "@/utils/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CarrinhoPage() {
  const [cart, setCart] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [selectedCupom, setSelectedCupom] = useState("");
  const [cupomError, setCupomError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartLS);
  }, []);

  const calculateItemTotal = (item) => {
    let total = (item.price || 0) * (item.quantity || 0);
    if (item.cupom) {
      if (item.cupom.type === "percent") {
        total -= total * (parseFloat(item.cupom.discount) / 100);
      } else if (item.cupom.type === "fixed") {
        total -= parseFloat(item.cupom.discount);
      }
    }
    return Math.max(total, 0);
  };

  const precoTotal = cart.reduce((total, item) => total + calculateItemTotal(item), 0).toFixed(2);

  const totalDiscount = cart.reduce((sum, item) => {
    if (item.cupom) {
      if (item.cupom.type === "percent") {
        return sum + ((item.price * item.quantity) * (parseFloat(item.cupom.discount) / 100));
      } else if (item.cupom.type === "fixed") {
        return sum + parseFloat(item.cupom.discount);
      }
    }
    return sum;
  }, 0);

  const deleteItem = (index) => {
    if (window.confirm("Deseja realmente remover este item do carrinho?")) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const editItem = (index) => {
    setEditIndex(index);
    setEditQuantity(cart[index].quantity);
    setSelectedCupom(cart[index].cupom ? cart[index].cupom.code : "");
    setCupomError(null);
    setDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      let newCart = [...cart];
      if (selectedCupom) {
        const response = await api.post("/cupoms/verify", { code: selectedCupom });
        if (response.data.message === "Cupom válido") {
          newCart[editIndex].quantity = editQuantity;
          newCart[editIndex].cupom = { ...response.data, discount: parseFloat(response.data.discount) };
          setCupomError(null);
        } else {
          setCupomError(response.data.message);
          return;
        }
      } else {
        newCart[editIndex].quantity = editQuantity;
        newCart[editIndex].cupom = null;
        setCupomError(null);
      }
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      setDialogOpen(false);
    } catch (error) {
      setCupomError("Erro ao verificar o cupom. Tente novamente.");
    }
  };

  const finalizarPedido = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    setLoading(true);
    try {
      const idUserCustomer = 1; // Exemplo: ID do usuário logado
      const idUserDeliver = null;
      const idAddress = 1;
      const idPayment = 1;
      const idCupom = null; // Se quiser usar cupom global, ajuste aqui

      // Cria o pedido
      const orderRes = await api.post("/orders", {
        status: "pendente",
        total: parseFloat(precoTotal),
        totalDiscount: parseFloat(totalDiscount),
        idUserCustomer,
        idUserDeliver,
        idAddress,
        idPayment,
        idCupom,
      });

      const idOrder = orderRes.data.data.id;

      // Cria os produtos do pedido
      for (const item of cart) {
        await api.post("/ordersproducts", {
          priceProducts: item.price,
          quantity: item.quantity,
          idOrder,
          idProduct: item.id,
        });
      }

      setCart([]);
      localStorage.removeItem("cart");
      alert("Pedido realizado com sucesso!");
    } catch (error) {
      alert("Erro ao finalizar pedido: " + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  return (
    <>
    <Navbar />
      <Box bg="white" minH="100vh" p={8}>
            <Heading mb={6} color="black">Itens no Carrinho</Heading>
      <Flex wrap="wrap" gap={6}>
        {cart.map((item, index) => (
          <Box key={index} maxW="490px" maxH="170px" bg="orange" borderRadius="md" p={4}>
            <Flex>
              <Image src={item.image} boxSize="120px" objectFit="cover" borderRadius="md" mr={4} />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color="black">{item.name}</Text>
                <Text color="black">Quantidade: {item.quantity}</Text>
                <Text color="black">Preço: R${item.price}</Text>
                <Text color="black">Total: R${calculateItemTotal(item).toFixed(2)}</Text>
                <HStack>
                  <Button size="sm" color="white" bg="black" onClick={() => editItem(index)}>Editar</Button>
                  <Button size="sm" color="white" bg="black" onClick={() => deleteItem(index)}>Excluir</Button>
                </HStack>
              </VStack>
            </Flex>
          </Box>
        ))}
        {/* Card com o Total da Compra */}
        <Box minW="250px" maxH="170px" bg="orange" borderRadius="md" p={4} ml="auto">
          <Text fontWeight="bold" color="black">Total da Compra</Text>
          <Text color="black">Itens: {cart.length}</Text>
          <Text>
            <Text as="strong" color="black">Total: R${precoTotal}</Text>
          </Text>
          <Button
            bg="black"
            mt={4}
            w="100%"
            onClick={finalizarPedido}
            isLoading={loading}
            loadingText="Finalizando..."
          >
            <Text color="white">Finalizar Pedido</Text>
          </Button>
        </Box>
      </Flex>

      {/* Dialog de edição */}
      <Dialog.Root open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
                <Input
                  value={selectedCupom}
                  onChange={e => setSelectedCupom(e.target.value)}
                  mb={2}
                  placeholder="Cupom"
                />
                {cupomError && <Text color="red">{cupomError}</Text>}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                </Dialog.ActionTrigger>
                <Button colorScheme="green" onClick={saveEdit}>Salvar</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={() => setDialogOpen(false)} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
    <Footer />
    </>
  );
}