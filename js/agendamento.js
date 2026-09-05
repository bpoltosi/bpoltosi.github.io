// agendamento.js — cadastro de cliente/pet e agendamento de serviço
// (banho ou tosa, com tele-busca ou entrega no local).
//
// Não há backend nesta disciplina: o "envio" do formulário apenas
// valida os dados no navegador e monta um resumo em tela, seguindo os
// mesmos formatos de dados (Cliente, Pet, Agendamento) previstos para
// as próximas etapas do sistema.
"use strict";

const formatadorMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatadorData = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-agendamento");
  if (!formulario) return; // esta página não tem o formulário (segurança extra)

  const campoData = document.getElementById("data-agendamento");
  const checkboxRestricao = document.getElementById("tem-restricao");
  const wrapperRestricao = document.getElementById("detalhe-restricao-wrapper");
  const campoDetalheRestricao = document.getElementById("detalhe-restricao");
  const radiosFormaAgendamento = formulario.querySelectorAll('input[name="forma-agendamento"]');
  const notaTeleBusca = document.getElementById("nota-tele-busca");
  const radiosServico = formulario.querySelectorAll('input[name="servico"]');
  const resumoServico = document.getElementById("resumo-servico-selecionado");
  const campoCpf = document.getElementById("cpf-cliente");
  const areaResumoFinal = document.getElementById("resumo-agendamento");

  /** Impede que a pessoa escolha uma data anterior a hoje (função temporal). */
  function definirDataMinima() {
    const hoje = new Date();
    const isoLocal = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    campoData.setAttribute("min", isoLocal);
  }

  /** Mostra/oculta o campo de detalhes de restrição junto com o checkbox. */
  function alternarDetalheRestricao() {
    const marcado = checkboxRestricao.checked;
    wrapperRestricao.hidden = !marcado;
    campoDetalheRestricao.required = marcado;
    if (!marcado) campoDetalheRestricao.value = "";
  }

  /** Troca a explicação exibida conforme a forma de agendamento escolhida. */
  function atualizarNotaFormaAgendamento() {
    const escolha = formulario.querySelector('input[name="forma-agendamento"]:checked');
    if (!escolha) {
      notaTeleBusca.hidden = true;
      return;
    }
    notaTeleBusca.hidden = false;
    notaTeleBusca.textContent =
      escolha.value === "tele-busca"
        ? "Buscaremos o pet no endereço informado acima, no horário agendado."
        : "Traga o pet até o petshop no horário agendado.";
  }

  /** Mostra o serviço escolhido e o valor correspondente antes do envio. */
  function atualizarResumoServico() {
    const escolha = formulario.querySelector('input[name="servico"]:checked');
    if (!escolha) {
      resumoServico.textContent = "";
      return;
    }
    const preco = Number(escolha.dataset.preco);
    resumoServico.textContent = `Serviço selecionado: ${escolha.dataset.nome} — ${formatadorMoeda.format(preco)}`;
  }

  /** Mensagem de validação mais amigável para o CPF, sem exigir libs externas. */
  function configurarValidacaoCpf() {
    campoCpf.addEventListener("invalid", () => {
      campoCpf.setCustomValidity("Informe o CPF no formato 000.000.000-00.");
    });
    campoCpf.addEventListener("input", () => campoCpf.setCustomValidity(""));
  }

  /** Monta o objeto Cliente a partir dos campos do formulário. */
  function coletarCliente() {
    return {
      nome: document.getElementById("nome-cliente").value.trim(),
      endereco: document.getElementById("endereco-cliente").value.trim(),
      cpf: campoCpf.value.trim(),
      sexo: formulario.querySelector('input[name="sexo"]:checked')?.value ?? "não informado",
      telefone: document.getElementById("telefone-cliente").value.trim(),
      email: document.getElementById("email-cliente").value.trim(),
    };
  }

  /** Monta o objeto Pet a partir dos campos do formulário. */
  function coletarPet() {
    return {
      nome: document.getElementById("nome-pet").value.trim(),
      raca: document.getElementById("raca-pet").value.trim() || "não informada",
      idade: Number(document.getElementById("idade-pet").value),
      restricao: checkboxRestricao.checked ? campoDetalheRestricao.value.trim() : null,
    };
  }

  /** Monta o objeto Agendamento a partir dos campos do formulário. */
  function coletarAgendamento() {
    const servico = formulario.querySelector('input[name="servico"]:checked');
    const forma = formulario.querySelector('input[name="forma-agendamento"]:checked');
    const [ano, mes, dia] = campoData.value.split("-").map(Number);

    return {
      servico: servico.dataset.nome,
      precoServico: Number(servico.dataset.preco),
      formaAgendamento: forma.value === "tele-busca" ? "Tele-busca" : "Entrega no local",
      data: new Date(ano, mes - 1, dia),
      horario: document.getElementById("horario-agendamento").value,
    };
  }

  /** Renderiza o resumo final após uma submissão válida. */
  function exibirResumoFinal(cliente, pet, agendamento) {
    areaResumoFinal.innerHTML = `
      <div class="card p-3 mt-4">
        <h2 class="h4">Agendamento confirmado</h2>
        <p>Obrigado, ${cliente.nome}! Segue o resumo do agendamento de ${pet.nome}:</p>
        <ul>
          <li><strong>Serviço:</strong> ${agendamento.servico} (${formatadorMoeda.format(agendamento.precoServico)})</li>
          <li><strong>Forma de atendimento:</strong> ${agendamento.formaAgendamento}</li>
          <li><strong>Data:</strong> ${formatadorData.format(agendamento.data)}</li>
          <li><strong>Horário:</strong> ${agendamento.horario}</li>
        </ul>
        <p class="texto-dica mb-0">Em caso de dúvidas, entre em contato pelos canais da página Contato.</p>
      </div>
    `;
    areaResumoFinal.setAttribute("tabindex", "-1");
    areaResumoFinal.focus();
  }

  function tratarEnvio(evento) {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    const cliente = coletarCliente();
    const pet = coletarPet();
    const agendamento = coletarAgendamento();

    exibirResumoFinal(cliente, pet, agendamento);

    formulario.reset();
    definirDataMinima();
    alternarDetalheRestricao();
    atualizarNotaFormaAgendamento();
    atualizarResumoServico();
  }

  // --- ligação dos eventos (sem nenhum atributo on* inline no HTML) ---
  checkboxRestricao.addEventListener("change", alternarDetalheRestricao);
  radiosFormaAgendamento.forEach((radio) => radio.addEventListener("change", atualizarNotaFormaAgendamento));
  radiosServico.forEach((radio) => radio.addEventListener("change", atualizarResumoServico));
  formulario.addEventListener("submit", tratarEnvio);

  // --- estado inicial da página ---
  definirDataMinima();
  alternarDetalheRestricao();
  atualizarNotaFormaAgendamento();
  configurarValidacaoCpf();
});