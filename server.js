const express = require('express');

const app = express();


app.use(express.json());


let produtos = [
  { id: 1, descricao: 'Teclado Mecânico', preco: 249.90, categoria: 'Periféricos', estoque: 15 },
  { id: 2, descricao: 'Mouse sem fio', preco: 89.90, categoria: 'Periféricos', estoque: 25 },
  { id: 3, descricao: 'Monitor 24 polegadas', preco: 899.90, categoria: 'Monitores', estoque: 8 },
  { id: 4, descricao: 'Headset Gamer', preco: 199.90, categoria: 'Áudio', estoque: 12 },
  { id: 5, descricao: 'Webcam Full HD', preco: 159.90, categoria: 'Periféricos', estoque: 20 }
];

let proximoId = produtos.length + 1;


app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Produtos no ar. Use /produtos.' });
});

app.get('/produtos', (req, res) => {
  res.status(200).json(produtos);
});


app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.status(200).json(produto);
});


app.post('/produtos', (req, res) => {
  const { descricao, preco, categoria, estoque } = req.body;


  if (!descricao || preco === undefined || !categoria || estoque === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: descricao, preco, categoria, estoque'
    });
  }

  const novoProduto = {
    id: proximoId++,
    descricao,
    preco,
    categoria,
    estoque
  };

  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
});


app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const { descricao, preco, categoria, estoque } = req.body;

  if (descricao !== undefined) produto.descricao = descricao;
  if (preco !== undefined) produto.preco = preco;
  if (categoria !== undefined) produto.categoria = categoria;
  if (estoque !== undefined) produto.estoque = estoque;

  res.status(200).json(produto);
});

app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = produtos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos.splice(indice, 1);

  res.status(204).send();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API de Produtos rodando na porta ${PORT}`);
});