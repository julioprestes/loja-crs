"use client";

import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Flex,
  Link as ChakraLink,
  Spacer,
  HStack,
  Box,
  Image
} from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";
import { MdMenu } from "react-icons/md"; 


export default function TrocaCrud({ currentPage }) {
  const [open, setOpen] = useState(false);

  const pages = [
    { href: "/admin/categories", label: "Crud Categorias" },
    { href: "/admin/payments", label: "Crud Pagamentos" },
    { href: "/admin/cupons", label: "Crud Cupons" },
    { href: "/admin/products", label: "Crud Produtos" },
    { href: "/admin/orders", label: "Crud Pedidos" },
    { href: "/admin/users", label: "Crud Usuários" }
  ];

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <MdMenu/>
      </Button>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement={"start"}>
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
                    <Drawer.Title>Menu Admin</Drawer.Title> 
                  </HStack>
                   
                </Box>
              </Drawer.Header>
              <Drawer.Body>
                <Flex direction="column" gap={2} height="100%">
                  {pages
                    .filter((page) => page.href !== currentPage)
                    .map((page) => (
                      <ChakraLink
                        key={page.href}
                        as={NextLink}
                        href={page.href}
                        borderRadius="md"
                        p={2}
                        _hover={{ bg: "orange.500" }}
                      >
                        {page.label}
                      </ChakraLink>
                    ))}
                  <Spacer />
                  <Button as={NextLink} href="/" colorScheme="teal" variant="solid" mr={2} _hover={{ bg: "orange.500" }}>
                    Home
                  </Button>
                </Flex>
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
    </>
  );
}