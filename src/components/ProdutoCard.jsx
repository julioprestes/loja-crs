import { Card, Image, Text, Button, HStack, VStack, Tooltip } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import { MdShoppingCart } from "react-icons/md";

export default function ProdutoCard({ produto }) {
  return (
    <Card.Root
          maxW="400px"
          w="380px"
          minW="300px"
          h="250px"
          overflow="hidden"
          bg="#eb8f34"
          display="flex"
          flexDirection="column"
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
            <Card.Description color="black"  minH="40px">
              {produto.description && produto.description.length > 60
                ? produto.description.slice(0, 60) + '...'
                : produto.description}
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
              mt="auto"
            >
              Adicionar ao carrinho
              <MdShoppingCart />
            </Button>
          </VStack>
        </HStack>
    </Card.Root>
  );
}