import { Card, Image, Text, Button, HStack, VStack } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { MdShoppingCart } from "react-icons/md";
import { Tooltip } from "@/components/ui/tooltip";
import api from "@/utils/axios";

// Função utilitária para salvar o carrinho no backend
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

export default function ProdutoCard({ produto }) {
  return (
    <Card.Root
      maxW="400px"
      w="380px"
      minW="300px"
      h="250px"
      overflow="hidden"
      bg="orange"
      display="flex"
      flexDirection="column"
      boxShadow={'md'}
    >
      <HStack align="start" spacing={4} p={4} flex={1}>
        <Image
          src={`http://localhost:3333${produto.image?.replace(/^.*\/public/, '')}`}
          alt={produto.name}
          w="150px"
          h="200px"
          objectFit="fill"
          borderRadius="lg"
        />
        <VStack align="start" spacing={2} flex="1" h="100%">
          <Card.Title color="black" minH="40px">
            {produto.name}
          </Card.Title>
          <Tooltip content={produto.description}>
            <Card.Description color="black" minH="40px">
              {produto.description && produto.description.length > 60
                ? produto.description.slice(0, 60) + '...'
                : produto.description}
            </Card.Description>
          </Tooltip>
          <Text textStyle="md" fontWeight="medium" letterSpacing="tight" color="black">
            R$ {Number(produto.price).toFixed(2)}
          </Text>
          <Tooltip content="Adicionar ao Carrinho de Compras">
            <Button
              variant="solid"
              onClick={async () => {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                if (!token || !userId) {
                  toaster.create({
                    title: 'Para adicionar ao carrinho, faça login.',
                    type: 'error'
                  });
                  return;
                }
                const cartKey = `cart_${userId}`;
                const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
                const existingIndex = cart.findIndex(item => item.id === produto.id);
                if (existingIndex !== -1) {
                  cart[existingIndex].quantity += 1;
                } else {
                  cart.push({
                    id: produto.id,
                    name: produto.name,
                    price: produto.price,
                    image: `http://localhost:3333${produto.image?.replace(/^.*\/public/, '')}`,
                    quantity: 1,
                  });
                }
                localStorage.setItem(cartKey, JSON.stringify(cart));
                await saveCartToBackend(userId, cart); // <-- Sincroniza com o backend!
                toaster.create({
                  title: 'Produto adicionado ao carrinho.',
                  type: 'success'
                });
              }}
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              mt="auto"
            >
              Adicionar ao carrinho
              <MdShoppingCart />
            </Button>
          </Tooltip>
        </VStack>
      </HStack>
    </Card.Root>
  );
}