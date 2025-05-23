// 'use client';
// import { useState, useEffect } from "react";
// import {
//   Box, Heading, Text, Button, Image, Input, VStack, HStack, Flex, CloseButton, Dialog, Portal
// } from "@chakra-ui/react";
// import axios from "axios";

// export default function CarrinhoPage() {
//   const [cart, setCart] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editQuantity, setEditQuantity] = useState(1);
//   const [selectedCupom, setSelectedCupom] = useState("");
//   const [cupomError, setCupomError] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   useEffect(() => {
//     const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(cartLS);
//   }, []);

//   const calculateItemTotal = (item) => {
//     let total = (item.price || 0) * (item.quantity || 0);
//     if (item.cupom) {
//       if (item.cupom.type === "percent") {
//         total -= total * (parseFloat(item.cupom.discount) / 100);
//       } else if (item.cupom.type === "fixed") {
//         total -= parseFloat(item.cupom.discount);
//       }
//     }
//     return Math.max(total, 0);
//   };

//   const totalPrice = cart.reduce((total, item) => total + calculateItemTotal(item), 0).toFixed(2);

//   const deleteItem = (index) => {
//     if (window.confirm("Deseja realmente remover este item do carrinho?")) {
//       const newCart = [...cart];
//       newCart.splice(index, 1);
//       setCart(newCart);
//       localStorage.setItem("cart", JSON.stringify(newCart));
//     }
//   };

//   const editItem = (index) => {
//     setEditIndex(index);
//     setEditQuantity(cart[index].quantity);
//     setSelectedCupom(cart[index].cupom ? cart[index].cupom.code : "");
//     setCupomError(null);
//     setDialogOpen(true);
//   };

//   const saveEdit = async () => {
//     try {
//       let newCart = [...cart];
//       if (selectedCupom) {
//         const response = await axios.post("http://localhost:3333/cupoms/verify", { code: selectedCupom });
//         if (response.data.message === "Cupom válido") {
//           newCart[editIndex].quantity = editQuantity;
//           newCart[editIndex].cupom = { ...response.data, discount: parseFloat(response.data.discount) };
//           setCupomError(null);
//         } else {
//           setCupomError(response.data.message);
//           return;
//         }
//       } else {
//         newCart[editIndex].quantity = editQuantity;
//         newCart[editIndex].cupom = null;
//         setCupomError(null);
//       }
//       setCart(newCart);
//       localStorage.setItem("cart", JSON.stringify(newCart));
//       setDialogOpen(false);
//     } catch (error) {
//       setCupomError("Erro ao verificar o cupom. Tente novamente.");
//     }
//   };

//   return (
//     <Box bg="white" minH="100vh" p={8}>
//       <Heading mb={6} color="black">Itens no Carrinho</Heading>
//       <Flex wrap="wrap" gap={6}>
//         {cart.map((item, index) => (
//           <Box key={index} maxW="490px" maxH="170px" bg="gray.100" borderRadius="md" p={4}>
//             <Flex>
//               <Image src={item.image} boxSize="120px" objectFit="cover" borderRadius="md" mr={4} />
//               <VStack align="start" spacing={1}>
//                 <Text fontWeight="bold">{item.name}</Text>
//                 <Text>Quantidade: {item.quantity}</Text>
//                 <Text>Preço: R${item.price}</Text>
//                 <Text>Total: R${calculateItemTotal(item).toFixed(2)}</Text>
//                 <HStack>
//                   <Button size="sm" colorScheme="blue" onClick={() => editItem(index)}>Editar</Button>
//                   <Button size="sm" colorScheme="red" onClick={() => deleteItem(index)}>Excluir</Button>
//                 </HStack>
//               </VStack>
//             </Flex>
//           </Box>
//         ))}
//         {/* Card com o Total da Compra */}
//         <Box minW="250px" maxH="170px" bg="orange.100" borderRadius="md" p={4} ml="auto">
//           <Text fontWeight="bold">Total da Compra</Text>
//           <Text>Itens: {cart.length}</Text>
//           <Text><strong>Total: R${totalPrice}</strong></Text>
//         </Box>
//       </Flex>

//       {/* Dialog de edição */}
//       <Dialog.Root open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <Portal>
//           <Dialog.Backdrop />
//           <Dialog.Positioner>
//             <Dialog.Content>
//               <Dialog.Header>
//                 <Dialog.Title>Edição de Quantidade</Dialog.Title>
//               </Dialog.Header>
//               <Dialog.Body>
//                 <Input
//                   type="number"
//                   min={1}
//                   value={editQuantity}
//                   onChange={e => setEditQuantity(Number(e.target.value))}
//                   mb={2}
//                   placeholder="Quantidade"
//                 />
//                 <Input
//                   value={selectedCupom}
//                   onChange={e => setSelectedCupom(e.target.value)}
//                   mb={2}
//                   placeholder="Cupom"
//                 />
//                 {cupomError && <Text color="red">{cupomError}</Text>}
//               </Dialog.Body>
//               <Dialog.Footer>
//                 <Dialog.ActionTrigger asChild>
//                   <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
//                 </Dialog.ActionTrigger>
//                 <Button colorScheme="green" onClick={saveEdit}>Salvar</Button>
//               </Dialog.Footer>
//               <Dialog.CloseTrigger asChild>
//                 <CloseButton size="sm" onClick={() => setDialogOpen(false)} />
//               </Dialog.CloseTrigger>
//             </Dialog.Content>
//           </Dialog.Positioner>
//         </Portal>
//       </Dialog.Root>
//     </Box>
//   );
// }
