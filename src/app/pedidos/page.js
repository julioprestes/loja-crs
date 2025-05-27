'use client';
import { Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import React from 'react';
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import TabelaEntrega from "@/components/TabelaEntrega";
import { useState, useEffect } from "react";
import api from "@/utils/axios";
import { verificarToken } from "@/middleware/verificarToken";
import { useRouter } from 'next/navigation';

export default function Pedidos() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);

  
  
  const buscarPedido = async () => {
    try {
      const response = await api.get('/orders');
      let pedidos = Array.isArray(response.data.data) ? response.data.data : [];

      // Busca os detalhes de endereço e pagamento para cada pedido, se necessário
      const pedidosCompletos = await Promise.all(pedidos.map(async (pedido) => {
        let address = pedido.address;
        if (!address && pedido.idAddress) {
          try {
            const res = await api.get(`/addresses/${pedido.idAddress}`);
            address = res.data.data;
          } catch {}
        }
        let payment = pedido.payment;
        if (!payment && pedido.idPayment) {
          try {
            const res = await api.get(`/payments/${pedido.idPayment}`);
            payment = res.data.data;
          } catch {}
        }
        return {
          ...pedido,
          address: address || pedido.idAddress,
          payment: payment || pedido.idPayment,
        };
      }));

      setTasks(pedidosCompletos);
    } catch (error) {
      setTasks([]);
    }
  };

    const buscarUsuarioAutenticado = async () => {
    try {
        const response = await api.get('/users/info-by-token');
        setUserId(response.data.data.id); 
        return response.data.data;
    } catch (error) {
        return null;
    }
  };

  const router = useRouter();

  useEffect(() => {
    const validarToken = async () => {
      const valido = await verificarToken();
      if (!valido) {
        router.push('/login');
        return;
      }
      try {
        const usuario = await buscarUsuarioAutenticado();
        if (!usuario || (usuario.role || '').trim().toLowerCase() !== ('admin' && 'deliver')){
          router.push('/login');
          return;
        }
        await buscarPedido();
      } catch (error) {
        router.push('/login');
      }
    };

    validarToken();
  }, []);
  
  const filteredTasks = (tasks || []).filter(task =>
  task.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem)

  // Função para atribuir o entregador ao pedido
  const atribuirEntrega = async (pedido) => {
    if (!userId) return;
    try {
      await api.patch(`/orders/${pedido.id}`, {
        idUserDeliver: userId,
        status: "em entrega"
      });
      await buscarPedido();
      alert("Entrega atribuída com sucesso!");
    } catch (error) {
      alert("Erro ao atribuir entrega.");
    }
  };

    return (
        <Box bg="white">
            <Navbar />
            <Box bg="white">
               <Heading mt={5} color="black" textAlign="center" size="4xl" > Pedidos </Heading> 
               <TabelaEntrega
                    items={tasksAtuais}
                    acoes={true}
                    onAtribuir={atribuirEntrega}
                    headers={[
                        {name: 'ID do Pedido', value: 'id'},
                        {name: 'Status', value: 'status'},
                        {name: 'Total', value: 'total'},
                        {name: 'Endereço', value: 'idAddress'},
                        {name: 'Pagamento', value: 'idPayment'},
                    ]}
                    disableAtribuir={pedido => (pedido.status || '').toLowerCase() === 'em entrega'}
                />
            </Box>
            <Footer />
        </Box>
    );
}