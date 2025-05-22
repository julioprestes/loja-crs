import { Input } from "@chakra-ui/react";

export default function PesquisaProduto({ searchTerm, setSearchTerm }) {
  return (
    <Input
      placeholder="Busque por um produto..."
      value={searchTerm}
      variant="outline"
      onChange={(e) => setSearchTerm(e.target.value)}
      mb={4}
      w="400px"
      maxW="90vw"
      color="black"
    />
  );
}