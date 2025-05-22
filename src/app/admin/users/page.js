'use client';
import InputPesquisa from "@/components/admin/InputPesquisa";
import TabelaCrud from "@/components/admin/TabelaCrud";
import PaginationTabela from "@/components/admin/PaginationTabela";
import DialogUsuario from "@/components/admin/DialogUsuario";
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
import TrocaCrud from "@/components/admin/TrocaCrud";
import { verificarToken } from "@/middleware/verificarToken";
import { useRouter } from 'next/navigation';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, SetLoadingSave] = useState(false);
  
  const buscarUsuario = async () => {
      try {
        const response = await api.get('/users')
        setTasks(response.data.data)
      } catch (error) {
        
      }
  }

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
        await buscarUsuario();
        } catch (error) {
        router.push('/login');
        }
    };

    validarToken();
  }, []);
  
  const filteredTasks = tasks.filter(task =>
    task.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem)

  const criarTask = async () => {
    try {
      SetLoadingSave(true)
      if (!input.trim()) return;
      if (editingIndex !== null) {
        const response = await api.patch(`/users/${editingIndex}`, {
            nome: input,
            email: email,
            cpf: cpf,
            role: role,
            password: senha,
            phone: phone,
            username: username,
        });
        await buscarUsuario();
        setInput('');
        setEmail('');
        setCpf('');
        setIdCargo('');
        setIsEstudante(false);
        setSenha('');
      } else {
        const response = await api.post('/users', {
            nome: input,
            email: email,
            cpf: cpf,
            role: role,
            password: senha,
            phone: phone,
            username: username,
        });
        toaster.create({
          title: 'Usuário criado com sucesso.',
          type: 'success'
        })
        await buscarUsuario();
      }
      setIsDialogOpen(false)
      setInput('');
      setEmail('');
      setCpf('');
      setRole('');
      setSenha('');
      setPhone('');
      setUsername('');
      SetLoadingSave(false)
    } catch (error) {
      console.log(error.response?.data || error.message);
      toaster.create({
        title: error.response?.data?.message || 'Erro ao criar Usuário.',
        type: 'error'
      });
      SetLoadingSave(false);
    }
  }

  const editarTask = (taskEditar) => {
    console.log("Usuario recebido:", taskEditar);
  
    if (!taskEditar) {
      console.error("Usuario não encontrado ou inválido.");
      return;
    }
  
    setInput(taskEditar.nome || '');
    setSenha(taskEditar.senha || '');
    setEmail(taskEditar.email || '');
    setCpf(taskEditar.cpf || '');
    setRole(taskEditar.role || '');
    setUsername(taskEditar.username || '');
    setPhone(taskEditar.phone || '');
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true);
  };

  const excluirTask = async (id) => {
    try {
        if (confirm("Deseja excluir o usuário?")) {
        const taskDeletar = tasks.find((task) => task.id === id);
        await api.delete(`/users/${taskDeletar.id}`); 
        const taskExcluido = tasks.filter(users => users.id !== taskDeletar.id);
        if (tasksAtuais.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        toaster.create({
            title: 'Usuário excluido com sucesso.',
            type: 'success'
        })
        setTasks(taskExcluido);
        }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir Usuário.',
        type: 'error'
      })
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/admin/users" />
      <Box p={8}>  
        <Heading mb={4}> CRUD Usuários </Heading>
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
                Criar Usuário
            </Button>
            <DialogUsuario
                headers={[editingIndex !== null ? 'Editar users' : 'Criar users']}
                buttonName={[editingIndex !== null ? 'Editar users' : 'Criar users']}
                input={input}
                setInput={setInput}
                senha={senha}
                setSenha={setSenha}
                email={email}
                setEmail={setEmail}
                cpf={cpf}
                setCpf={setCpf}
                phone={phone}
                setPhone={setPhone}
                role={role}
                setRole={setRole}
                username={username}
                setUsername={setUsername}
                submit={criarTask}
                editingIndex={editingIndex}
                isOpen={isDialogOpen}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingIndex(null);
                  setInput('');
                  setEmail('');
                  setCpf('');
                  setSenha('');
                  setUsername('');
                  setPhone('');
                  setRole('');
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
              {name: 'Nome', value: 'nome'},
              {name: 'Email', value: 'email'},
              {name: 'CPF', value: 'cpf'},
              {name: 'Username', value: 'username'},
              {name: 'Cargo', value: 'role'},
              {name: 'Telefone', value: 'phone'}
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