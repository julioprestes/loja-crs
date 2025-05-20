import { Table, Stack, Button } from "@chakra-ui/react"
import { MdMode, MdDelete } from 'react-icons/md'
import { Tooltip } from "@/components/ui/tooltip"

export default function TabelaCrud({items, headers, onEdit, onDelete, acoes}) {
  return (
    <Table.Root width="75%" size="sm" striped variant="outline">
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
            {headers.map((header, i) => (
              <Table.Cell key={i} textAlign="center">{cargo[header.value]}</Table.Cell>
            ))}
            <Table.Cell textAlign="center">
              {acoes && (<Stack direction="row">
                <Tooltip content="Editar">
                  <Button
                    background="Blue"
                    color="white"
                    variant="subtle"
                    size="xs"
                    onClick={() => onEdit(cargo)}
                  >
                    <MdMode />
                  </Button>
                </Tooltip>
                <Tooltip content="Excluir">
                  <Button
                    background="red"
                    color="white"
                    variant="subtle"
                    size="xs"
                    onClick={() => onDelete(cargo.id)}
                  >
                    <MdDelete />
                  </Button>
                </Tooltip>
              </Stack>)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}