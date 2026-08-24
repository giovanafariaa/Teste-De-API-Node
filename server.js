const express = require ('express')
const app = express ()

const produtos = [
  {
    "id": 1,
    "nome": "Notebook Dell Inspiron 15",
    "categoria": "Informática",
    "preco": 3499.90,
    "estoque": 12
  },
  {
    "id": 2,
    "nome": "Mouse Logitech MX Master",
    "categoria": "Periféricos",
    "preco": 549.90,
    "estoque": 25
  },
  {
    "id": 3,
    "nome": "Teclado Mecânico Keychron K2",
    "categoria": "Periféricos",
    "preco": 629.90,
    "estoque": 18
  },
  {
    "id": 4,
    "nome": "Monitor LG UltraWide 29",
    "categoria": "Monitores",
    "preco": 1499.90,
    "estoque": 8
  },
  {
    "id": 5,
    "nome": "Webcam Logitech C920",
    "categoria": "Periféricos",
    "preco": 429.90,
    "estoque": 15
  },
  {
    "id": 6,
    "nome": "SSD Kingston 1TB",
    "categoria": "Armazenamento",
    "preco": 459.90,
    "estoque": 30
  },
  {
    "id": 7,
    "nome": "Headset HyperX Cloud II",
    "categoria": "Áudio",
    "preco": 599.90,
    "estoque": 14
  },
  {
    "id": 8,
    "nome": "Hub USB-C 7 em 1",
    "categoria": "Acessórios",
    "preco": 289.90,
    "estoque": 40
  },
  {
    "id": 9,
    "nome": "Roteador TP-Link Archer AX23",
    "categoria": "Redes",
    "preco": 399.90,
    "estoque": 20
  },
  {
    "id": 10,
    "nome": "Caixa de Som JBL Flip 6",
    "categoria": "Áudio",
    "preco": 699.90,
    "estoque": 11
  },
  {
    "id": 11,
    "nome": "Carregador USB-C 65W",
    "categoria": "Acessórios",
    "preco": 199.90,
    "estoque": 35
  },
  {
    "id": 12,
    "nome": "HD Externo Seagate 2TB",
    "categoria": "Armazenamento",
    "preco": 529.90,
    "estoque": 17
  }
]

app.get('/', (req, res) => {
    res.send (`Olá estranho.`)
})

app.get('/produtos', (req, res) => {
    res.json(produtos)
})

app.get('/produtos/:id', (req, res) => {
    const id = parseInt (req.params.id)

    const index = produtos.findIndex (prod => prod.id === id)
    if (index >= 0) {
        res.json(produtos[index])
    } else {
        res.status(404).send ('Deu ruim -- Produto não existe')
    }
})


 app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const index = produtos.findIndex(prod => prod.id === id)
  if (index >= 0) {
    const produtoExcluido = produtos.splice(index, 1)
    res.json({ mensagem: 'Produto excluído com sucesso', produto: produtoExcluido[0] })
  } else {
    res.status(404).send('Deu ruim -- Produto não existe para deletar')
  }
})


const port = 3000
app.listen (port, ()=>{
    console.log (`Server rodando no http://localhost:${port}`)
})