import React from "react";
import { Carousel } from "@ark-ui/react/carousel";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import ProdutoCard from "./ProdutoCard";
import { IconButton, Link as ChakraLink } from "@chakra-ui/react"
import NextLink from "next/link";
import { MdNavigateNext } from "react-icons/md";

function arrumaLink(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") 
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFD") // Remove acentos
}

export default function Carrossel({ produtos, categorias }) {
  const produtosPorCategoria = categorias.map(cat => ({
    categoria: cat,
    produtos: produtos.filter(prod => prod.idCategory === cat.id)
  }));

  return (
    <div style={{ width: "100%", maxWidth: 1600, margin: "0 auto" }}>
      {produtosPorCategoria.map(({ categoria, produtos }) =>
        produtos.length > 0 && (
          <div key={categoria.id}>
            <h2 style={{ fontSize: "2.5rem", color: "#000", marginTop: 12 }}>
              <ChakraLink
                as={NextLink}
                href={`/menu/${arrumaLink(categoria.name)}`}
                _hover={{ textDecoration: "underline" }}
                style={{ color: "#000"}}
              >
                {categoria.name}
                <MdNavigateNext />
              </ChakraLink>
            </h2>
            <Carousel.Root 
              defaultPage={0}
              slideCount={produtos.length}
              loop
              allowMouseDrag
            >
              <Carousel.IndicatorGroup>
                {produtos.map((_, index) => (
                  <Carousel.Indicator key={index} index={index} />
                ))}
              </Carousel.IndicatorGroup>
              <Carousel.ItemGroup style={{ display: "flex" }}>
                {produtos.map((produto, index) => (
                  <Carousel.Item key={produto.id} index={index}>
                    <div style={{ padding: 8, minWidth: 320 }}>
                      <ProdutoCard produto={produto} />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel.ItemGroup>
              <Carousel.Control>
                <Carousel.PrevTrigger asChild>
                  <IconButton color="white" bg="black" _hover={{ bg: "orange" }} ml={2}>
                    <LuArrowLeft />
                  </IconButton>
                </Carousel.PrevTrigger>
                <Carousel.NextTrigger asChild>
                  <IconButton color="white" bg="black" ml={1} _hover={{ bg: "orange" }}>
                    <LuArrowRight />
                  </IconButton>
                </Carousel.NextTrigger>
              </Carousel.Control> 
            </Carousel.Root>
          </div>
        )
      )}
    </div>
  );
}