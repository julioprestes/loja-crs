import { Box, Button, Image, HStack, CloseButton, Drawer, Portal, NumberInput, Text, Spacer, Link as ChakraLink } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import NextLink from "next/link";
import api from "@/utils/axios";


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

export default function DrawerHome({ open, setOpen }) {
  const [cartDrawer, setCartDrawer] = useState([]);

  useEffect(() => {
    if (open) {
      const userId = localStorage.getItem("userId");
      const cartLS = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      setCartDrawer(cartLS);
    }
  }, [open]);

  const handleQuantityChange = async (index, value) => {
    const userId = localStorage.getItem("userId");
    const newCart = [...cartDrawer];
    newCart[index].quantity = Math.max(1, Number(value));
    setCartDrawer(newCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    await saveCartToBackend(userId, newCart);
  };

  const handleDelete = async (index) => {
    const userId = localStorage.getItem("userId");
    const newCart = [...cartDrawer];
    newCart.splice(index, 1);
    setCartDrawer(newCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    await saveCartToBackend(userId, newCart); 
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} bg="blackAlpha.900">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Box>
                <HStack>
                  <Image
                    src="/Pizza_Steve.png"
                    alt="Logo Mercado"
                    boxSize="40px"
                    objectFit="contain"
                  />
                  <Drawer.Title>Itens do seu Carrinho</Drawer.Title> 
                </HStack>
              </Box>
            </Drawer.Header>
            <Drawer.Body>
                <Box display="flex" flexDirection="column" height="100%">
                    {cartDrawer.length === 0 ? (
                    <Box color="white">Seu carrinho está vazio.</Box>
                    ) : (
                    cartDrawer.map((item, index) => (
                        <Box
                        key={item.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        bg="orange"
                        borderRadius="md"
                        p={2}
                        mb={2}
                        >
                        <Image src={item.image} alt={item.name} boxSize="40px" borderRadius="md" mr={2} />
                        <Box flex="1" ml={2}>
                            <Text fontWeight="bold" fontSize="sm" color="black">{item.name}</Text>
                            <Text fontSize="xs" color="black">R$ {Number(item.price).toFixed(2)}</Text>
                        </Box>
                        <NumberInput.Root
                            value={item.quantity}
                            min={1}
                            width="60px"
                            size="sm"
                            mr={2}
                            bg="white"
                            color="black"
                            onValueChange={e => handleQuantityChange(index, e.value)}
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                        <Button
                            color="white"
                            onClick={() => handleDelete(index)}
                            bg="red"
                        >
                            <MdClose />
                        </Button>
                        </Box>
                    ))
                    )}
                    <Spacer />
                    <Button as={NextLink} href="/carrinho" colorScheme="teal" variant="solid" mr={2} _hover={{ bg: "orange" }}>
                    Finalizar compra
                    </Button>
                </Box>
                </Drawer.Body>
            <Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}