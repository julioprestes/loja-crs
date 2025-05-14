import { Input } from "@chakra-ui/react"

export default function InputPesquisa({ searchTerm, SetSeachTerm}) {
  return (
    <Input
      placeholder="Pesquisar..."
      value={searchTerm}
      variant="flushed"
      onChange={(e) => SetSeachTerm(e.target.value)}
      mb={4}
    />
  )
}