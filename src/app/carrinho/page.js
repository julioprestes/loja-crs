'use client';
import { useState, useEffect } from "react";
import {
  Box, Heading, Text, Button, IconButton, Image, Input, NumberInput, VStack, HStack, Flex, SimpleGrid, Portal, Select, createListCollection
} from "@chakra-ui/react";
import api from "@/utils/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MdOutlineCheck, MdOutlineAdd   } from "react-icons/md";
import DialogEnderecos from "@/components/DialogEnderecos.jsx";
import { useRouter } from "next/navigation";
import { LuMinus, LuPlus } from "react-icons/lu"
import { Tooltip } from "@/components/ui/tooltip"
import { Toaster, toaster } from "@/components/ui/toaster"

async function saveCartToBackend(userId, cartItemsArray) {
  if (!userId) return;
  try {
    await api.patch(`/users/${userId}`, {
      cart: { items: cartItemsArray }
    });
  } catch (error) {
    console.error("Erro ao salvar carrinho:", error);
  }
}

export default function CarrinhoPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [pedidoCupom, setPedidoCupom] = useState("");
  const [pedidoCupomData, setPedidoCupomData] = useState(null);
  const [pedidoCupomError, setPedidoCupomError] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [selectedEndereco, setSelectedEndereco] = useState(null);
  const [dialogEnderecoOpen, setDialogEnderecoOpen] = useState(false);

  const enderecoCollection = createListCollection({
    items: enderecos.map(e => ({
      label: `${e.street}, ${e.numberForget} - ${e.city}`,
      value: String(e.id),
    })),
  });

useEffect(() => {
  async function loadCart() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const localCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    try {
      const res = await api.get(`/users/${userId}`);
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
      setCart(localCart);
    }
  }
  loadCart();
}, []);

  // Carregar endereços do usuário
  useEffect(() => {
    async function loadEnderecos() {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const res = await api.get(`/addresses`);
        const userEnderecos = res.data.data.filter(e => String(e.idUser) === String(userId));
        setEnderecos(userEnderecos);
        if (userEnderecos.length > 0) setSelectedEndereco(userEnderecos[0].id);
      } catch (err) {
        setEnderecos([]);
      }
    }
    loadEnderecos();
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

  const handleQuantityChange = async (index, value) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, Number(value));
    setCart(newCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    await saveCartToBackend(userId, newCart);
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

  // Função para adicionar novo endereço e atualizar lista
  const handleEnderecoAdded = async () => {
    setDialogEnderecoOpen(false);
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await api.get(`/addresses`);
      const userEnderecos = res.data.data.filter(e => String(e.idUser) === String(userId));
      setEnderecos(userEnderecos);
      if (userEnderecos.length > 0) setSelectedEndereco(userEnderecos[userEnderecos.length - 1].id);
    } catch (err) {}
  };

  const finalizarPedido = async () => {
    if (cart.length === 0) {
      toaster.create({
        description: "Seu carrinho está vazio!",
        type: "error",
      });
      return;
    }
    if (!selectedEndereco) {
      toaster.create({
        description: "Selecione um endereço para entrega!",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const idUserCustomer = userId;
      const idUserDeliver = null;
      const idAddress = selectedEndereco;
      const idPayment = 1;
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
        await api.post("/orders-products", {
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
      toaster.create({
        description: "Seu pedido será preparado!",
        type: "success",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toaster.create({
        description: "Erro ao finalizar pedido: " + (error.response?.data?.message || error.message),
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Box bg="white">
      <Navbar />
      <Box 
        bg="white" 
        minH="100vh" 
        p={8}
      >
        <Heading mb={10} color="black" size="4xl">Itens no Carrinho</Heading>
        <HStack align="start" spacing={10} ml={3}>
          <SimpleGrid columns={1} columnGap="2" rowGap="4">
            {cart.map((item, index) => (
            <Box key={index} maxW="1000px" maxH="170px" w="900px" bg="orange.300" boxShadow={'md'}  p={4}>
              <Flex>
                <Image src={item.image} w="180px" h="140px" objectFit="cover" borderRadius="md" mr={4} />
                <HStack align="center" spacing={16}>
                  <VStack align="start">
                    <Text fontWeight="bold" color="black" mr={5} fontSize="2xl">{item.name}</Text>
                    <Text
                      cursor="pointer"
                      color="black"
                      onClick={() => deleteItem(item.id)}
                      _hover={{ textDecoration: "underline", color: "red" }}
                    >
                      Remover
                    </Text>
                  </VStack>
                  <NumberInput.Root
                      value={item.quantity}
                      min={1}
                      ml={4}
                      mr={8}
                      width="100px"
                      unstyled
                      spinOnPress={false}
                      onValueChange={e => handleQuantityChange(index, e.value)}
                  >
                      <HStack gap="2">
                    <NumberInput.DecrementTrigger asChild>
                      <IconButton variant="ghost" size="sm" color="black" _hover={{ bg: "orange.200" }}>
                        <LuMinus />
                      </IconButton>
                    </NumberInput.DecrementTrigger>
                    <NumberInput.ValueText textAlign="center" color="black" fontSize="lg" minW="3ch" />
                    <NumberInput.IncrementTrigger asChild>
                      <IconButton variant="ghost" size="sm" color="black" _hover={{ bg: "orange.200" }}>
                        <LuPlus />
                      </IconButton>
                    </NumberInput.IncrementTrigger>
                  </HStack>
                </NumberInput.Root>
                  <Text color="black">
                    <Text as="span" fontWeight="bold" color="black">Total:</Text> R$ {calculateItemTotal(item).toFixed(2)}
                  </Text>
                </HStack>
              </Flex>
            </Box>
          ))}
          </SimpleGrid>
          {/* box Total da Compra */}
          <VStack ml="auto" spacing={6}>
            <Box
              minW="600px"
              maxH="fit-content"
              bg="white" 
              boxShadow="md"
              p={4}
              border="5px solid"
              borderColor="orange.300" 
            >
              <VStack spacing={6}>
                <Text fontWeight="bold" color="black" fontSize="2xl" mb={2}>
                  Pedido
                </Text>
                <HStack>
                  <Input
                  value={pedidoCupom}
                  onChange={e => setPedidoCupom(e.target.value)}
                  placeholder="Cupom do pedido"
                  variant="flushed"
                  color="black"
                />
                <Tooltip content="Aplicar Cupom">
                  <Button size="sm" color="white" bg="green" onClick={verificarCupomPedido}>
                    <MdOutlineCheck />
                  </Button>
                </Tooltip>
                </HStack>
                {pedidoCupomError && <Text color="red">{pedidoCupomError}</Text>}
                {pedidoCupomData && (
                  <Text color="green">
                    Cupom aplicado: {pedidoCupomData.code} ({pedidoCupomData.type === "porcentagem" ? `${pedidoCupomData.discount}%` : `R$${pedidoCupomData.discount}`})
                  </Text>
                )}
                <Text color="black">Desconto: R${descontoPedido.toFixed(2)}</Text>
                <HStack>
                  <Text color="black">Itens: {cart.length} /</Text>
                    <Text color="black">
                  <Text as="strong" color="black">Total: </Text>R${precoTotal}
                </Text>
                </HStack>
                <HStack>
                  <Select.Root
                    collection={enderecoCollection}
                    width="100%"
                    value={selectedEndereco ? [String(selectedEndereco)] : []}
                    onValueChange={e => setSelectedEndereco(e.value)}
                    color="black"
                  >
                    <Select.HiddenSelect />
                    <Select.Label>Selecione um endereço:</Select.Label>
                    <Select.Control>
                      <Select.Trigger bg="white">
                        <Select.ValueText placeholder="Selecione um endereço" bg="white"/>
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator color="black"/>
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {enderecoCollection.items.map((endereco) => (
                            <Select.Item item={endereco} key={endereco.value}>
                              {endereco.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                  <Tooltip content="Novo Endereço">
                    <Button
                      mt={6}
                      size="sm"
                      color="white"
                      bg="green"
                      onClick={() => setDialogEnderecoOpen(true)}
                    >
                      <MdOutlineAdd />
                    </Button>
                  </Tooltip>
                  
                </HStack>
                <Flex align="center" width="100%">
                  <Box flex="1" />
                  <Button
                    bg="black"
                    mt={6}
                    h="50px"
                    minW="200px"
                    onClick={finalizarPedido}
                    isLoading={loading}
                    loadingText="Finalizando..."
                    _hover={{ bg: "orange", color: "black" }}
                    color="white"
                  >
                    Finalizar Pedido
                  </Button>
                  <Box flex="1" display="flex" justifyContent="flex-end">
                    <Image
                      src="/Pizza_Steve.png"
                      alt="Logo Steve"
                      objectFit="contain"
                      boxSize="100px"
                      ml={4}
                    />
                  </Box>
                </Flex>
              </VStack>
            </Box>
          </VStack>
        </HStack>
        <DialogEnderecos
          open={dialogEnderecoOpen}
          onClose={() => setDialogEnderecoOpen(false)}
          onEnderecoAdded={handleEnderecoAdded}
        />
      </Box>
      <Footer />
      <Toaster />
    </Box>
  );
}