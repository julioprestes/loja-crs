import {
  Dialog, Portal, Input, Button, CloseButton, Flex, VStack
} from "@chakra-ui/react";
import { MdCheck, MdAdd } from 'react-icons/md';
import { withMask } from "use-mask-input";
import { useState, useRef } from "react";
import api from "@/utils/axios";

export default function DialogEnderecos({ open, onClose, onEnderecoAdded }) {
  const [form, setForm] = useState({
    zipCode: "",
    state: "",
    city: "",
    street: "",
    district: "",
    numberForget: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // refs para máscaras
  const cepRef = useRef(null);
  const numberRef = useRef(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      await api.post("/addresses", {
        ...form,
        idUser: userId,
      });
      setForm({
        zipCode: "",
        state: "",
        city: "",
        street: "",
        district: "",
        numberForget: "",
      });
      if (onEnderecoAdded) onEnderecoAdded();
      onClose();
    } catch (err) {
      setError("Erro ao adicionar endereço.");
    }
    setLoading(false);
  };

  return (
    <Dialog.Root open={open} onClose={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Adicionar Endereço</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={4} mb={4}>
                <Input
                  placeholder="CEP"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  ref={withMask("99999-999", cepRef)}
                  variant="subtle"
                  mr={2}
                />
                <Input
                  placeholder="Estado"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  variant="subtle"
                  mr={2}
                />
                <Input
                  placeholder="Cidade"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  variant="subtle"
                  mr={2}
                />
                <Input
                  placeholder="Rua"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  variant="subtle"
                  mr={2}
                />
                <Input
                  placeholder="Bairro"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  variant="subtle"
                  mr={2}
                />
                <Input
                  placeholder="Número"
                  name="numberForget"
                  value={form.numberForget}
                  onChange={handleChange}
                  variant="subtle"
                  mr={2}
                />
                {error && <span style={{ color: "red" }}>{error}</span>}
              </VStack>
              <Flex mb={4}>
                <Button
                  onClick={handleSave}
                  background="green"
                  color="white"
                  isLoading={loading}
                  loadingText="Salvando..."
                >
                  <MdAdd />
                </Button>
              </Flex>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}