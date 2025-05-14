import { Link as ChakraLink, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

export default function TrocaCrud({ currentPage }) {
  const pages = [
    { href: "/admin/categories", label: "Crud Categorias" },
    { href: "/admin/payments", label: "Crud Pagamentos" },
    { href: "/admin/cupons", label: "Crud Cupons" },
  ];

  return (
    <Flex
      as="nav"
      bg="gray.800"a
      color="white"
      p={4}
      justify="space-around"    
      align="center"
      borderRadius="md"
      boxShadow="md"
      mb={4}
    >
      {pages
        .filter((page) => page.href !== currentPage)
        .map((page) => (
          <ChakraLink
            key={page.href}
            as={NextLink}
            href={page.href}
            borderRadius="md"
          >
            {page.label}
          </ChakraLink>
        ))}
    </Flex>
  );
}