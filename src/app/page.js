'use client';
import { Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import styles from "./page.module.css";
import React from 'react';
import { Toaster, toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar"
import Carrossel from "@/components/Carrossel";
import api from "@/utils/axios";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import PesquisaProduto from "@/components/PesquisaProduto";


export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const buscarProduto = async () => {
      try {
        const response = await api.get('/products')
        setProdutos(response.data.data)
      } catch (error) {
        console.log("Erro ao buscar produto:", error);
      }
  }

  const buscarCategorias = async () => {
    try {
      const response = await api.get('/categories');
      setCategorias(response.data.data);
      console.log("Categorias carregadas:", response.data.data); 
    } catch (error) {
      console.log("Erro ao buscar categorias:", error);
    }
  };

  const produtosFiltrados = produtos.filter(produto =>
  produto.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  useEffect(() => {
    buscarProduto();
    buscarCategorias();

  }, []);

  return (
      <Box
        backgroundColor="whiteAlpha.950"
        minHeight="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        backgroundImage="url('/fundopizza.png')"
        bgSize="cover" 
        bgPosition="center"
        bgRepeat="no-repeat"
        bgAttachment="fixed"
      >
      <Navbar />
      <Box
        flex="1"
        w="100%"
        display="flex"
        justifyContent="center"
        filter="contrast(95%)"
        bgRepeat="no-repeat"
      >
        <VStack spacing={5}>
          <Image
            mt={8}
            src="/logo.png"
            alt="Logo Mercado"
            boxSize="200px"
            objectFit="contain"
            mb={5}
          />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={5}
            mb={8} 
          >
              <Heading color="black" textAlign="center" as="h1" fontSize={40} fontWeight={600} >
                Bem-Vindo!
              </Heading>
          </Box>
          <Box display="flex" justifyContent="center" w="100%" mb={2}>
            <PesquisaProduto searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Box>
          <Carrossel produtos={produtosFiltrados} categorias={categorias} />
          <Toaster />
        </VStack>
      </Box>
      <Footer />
    </Box>
     
  );
} 