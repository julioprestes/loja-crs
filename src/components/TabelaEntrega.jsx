import { Table, Stack, Button, Box } from "@chakra-ui/react"
import { MdOutlineDeliveryDining } from "react-icons/md";
import { Tooltip } from "@/components/ui/tooltip"

export default function TabelaEntrega({items, headers, onAtribuir, acoes, disableAtribuir}) {
  return (
    <Box display="flex" justifyContent="center" width="100%" py={8} background="white">
      <Table.Root width="90%" size="sm" boxShadow="md">
        <Table.Header>
          <Table.Row>
            {headers.map((header, i) => (
              <Table.ColumnHeader textAlign="center" key={i}>{header.name}</Table.ColumnHeader>
            ))}
            <Table.ColumnHeader textAlign="center"></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((cargo) => (
            <Table.Row key={cargo.id}>
              {headers.map((header, i) => {
                if (header.value === 'total') {
                  return (
                    <Table.Cell key={i} textAlign="center">
                      R${Number(cargo.total).toFixed(2)}
                    </Table.Cell>
                  );
                }
                if (header.value === 'idAddress') {
                  const endereco = cargo.address || cargo.idAddress;
                  if (endereco && typeof endereco === 'object') {
                    return (
                      <Table.Cell key={i} textAlign="center">
                        {`${endereco.street}, ${endereco.numberForget} - ${endereco.city}`}
                      </Table.Cell>
                    );
                  }
                  return (
                    <Table.Cell key={i} textAlign="center">
                      {typeof endereco === 'string' ? endereco : ''}
                    </Table.Cell>
                  );
                }
                if (header.value === 'idPayment') {
                  const pagamento = cargo.payment || cargo.idPayment;
                  if (pagamento && typeof pagamento === 'object') {
                    return (
                      <Table.Cell key={i} textAlign="center">
                        {pagamento.name}
                      </Table.Cell>
                    );
                  }
                  return (
                    <Table.Cell key={i} textAlign="center">
                      {typeof pagamento === 'string' ? pagamento : ''}
                    </Table.Cell>
                  );
                }
                return (
                  <Table.Cell key={i} textAlign="center">{cargo[header.value]}</Table.Cell>
                );
              })}
              <Table.Cell textAlign="center">
                {acoes && (
                  <Stack direction="row">
                    <Tooltip content="Atribuir Entrega">
                      <Button
                        background="blue"
                        color="white"
                        variant="subtle"
                        size="xs"
                        onClick={() => onAtribuir(cargo)}
                        isDisabled={disableAtribuir && disableAtribuir(cargo)}
                        opacity={disableAtribuir && disableAtribuir(cargo) ? 0.5 : 1}
                        cursor={disableAtribuir && disableAtribuir(cargo) ? "not-allowed" : "pointer"}
                      >
                        <MdOutlineDeliveryDining />
                      </Button>
                    </Tooltip>
                  </Stack>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}