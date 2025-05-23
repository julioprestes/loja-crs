import { Box, Button, Flex, Spacer, Link as ChakraLink, Image, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import { MdShoppingCart, MdLogout, MdAdminPanelSettings, MdDeliveryDining } from "react-icons/md";

export default function Navbar() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/info-by-token');
        setRole(res.data.data.role || '');
      } catch (err) {
        setRole('');
      }
    };
    fetchUser();
  }, []);

  return (
    <Flex as="nav" bg="blackAlpha.900" color="white" p={4} align="center">
      <Box fontWeight="bold" fontSize="xl">
        <HStack>
          <Image
            src="/Pizza_Steve.png"
            alt="Logo Mercado"
            boxSize="40px"
            objectFit="contain"
          />
          Steve Pizza
        </HStack>
        
      </Box>
      <Spacer />
      <>
        {role.trim().toLowerCase() === 'admin' && (
          <Button as={NextLink} href="/admin/categories" variant="outline" mr={2} ml={2} _hover={{ bg: "#eb8f34", color: "black" }} >
            Admin
            <MdAdminPanelSettings />
          </Button>

        )}
        {role.trim().toLowerCase() === 'deliver' && (
          <Button as={NextLink} href="/pedidos" variant="outline" mr={2} ml={2} _hover={{ bg: "#eb8f34", color: "black" }} >
            Entregas
            <MdDeliveryDining />
          </Button>

        )}
        {!role && (
          <>
            <Button as={NextLink} href="/login"  variant="solid" ml={2} mr={2} _hover={{ bg: "#eb8f34"}}>
              Login
            </Button>
            <Button as={NextLink} href="/cadastro" variant="solid" _hover={{ bg: "#eb8f34" }}>
              Cadastro
            </Button>
          </>
        )}
        {role && (
          <>
            <Button as={NextLink} href="/carrinho" ml={2} color="black" bg="white" _hover={{ bg: "#eb8f34" }}>
              Carrinho<MdShoppingCart />
            </Button>
            <Button
              ml={4}
              bg="red"
              color="white"
              onClick={() => {
                localStorage.removeItem('token');
                setRole('');
                window.location.reload();
              }}
            >
              <MdLogout />
            </Button>
          </>
        )}
      </>
    </Flex>
  );
}