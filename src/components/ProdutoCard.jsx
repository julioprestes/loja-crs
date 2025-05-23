import { Card, Image, Text, Button, HStack, VStack } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import { MdShoppingCart } from "react-icons/md";

export default function ProdutoCard({ produto }) {
  return (
    <Card.Root maxW="400px" w="380px" minW="300px" overflow="hidden" bg="#eb8f34"> 
      <HStack align="start" spacing={4} p={4}>
        <Image
          src={`http://localhost:3333${produto.image?.replace(/^.*\/public/, '')}`}
          alt={produto.name}
          boxSize="150px"
          objectFit="contain"
        />
        <VStack align="start" spacing={2} flex="1">
          <Card.Title color="black">{produto.name}</Card.Title>
          <Card.Description color="black">
            {produto.description}
          </Card.Description>
          <Text textStyle="md" fontWeight="medium" letterSpacing="tight" color="black">
            R$ {produto.price}
          </Text>
          <Button 
            variant="solid"
            onClick={() => 
              toaster.create({
                title: 'Produto adicionado ao carrinho.',
                type: 'success'
              })
            }
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            mt={2}
          >
            Adicionar ao carrinho
            <MdShoppingCart />
          </Button>
        </VStack>
      </HStack>
    </Card.Root>
  );
}