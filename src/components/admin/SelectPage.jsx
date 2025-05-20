import { Select, Portal, createListCollection } from "@chakra-ui/react"

export default function SelectPerPage({ items , setItensPerPage}) {
  const teste = createListCollection({
    items
  })

  return (
    <Select.Root defaultValue={[5]} onValueChange={(value) => setItensPerPage(value.value[0])} collection={teste} size="sm" width="100px"> 
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText  />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {teste.items.map((item, i) => (
              <Select.Item item={item} key={item.value}>
                {item.name}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}