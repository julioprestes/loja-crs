'use client';

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Box, Heading, HStack, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import api from "@/utils/axios";
import { useEffect, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster"
import ProdutoCard from "@/components/ProdutoCard";
import { useRouter } from "next/navigation";



export default function PizzasTradicionais() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

     useEffect(() => {
        async function fetchPizzas() {
            try {
                const categoriasRes = await api.get("/categories");
                const categoria = categoriasRes.data.data.find(cat =>
                     cat.name.trim().toLowerCase() === "pizzas especiais"
                );
                if (!categoria) {
                    setProdutos([]);
                    setLoading(false);
                    return;
                }
                const produtosRes = await api.get("/products", {
                    params: { idCategory: categoria.id }
                });
                const produtosFiltrados = produtosRes.data.data.filter(
                    prod => prod.idCategory === categoria.id
                );
                setProdutos(produtosFiltrados);
            } catch (err) {
                setProdutos([]);
            }
            setLoading(false);
        }
        fetchPizzas();
    }, []);
    
    
    return (
        <>
           <Navbar />
           <Box 
                bg="white" 
                minH="100vh" 
                p={4}
                border="2px solid black"
            >
            <Heading mb={10} ml={5} color="black" size="4xl" mt={10}>
                Pizzas Especiais
            </Heading>
            <HStack align="start">
                <Box minW="250px" maxH="fit-content" bg="orange" boxShadow={'md'} p={4} mr={4}>
                    <Text fontWeight="bold" color="black" textStyle="xl" mb={4}>Menu</Text>
                    <Text cursor="pointer" color="black" _hover={{ textDecoration: "underline" }} mb={1}
                        onClick={() => {
                            router.push("/menu/pizzas-tradicionais");
                        }}
                    >
                    Pizzas Tradicionais
                    </Text>
                    <Text cursor="pointer" color="black" _hover={{ textDecoration: "underline" }} mb={1}
                        onClick={() => {
                            router.push("/menu/pizzas-especiais");
                        }}
                    >
                    Pizzas Especiais
                    </Text>
                    <Text cursor="pointer" color="black" _hover={{ textDecoration: "underline" }} mb={1}
                        onClick={() => {
                            router.push("/menu/pizzas-doces");
                        }}
                    >
                    Pizzas Doces
                    </Text>
                    <Text cursor="pointer" color="black" _hover={{ textDecoration: "underline" }} mb={1}
                        onClick={() => {
                            router.push("/menu/bebidas");
                        }}
                    >
                    Bebidas
                    </Text>
                </Box>
                <Box>
                    {loading ? (
                        <Spinner size="xl" color="orange" />
                    ) : (
                        
                        <SimpleGrid columns={[1, 2, 3]} columnGap="6" rowGap="6">
                            {produtos.length === 0 ? (
                                <Text color="black">Nenhuma pizza encontrada.</Text>
                            ) : (
                                produtos.map(produto => (
                                    <ProdutoCard key={produto.id} produto={produto} />
                                ))
                            )}
                        </SimpleGrid>
                    )}
                </Box>
                <Toaster />
            </HStack>
        </Box>
        <Footer /> 
        </>
        
    );
}