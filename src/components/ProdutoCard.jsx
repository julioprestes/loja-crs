import { Card, Image, Text, Button } from "@chakra-ui/react";

export default function ProdutoCard({ produto }) {
  return (
    <Card.Root maxW="350px" w="350px" minW="300px" overflow="hidden"bg="#323591">
      <Image
        src={`http://localhost:3333${produto.image?.replace(/^.*\/public/, '')}`}
        alt={produto.name}
        boxSize="200px"
        objectFit="cover"
        mx="auto"
        mt={2}
      />
      <Card.Body gap="2">
        <Card.Title>{produto.name}</Card.Title>
        <Card.Description>
          {produto.description}
        </Card.Description>
        <Text textStyle="md" fontWeight="medium" letterSpacing="tight" mt="2">
          R$ {produto.price}
        </Text>
      </Card.Body>
      <Card.Footer justifyContent="center" gap="2">
        <Button variant="solid">Adicionar ao carrinho</Button>
      </Card.Footer>
    </Card.Root>
  );
}