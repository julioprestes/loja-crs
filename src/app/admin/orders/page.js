'use client';
import InputPesquisa from "@/components/admin/InputPesquisa";
import TabelaCrud from "@/components/admin/TabelaCrud";
import PaginationTabela from "@/components/admin/PaginationTabela";
import DialogPedido from "@/components/admin/DialogPedido";
import SelectPage from "@/components/admin/SelectPage";
import { 
  Box,
  Heading,
  Stack,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import { useState, useEffect } from "react";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster"
import { verificarToken } from "@/middleware/verificarToken";
import { useRouter } from 'next/navigation';
import TrocaCrud from "@/components/admin/TrocaCrud";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState('');
  const [idUserCustomer, setIdUserCustomer] = useState('');
  const [idUserDeliver, setIdUserDeliver] = useState('');
  const [idAddress, setIdAddress] = useState('');
  const [idPayment, setIdPayment] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  
  
  const buscarPedido = async () => {
  try {
    const response = await api.get('/orders');
    setTasks(Array.isArray(response.data.data) ? response.data.data : []);
  } catch (error) {
    setTasks([]);
  }
};

    const buscarUsuarioAutenticado = async () => {
    try {
        const response = await api.get('/users/info-by-token');
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
        if (!usuario || (usuario.role || '').trim().toLowerCase() !== 'admin') {
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

  const criarTask = async () => {
  try {
    setLoadingSave(true);

    if (!status || !total || !idUserCustomer || !idAddress || !idPayment) {
      toaster.create({
        title: 'Preencha todos os campos',
        type: 'warning'
      });
      setLoadingSave(false);
      return;
    }

    let orderId = editingIndex;

    if (editingIndex !== null) {
      await api.patch(`/orders/${editingIndex}`, {
        status,
        total,
        idUserCustomer,
        idUserDeliver,
        idAddress,
        idPayment,
      });


    } else {
      const response = await api.post('/orders', {
        status,
        total,
        idUserCustomer,
        idUserDeliver: null,
        idAddress,
        idPayment,
      });
      orderId = response.data.data.id;
    }
    toaster.create({
      title: editingIndex !== null ? 'Pedido atualizado com sucesso.' : 'Pedido criado com sucesso.',
      type: 'success'
    });

    await buscarPedido();
    setIsDialogOpen(false);
    setStatus('');
    setTotal('');
    setIdUserCustomer('');
    setIdUserDeliver('');
    setIdAddress('');
    setIdPayment('');
    setEditingIndex(null);
    setLoadingSave(false);

  } catch (error) {
    toaster.create({
      title: error.response?.data?.message || 'Erro ao salvar pedido.',
      type: 'error'
    });
    setLoadingSave(false);
  }
};

  const editarTask = (taskEditar) => {
    console.log("Task recebida:", taskEditar);
  
    if (!taskEditar) {
      console.error("Task não encontrada ou inválida.");
      return;
    }
  
    setStatus(taskEditar.status || '');
    setTotal(taskEditar.total || '');
    setIdUserCustomer(taskEditar.idUserCustomer || '');
    setIdUserDeliver(taskEditar.idUserDeliver || '');
    setIdAddress(taskEditar.idAddress || '');
    setIdPayment(taskEditar.idPayment || '');
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true);
  };

  const excluirTask = async (id) => {
    try {
      if (confirm("Deseja excluir o pedido?")) {
      const taskDeletar = tasks.find((task) => task.id === id);
      await api.delete(`/orders/${taskDeletar.id}`); 
      const taskExcluido = tasks.filter(orders => orders.id !== taskDeletar.id);
      if (tasksAtuais.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      toaster.create({
        title: 'Pedido excluido com sucesso.',
        type: 'success'
      })
      setTasks(taskExcluido);
      }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir pedido.',
        type: 'error'
      })
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/admin/orders" />
      <Box p={8}>
        <Heading mb={4}> CRUD Pedidos </Heading>
        <Grid templateColumns="repeat(4, 1fr)" gap={6} ml={10} mr={-12}>
          <GridItem colSpan={3} ml={9}>
            <InputPesquisa
              searchTerm={searchTerm}
              SetSeachTerm={setSearchTerm}
            />
          </GridItem>
          <GridItem>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDialogOpen(true)} 
                mb={4}
                l={2}
            > 
                Criar Pedido
            </Button>
            <DialogPedido
                headers={[editingIndex !== null ? 'Editar Pedido' : 'Criar Pedido']}
                buttonName={[editingIndex !== null ? 'Editar Pedido' : 'Criar Pedido']}
                status={status}
                setStatus={setStatus}
                total={total}
                setTotal={setTotal}
                idUserCustomer={idUserCustomer}
                setIdUserCustomer={setIdUserCustomer}
                idUserDeliver={idUserDeliver}
                setIdUserDeliver={setIdUserDeliver}
                idAddress={idAddress}
                setIdAddress={setIdAddress}
                idPayment={idPayment}
                setIdPayment={setIdPayment}
                submit={criarTask}
                editingIndex={editingIndex}
                isOpen={isDialogOpen}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingIndex(null);
                  setStatus('');
                  setTotal('');
                  setIdUserCustomer('');
                  setIdAddress('');
                  setIdPayment('');
                }}
                loadingSave={loadingSave}
            />
          </GridItem>
        </Grid>
        <Stack style={{display: 'flex', alignItems: 'center'}}>
          <TabelaCrud
            items={tasksAtuais}
            onEdit={editarTask}
            onDelete={excluirTask}
            acoes={true}
            headers={[
              {name: 'ID', value: 'id'},
              {name: 'Status', value: 'status'},
              {name: 'Total', value: 'total'},
              {name: 'ID do Cliente', value: 'idUserCustomer'},
              {name: 'ID do Entregador', value: 'idUserDeliver'},
              {name: 'ID do Endereço', value: 'idAddress'},
              {name: 'ID do Tipo de Pagamento', value: 'idPayment'},
            ]}
          />
          <Grid templateColumns="repeat(4, 1fr)">
            <GridItem colSpan={3}>
              <PaginationTabela
                items={filteredTasks.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </GridItem>
            <GridItem ml={12} colSpan={1}>
              <SelectPage
                setItensPerPage={setItemsPerPage}
                items={[
                  {name: 5, value: 5},
                  {name: 10, value: 10},
                  {name: 15, value: 15},
                  {name: 20, value: 20},
                  {name: 25, value: 25},
                ]}
              />
            </GridItem>
          </Grid>
        </Stack>
      </Box>
    </>
    
  )
}