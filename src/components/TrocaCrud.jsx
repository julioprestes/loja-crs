"use client";

import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";

export default function TrocaCrud({ currentPage }) {
  const [open, setOpen] = useState(false);

  const pages = [
    { href: "/admin/categories", label: "Crud Categorias" },
    { href: "/admin/payments", label: "Crud Pagamentos" },
    { href: "/admin/cupons", label: "Crud Cupons" },
    { href: "/admin/products", label: "Crud Produtos" },
  ];

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Abrir Menu
      </Button>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement={"start"}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Menu Admin</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Flex direction="column" gap={2}>
                  {pages
                    .filter((page) => page.href !== currentPage)
                    .map((page) => (
                      <ChakraLink
                        key={page.href}
                        as={NextLink}
                        href={page.href}
                        borderRadius="md"
                        p={2}
                        _hover={{ bg: "gray.100" }}
                      >
                        {page.label}
                      </ChakraLink>
                    ))}
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