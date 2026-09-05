// produtos.js — filtro por categoria e busca em tempo real na página de produtos.
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const botoesFiltro = document.querySelectorAll("[data-filtro-categoria]");
  const campoBusca = document.getElementById("busca-produto");
  const cards = document.querySelectorAll(".produto-card");

  // Guarda o filtro de categoria selecionado no momento, para poder
  // combiná-lo com o texto digitado na busca sem precisar reler o DOM.
  let categoriaAtiva = "todos";

  function aplicarFiltros() {
    const termoBusca = campoBusca.value.trim().toLowerCase();

    cards.forEach((card) => {
      const categoriaDoCard = card.closest("section.categoria").id;
      const nomeDoProduto = card.querySelector(".card-title").textContent.toLowerCase();

      const combinaCategoria = categoriaAtiva === "todos" || categoriaDoCard === categoriaAtiva;
      const combinaBusca = nomeDoProduto.includes(termoBusca);

      card.classList.toggle("produto-oculto", !(combinaCategoria && combinaBusca));
    });

    atualizarVisibilidadeDasSecoes();
  }

  // Quando um filtro de categoria some com todos os produtos visíveis
  // (por causa da busca), esconde o título da seção também, para não
  // deixar um cabeçalho "Acessórios" sem nenhum card embaixo.
  function atualizarVisibilidadeDasSecoes() {
    document.querySelectorAll("section.categoria").forEach((secao) => {
      const temCardVisivel = secao.querySelector(".produto-card:not(.produto-oculto)");
      secao.classList.toggle("d-none", !temCardVisivel);
    });
  }

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("change", () => {
      categoriaAtiva = botao.value;
      aplicarFiltros();
    });
  });

  campoBusca.addEventListener("input", aplicarFiltros);
});