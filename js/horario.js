// horario.js — calcula se o petshop está aberto agora, comparando o
// horário do dispositivo do visitante com o horário de funcionamento
// listado na página de Contato.
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const elementoStatus = document.getElementById("status-funcionamento");
  if (!elementoStatus) return;

  // Regras de funcionamento (mesmas informadas na lista da página).
  // 0 = domingo, 1 = segunda ... 6 = sábado
  const regras = {
    0: null, // fechado aos domingos
    1: { abre: 9, fecha: 19 },
    2: { abre: 9, fecha: 19 },
    3: { abre: 9, fecha: 19 },
    4: { abre: 9, fecha: 19 },
    5: { abre: 9, fecha: 19 },
    6: { abre: 9, fecha: 13 },
  };

  const agora = new Date();
  const regraDeHoje = regras[agora.getDay()];
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;

  const estaAberto = Boolean(regraDeHoje) && horaAtual >= regraDeHoje.abre && horaAtual < regraDeHoje.fecha;

  elementoStatus.textContent = estaAberto
    ? "Estamos abertos agora"
    : "Estamos fechados no momento — confira nosso horário abaixo";
  elementoStatus.classList.add(estaAberto ? "aberto" : "fechado");
});