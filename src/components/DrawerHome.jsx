import { Box, Button, Image, HStack, CloseButton, Drawer, Portal, NumberInput, Text, Spacer, Link as ChakraLink, } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import NextLink from "next/link";

export default function DrawerHome({ open, setOpen }) {
  const [cartDrawer, setCartDrawer] = useState([]);

  useEffect(() => {
    if (open) {
      const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
      setCartDrawer(cartLS);
    }
  }, [open]);

  const handleQuantityChange = (index, value) => {
    const newCart = [...cartDrawer];
    newCart[index].quantity = Math.max(1, Number(value));
    setCartDrawer(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleDelete = (index) => {
    const newCart = [...cartDrawer];
    newCart.splice(index, 1);
    setCartDrawer(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
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
                    cartDrawer.map((item, idx) => (
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
                            onValueChange={e => handleQuantityChange(idx, e.value)}
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                        <Button
                            color="white"
                            onClick={() => handleDelete(idx)}
                            bg="red"
                        >
                            <MdClose />
                        </Button>
                        </Box>
                    ))
                    )}
                    <Spacer />
                    <Button as={NextLink} href="/carrinho" colorScheme="teal" variant="solid" mr={2} _hover={{ bg: "orange" }}>
                    Finalizar compra.
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
    