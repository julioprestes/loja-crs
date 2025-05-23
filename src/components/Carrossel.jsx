import React from "react";
import Slider from "react-slick";
import ProdutoCard from "./ProdutoCard";


export default function Carrossel({ produtos, categorias }) {
  const produtosPorCategoria = categorias.map(cat => ({
    categoria: cat,
    produtos: produtos.filter(prod => prod.idCategory === cat.id)
  }));

  const baseSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
  };

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      {produtosPorCategoria.map(({ categoria, produtos }) =>
        produtos.length > 0 && (
          <div key={categoria.id} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: "2.5rem", color: "#000", marginBottom: 16 }}>
              {categoria.name}
            </h2>
            <Slider
              {...baseSettings}
              slidesToShow={Math.min(3, produtos.length)}
            >
              {produtos.map(produto => (
                <div key={produto.id}>
                  <ProdutoCard produto={produto} />
                </div>
              ))}
            </Slider>
          </div>
        )
      )}
    </div>
  );
}