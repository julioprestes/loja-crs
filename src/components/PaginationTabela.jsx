import { Pagination, ButtonGroup, IconButton } from "@chakra-ui/react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

export default function PaginationTabela({ items, itemsPerPage, currentPage, setCurrentPage }) {
    return (
        <Pagination.Root 
                  count={items} 
                  pageSize={itemsPerPage} 
                  defaultPage={1}
                  page={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                >
                  <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                      <IconButton
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        <MdChevronLeft />
                      </IconButton>
                    </Pagination.PrevTrigger>
        
                    <Pagination.Items
                      render={(page) => (
                        <IconButton 
                          onClick={() => setCurrentPage(page.value)} 
                          variant={{ base: "ghost", _selected: "outline" }}
                        >
                          {page.value}
                        </IconButton>
                      )}
                    />
        
                    <Pagination.NextTrigger asChild>
                      <IconButton
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        <MdChevronRight />
                      </IconButton>
                    </Pagination.NextTrigger>
                  </ButtonGroup>
                </Pagination.Root>
    )
}