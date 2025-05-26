'use client';
import { useState, useEffect } from "react";
import {
  Box, Heading, Text, Button, Image, Input, VStack, HStack, Flex, 
} from "@chakra-ui/react";
import api from "@/utils/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DialogCarrinho from "@/components/DialogCarrinho.jsx";

// Função  para salvar o carrinho no backend
async function saveCartToBackend(userId, cartItemsArray) {
  if (!userId) return;
  try {
    await api.patch(`/users/${userId}`, {
      cart: { items: cartItemsArray }
    });
  } catch (error) {
    console.error("Erro ao salvar carrinho no backend:", error);
  }
}

export default function CarrinhoPage() {
  const [cart, setCart] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Novo estado para cupom do pedido
  const [pedidoCupom, setPedidoCupom] = useState("");
  const [pedidoCupomData, setPedidoCupomData] = useState(null);
  const [pedidoCupomError, setPedidoCupomError] = useState(null);

  useEffect(() => {
  async function loadCart() {
    const userId = localStorage.getItem("userId");
    console.log("userId:", userId);
    if (!userId) return;

    const localCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    console.log("localCart:", localCart);
    try {
      const res = await api.get(`/users/${userId}`);
      console.log("API response:", res.data);
      const backendCart = res.data.data.cart?.items || [];
      let finalCart = [];
      if (backendCart && backendCart.length > 0) {
        finalCart = backendCart;
        localStorage.setItem(`cart_${userId}`, JSON.stringify(backendCart));
      } else if (localCart.length > 0) {
        finalCart = localCart;
        await saveCartToBackend(userId, localCart);
      }
      setCart(finalCart);
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
      setCart(localCart);
    }
  }
  loadCart();
}, []);

  // Remova lógica de cupom individual do produto do cálculo
  const calculateItemTotal = (item) => {
    return (item.price || 0) * (item.quantity || 0);
  };

  // Calcule o desconto do cupom do pedido
  let totalBruto = cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  let descontoPedido = 0;
  if (pedidoCupomData) {
    if (pedidoCupomData.type === "porcentagem") {
      descontoPedido = totalBruto * (parseFloat(pedidoCupomData.discount) / 100);
    } else if (pedidoCupomData.type === "fixo") {
      descontoPedido = parseFloat(pedidoCupomData.discount);
    }
  }
  let precoTotal = Math.max(totalBruto - descontoPedido, 0).toFixed(2);

  const deleteItem = async (itemId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    await saveCartToBackend(userId, newCart);
  };

  const editItem = (index) => {
    setEditIndex(index);
    setEditQuantity(cart[index].quantity);
    setDialogOpen(true);
  };

  const saveEdit = async () => {
    let newCart = [...cart];
    newCart[editIndex].quantity = editQuantity;
    setCart(newCart);
    const userId = localStorage.getItem("userId");
    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    await saveCartToBackend(userId, newCart);
    setDialogOpen(false);
  };

  // Função para verificar cupom do pedido
  const verificarCupomPedido = async () => {
    setPedidoCupomError(null);
    setPedidoCupomData(null);
    if (!pedidoCupom) return;
    try {
      const response = await api.post("/cupons/verify", { code: pedidoCupom });
      if (response.data.message === "Cupom válido") {
        setPedidoCupomData({ ...response.data, discount: parseFloat(response.data.value) });
        setPedidoCupomError(null);
      } else {
        setPedidoCupomError(response.data.message);
      }
    } catch (error) {
      setPedidoCupomError("Erro ao verificar o cupom. Tente novamente.");
    }
  };

  const finalizarPedido = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const idUserCustomer = userId;
      const idUserDeliver = null;
      const idAddress = 1;
      const idPayment = 1;
      // Passe o id do cupom se houver
      const idCupom = pedidoCupomData?.id || null;

      const orderRes = await api.post("/orders", {
        status: "pendente",
        total: parseFloat(precoTotal),
        totalDiscount: descontoPedido,
        idUserCustomer,
        idUserDeliver,
        idAddress,
        idPayment,
        idCupom,
      });

      const idOrder = orderRes.data.data.id;

      for (const item of cart) {
        await api.post("/ordersproducts", {
          priceProducts: item.price,
          quantity: item.quantity,
          idOrder,
          idProduct: item.id,
        });
      }

      setCart([]);
      localStorage.setItem(`cart_${userId}`, JSON.stringify([]));
      await saveCartToBackend(userId, []);
      setPedidoCupom("");
      setPedidoCupomData(null);
      setPedidoCupomError(null);
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
        <Heading mb={10} color="black" size="4xl">Itens no Carrinho</Heading>
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
                    <Button size="sm" color="white" bg="black" onClick={() => deleteItem(item.id)}>Excluir</Button>
                  </HStack>
                </VStack>
              </Flex>
            </Box>
          ))}
          {/* Card com o Total da Compra */}
          <Box minW="250px" maxH="fit-content" bg="orange" borderRadius="md" p={4} ml="auto">
            <Text fontWeight="bold" color="black">Total da Compra</Text>
            <Text color="black">Itens: {cart.length}</Text>
            <Input
              value={pedidoCupom}
              onChange={e => setPedidoCupom(e.target.value)}
              mb={2}
              placeholder="Cupom do pedido"
              bg="white"
              color="black"
              mt={4}
            />
            <Button size="sm" color="white" bg="black" mb={2} onClick={verificarCupomPedido}>
              Aplicar Cupom
            </Button>
            {pedidoCupomError && <Text color="red">{pedidoCupomError}</Text>}
            {pedidoCupomData && (
              <Text color="green">
                Cupom aplicado: {pedidoCupomData.code} ({pedidoCupomData.type === "porcentagem" ? `${pedidoCupomData.discount}%` : `R$${pedidoCupomData.discount}`})
              </Text>
            )}
            <Text color="black">Desconto: R${descontoPedido.toFixed(2)}</Text>
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

        <DialogCarrinho
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          editQuantity={editQuantity}
          setEditQuantity={setEditQuantity}
          saveEdit={saveEdit}
        />

      </Box>
      <Footer />
    </>
  );
}