import { Box, Button, Flex, Spacer, Link as ChakraLink, Image, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import { MdShoppingCart, MdLogout  } from "react-icons/md";

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
          <ChakraLink
            as={NextLink}
            borderRadius="md"
            p={2}
            _hover={{ bg: "black.100" }}
            href="/admin/categories"
          >
            Admin
          </ChakraLink>
        )}
        {!role && (
          <>
            <Button as={NextLink} href="/login" colorScheme="teal" variant="solid" mr={2} _hover={{ bg: "#eb8f34" }}>
              Login
            </Button>
            <Button as={NextLink} href="/cadastro" colorScheme="teal" variant="solid" _hover={{ bg: "#eb8f34" }}>
              Cadastro
            </Button>
          </>
        )}
        {role && (
          <>
            <ChakraLink
            as={NextLink}
            borderRadius="md"
            href="/carrinho"
            ml={5}
          >
            <MdShoppingCart />
          </ChakraLink>
          <Button
            ml={5}
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