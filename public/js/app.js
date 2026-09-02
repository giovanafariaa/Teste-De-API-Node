
const URL_API = '/produtos';


const corpoTabela = document.getElementById('corpoTabela');
const estadoVazio = document.getElementById('estadoVazio');
const contagemProdutos = document.getElementById('contagemProdutos');

const formProduto = document.getElementById('formProduto');
const campoId = document.getElementById('produtoId');
const campoDescricao = document.getElementById('descricao');
const campoPreco = document.getElementById('preco');
const campoCategoria = document.getElementById('categoria');
const campoEstoque = document.getElementById('estoque');

const tituloFormulario = document.getElementById('tituloFormulario');
const botaoSalvar = document.getElementById('botaoSalvar');
const botaoCancelar = document.getElementById('botaoCancelar');
const mensagem = document.getElementById('mensagem');



function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function exibirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.hidden = false;

  setTimeout(() => {
    mensagem.hidden = true;
  }, 3500);
}

function entrarModoEdicao(produto) {
  campoId.value = produto.id;
  campoDescricao.value = produto.descricao;
  campoPreco.value = produto.preco;
  campoCategoria.value = produto.categoria;
  campoEstoque.value = produto.estoque;

  tituloFormulario.textContent = `Editando produto #${produto.id}`;
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;

  campoDescricao.focus();
}

function sairModoEdicao() {
  formProduto.reset();
  campoId.value = '';

  tituloFormulario.textContent = 'Novo produto';
  botaoSalvar.textContent = 'Cadastrar produto';
  botaoCancelar.hidden = true;
}



function renderizarProdutos(produtos) {
  corpoTabela.innerHTML = '';

  contagemProdutos.textContent = produtos.length;

  if (produtos.length === 0) {
    estadoVazio.hidden = false;
    return;
  }

  estadoVazio.hidden = true;

  produtos.forEach(produto => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td class="col-id">${produto.id}</td>
      <td>${produto.descricao}</td>
      <td class="col-preco">${formatarPreco(produto.preco)}</td>
      <td>${produto.categoria}</td>
      <td class="col-estoque">${produto.estoque}</td>
      <td class="col-acoes">
        <div class="acoes-linha">
          <button type="button" class="botao-editar" data-id="${produto.id}">Editar</button>
          <button type="button" class="botao-excluir" data-id="${produto.id}">Excluir</button>
        </div>
      </td>
    `;

    corpoTabela.appendChild(linha);
  });
}



async function carregarProdutos() {
  try {
    const resposta = await fetch(URL_API);

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar os produtos');
    }

    const produtos = await resposta.json();
    renderizarProdutos(produtos);
  } catch (erro) {
    exibirMensagem(erro.message, 'erro');
  }
}

async function salvarProduto(dados, id) {
  const emEdicao = Boolean(id);
  const url = emEdicao ? `${URL_API}/${id}` : URL_API;
  const metodo = emEdicao ? 'PUT' : 'POST';

  const resposta = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));
    throw new Error(corpo.erro || 'Não foi possível salvar o produto');
  }

  return resposta.json();
}

async function excluirProduto(id) {
  const resposta = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });

  if (!resposta.ok && resposta.status !== 204) {
    throw new Error('Não foi possível excluir o produto');
  }
}

formProduto.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const dados = {
    descricao: campoDescricao.value.trim(),
    preco: Number(campoPreco.value),
    categoria: campoCategoria.value.trim(),
    estoque: Number(campoEstoque.value)
  };

  const id = campoId.value;

  try {
    await salvarProduto(dados, id);
    exibirMensagem(
      id ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.',
      'sucesso'
    );
    sairModoEdicao();
    carregarProdutos();
  } catch (erro) {
    exibirMensagem(erro.message, 'erro');
  }
});

botaoCancelar.addEventListener('click', () => {
  sairModoEdicao();
});

corpoTabela.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const id = botao.dataset.id;

  if (botao.classList.contains('botao-editar')) {
    try {
      const resposta = await fetch(`${URL_API}/${id}`);
      if (!resposta.ok) throw new Error('Produto não encontrado');
      const produto = await resposta.json();
      entrarModoEdicao(produto);
    } catch (erro) {
      exibirMensagem(erro.message, 'erro');
    }
    return;
  }

  if (botao.classList.contains('botao-excluir')) {
    const confirmar = window.confirm('Deseja realmente excluir este produto?');
    if (!confirmar) return;

    try {
      await excluirProduto(id);
      exibirMensagem('Produto excluído com sucesso.', 'sucesso');

      // Se o produto excluído estava sendo editado, volta ao modo de cadastro
      if (campoId.value === id) {
        sairModoEdicao();
      }

      carregarProdutos();
    } catch (erro) {
      exibirMensagem(erro.message, 'erro');
    }
  }
});

carregarProdutos();