import { Box, Button, Flex, Spacer, Link as ChakraLink, Image, HStack } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip"
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import { MdShoppingCart, MdLogout, MdAdminPanelSettings, MdDeliveryDining, MdHouse  } from "react-icons/md";
import DrawerHome from "@/components/DrawerHome";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function Navbar() {
  const [role, setRole] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter(); 
  const pathname = usePathname();




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
        {pathname === "/carrinho" && (
          <Button
            as={NextLink}
            href="/"
            variant="outline"
            mr={2}
            ml={2}
            _hover={{ bg: "orange", color: "black" }}
          >
            <MdHouse />
          </Button>
        )}
        {role.trim().toLowerCase() === 'admin' && (
          <Button as={NextLink} href="/admin/categories" variant="outline" mr={2} ml={2} _hover={{ bg: "orange", color: "black" }} >
            Admin
            <MdAdminPanelSettings />
          </Button>
        )}
        {role.trim().toLowerCase() === 'deliver' && (
          <Button as={NextLink} href="/pedidos" variant="outline" mr={2} ml={2} _hover={{ bg: "orange", color: "black" }} >
            Entregas
            <MdDeliveryDining />
          </Button>
        )}
        {!role && (
          <>
            <Button as={NextLink} href="/login"  variant="solid" ml={2} mr={2} _hover={{ bg: "orange"}}>
              Login
            </Button>
            <Button as={NextLink} href="/cadastro" variant="solid" _hover={{ bg: "orange" }}>
              Cadastro
            </Button>
          </>
        )}
        {role && (
          <>
            {pathname !== "/carrinho" && (
              <Tooltip content="Carrinho de Compras">
                <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                  <MdShoppingCart />
                </Button>
              </Tooltip>
            )}
            <DrawerHome open={open} setOpen={setOpen} />
            <Tooltip content="Fazer Logout">
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
            </Tooltip>
          </>
        )}
      </>
    </Flex>
  );
}