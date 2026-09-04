// main.js — comportamentos compartilhados por todas as páginas
// Carregado em index.html, produtos.html, servicos.html e contato.html.
"use strict";

/**
 * Marca o link de navegação correspondente à página atual como ativo,
 * tanto visualmente (classe "active") quanto para leitores de tela
 * (aria-current="page"). Evita repetir essa marcação manualmente em
 * cada arquivo HTML.
 */
function marcarLinkAtivo() {
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    const destino = link.getAttribute("href");
    if (destino === paginaAtual) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/**
 * Atualiza o ano exibido no rodapé automaticamente, para que o texto
 * de direitos autorais nunca fique desatualizado.
 */
function atualizarAnoRodape() {
  const spanAno = document.getElementById("ano-atual");
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }
}

/**
 * Exibe uma saudação de acordo com o horário do dispositivo do
 * visitante (bom dia / boa tarde / boa noite). Só executa se o
 * elemento existir na página (isto é, na página inicial).
 */
function exibirSaudacaoDinamica() {
  const elementoSaudacao = document.getElementById("saudacao-dinamica");
  if (!elementoSaudacao) return;

  const horaAtual = new Date().getHours();
  let saudacao;
  if (horaAtual < 12) {
    saudacao = "Bom dia";
  } else if (horaAtual < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }
  elementoSaudacao.textContent = `${saudacao}! Bem-vindo ao Petshop Amigo Fiel.`;
}

document.addEventListener("DOMContentLoaded", () => {
  marcarLinkAtivo();
  atualizarAnoRodape();
  exibirSaudacaoDinamica();
});