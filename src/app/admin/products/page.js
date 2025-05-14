'use client';
import InputPesquisa from "@/components/InputPesquisa";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import DialogProduto from "@/components/DialogProduto";
import SelectPage from "@/components/SelectPage";
import { 
  Box,
  Heading,
  Stack,
  Button,
  Grid,
  GridItem,
  Image
} from "@chakra-ui/react"
import { useState, useEffect } from "react";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster"
import TrocaCrud from "@/components/TrocaCrud";
import { verificarToken } from "@/middleware/verificarToken";
import { useRouter } from 'next/navigation';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [idCategory, setIdCategory] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, SetLoadingSave] = useState(false);
  const [file, setFile] = useState(null);
  
  const buscarProduto = async () => {
      try {
        const response = await api.get('/products')
        setTasks(response.data.data)
      } catch (error) {
        
      }
  }
  
  const router = useRouter();


  useEffect(() => {
    buscarProduto();
  }, []);

//   useEffect(() => {
//     const validarToken = async () => {
//       const valido = await verificarToken();
//       if (!valido) {
//         router.push('/');
//       } else {
//         await buscarProduto();
//       }
//     };

//     validarToken();
//   }, []);
  
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
        SetLoadingSave(true);

        if (!input.trim()) {
            toaster.create({
                title: "Produto sem nome.",
                type: "error",
            });
            SetLoadingSave(false);
            return;
        }

        const formData = new FormData();
        formData.append("name", input);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("idCategory", idCategory);

        if (file) {
            formData.append("arquivo", file);
        }

        if (editingIndex !== null) {
            formData.append("_method", "PATCH");
            const response = await api.patch(`/products/${editingIndex}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toaster.create({
                title: "Produto atualizado com sucesso.",
                type: "success",
            });
            await buscarProduto();
        } else {
            const response = await api.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toaster.create({
                title: "Produto criado com sucesso.",
                type: "success",
            });
            await buscarProduto();
        }

        setIsDialogOpen(false);
        setInput("");
        setDescription("");
        setPrice(null);
        setIdCategory(null);
        setFile(null); 
        SetLoadingSave(false);
    } catch (error) {
        console.log(error.response?.data || error.message);
        toaster.create({
            title: error.response?.data?.message || "Erro ao salvar o produto.",
            type: "error",
        });
        SetLoadingSave(false);
    }
  };

  const editarTask = (taskEditar) => {
    console.log("Task recebida:", taskEditar);
  
    if (!taskEditar) {
      console.error("Task não encontrada ou inválida.");
      return;
    }
  
    setInput(taskEditar.name || '');
    setDescricao(taskEditar.description || '');
    setAutor(taskEditar.price || null);
    setDuracao(taskEditar.idCategory || null);
    setFile(null);
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true);
  };

  const excluirTask = async (id) => {
    try {
        console.log("ID recebido para exclusão:", id);
        if (confirm("Deseja excluir o produto?")) {
        const taskDeletar = tasks.find((task) => task.id === id);
        await api.delete(`/products/${taskDeletar.id}`); 
        const taskExcluido = tasks.filter(products => products.id !== taskDeletar.id);
        if (tasksAtuais.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        toaster.create({
            title: 'Produto excluido com sucesso.',
            type: 'success'
        })
        setTasks(taskExcluido);
        }
        } catch (error) {
        toaster.create({
            title: 'Erro ao excluir produto.',
            type: 'error'
        })
        console.log(error);
      
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/admin/products" />
      <Box p={8}>
        <Heading mb={4}> CRUD Produtos </Heading>
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
                Criar Produto
            </Button>
            <DialogProduto
                headers={[editingIndex !== null ? 'Editar produto' : 'Criar produto']}
                buttonName={[editingIndex !== null ? 'Editar produto' : 'Criar produto']}
                input={input}
                setInput={setInput}
                file={file}
                setDescription={setDescription}
                description={description}
                price={price}
                setPrice={setPrice}
                idCategory={idCategory}
                setIdCategory={setIdCategory}
                setFile={setFile}
                submit={criarTask}
                editingIndex={editingIndex}
                isOpen={isDialogOpen}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingIndex(null);
                  setInput('');
                  setDescription('');
                  setPrice(null);
                  setIdCategory(null);
                  setFile(null);
                }}
                loadingSave={loadingSave}
            />
          </GridItem>
        </Grid>
        <Stack style={{display: 'flex', alignItems: 'center'}}>
          <TabelaCrud
            items={tasksAtuais.map(task => ({
              ...task,
              image: (
                <Image
                  rounded="md"
                  src={`http://localhost:3333${task.image.replace(/^.*\/public/, '')}`} 
                  alt={`Imagem do produto ${task.nome}`} 
                  style={{ width: '70px', height: '100px', objectFit: 'cover' }} 
                />
              )
            }))}
            onEdit={editarTask}
            onDelete={excluirTask}
            acoes={true}
            headers={[
              {name: 'ID', value: 'id'},
              {name: 'Nome', value: 'name'},
              {name: 'Preço', value: 'price'},
              {name: 'Autor', value: 'autor'},
              {name: 'ID da Categoria', value: 'idCategory'},
              {name: 'Imagem do Produto', value: 'image'}
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