//requisitos
const express = require('express');
const mongoose = require('mongoose');
const Dados = require('./model/Dados');//modelo - ler comentário no arquivo de modelo
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


//definição de porta
const port = 3000;


app.use(bodyParser.json()); //parece que a versão 4.16.0 do express em diante já traz isso


//CORS: ---------------------------------------
app.use(cors());

//Conexão com o banco
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/3nergize', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexão bem-sucedida com o MongoDB.');
    // Iniciar o servidor do aplicativo na porta 3000
    app.listen(port, function() {
      console.log('Listening on port 3000!');
    });
  })
  .catch((error) => {
    console.error('Erro na conexão com o MongoDB:', error);
  });

//função para obter string do nome do mês atual
function obterNomeMesAtual() {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();

  return meses[mesAtual];
}

app.use(router)

// ROTAS ------------------###---(post, update e get) (ler com atenção)----------------------------------------------------------



/*ROTA POST CRIANDO REGISTRO DE DADOS > alimentando dados iniciais < DA CALCULADORA NO BANCO
Dados iniciais DO MÊS - **kwh inicial**, **data inicial**. 
Nome do MÊS será utilizado como parâmetro em outras rotas <<<<<<<< */ 
router.post('/dados', (req, res) => {
  const { dataInicial, kwhInicial } = req.body;

  const novoDado = new Dados({
    mes:obterNomeMesAtual(),//valor do campo mes é a String do nome do mês atual de quando o registro foi criado
    dataInicial,
    kwhInicial,
    dataFinal: null,
    kwhFinal: null,
    resultadoKwh: null,
    resultadoPeriodo: null,
    resultadoValor: null
  });

  novoDado.save()
    .then(() => {
      res.send('Registro inicial criado com sucesso!');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao criar o registro inicial.');
    });
});


/*ROTA PARA alimentação de DADOS FINAIS DO MÊS (**KWH FINAL** + **DATA FINAL**) <<<<<<<<<<<<<<<<<<<<<<
parâmetro de select: campo mes (mês), informar mês */
router.patch('/dados/finais/:mes', (req, res) => {
  const { mes } = req.params;
  const { dataFinal, kwhFinal } = req.body;

  // Construindo o objeto de atualização com os campos fornecidos
  const updateFields = {
    dataFinal,
    kwhFinal
  };

  Dados.findOneAndUpdate({ mes }, updateFields, { new: true })
    .then((dadosAtualizados) => {
      if (dadosAtualizados) {
        res.send('Registro dados finais atualizado com sucesso!');
      } else {
        res.status(404).send('Registro (mês) não encontrado.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao atualizar o registro de dados finais.');
    });
});


// ROTA PARA ALIMENTAÇÃO DO RESULTADO DO CÁLCULO DO MÊS 
router.patch('/dados/resultados/:mes', (req, res) => {
  const { mes } = req.params;
  const { resultadoKwh, resultadoPeriodo, resultadoValor } = req.body;

  // Construindo o objeto de atualização com os campos fornecidos
  const updateFields = {
    resultadoKwh,
    resultadoPeriodo,
    resultadoValor
  };

  Dados.findOneAndUpdate({ mes }, updateFields, { new: true })
    .then((dadosAtualizados) => {
      if (dadosAtualizados) {
        res.send('Registro de resultados atualizado com sucesso!');
      } else {
        res.status(404).send('Registro (mês) não encontrado.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao atualizar o registro de resultados.');
    });
});


//rota para atualização de **dados inicias** (kwh inicial + data inicial)
router.patch('/dados/:mes', (req, res) => {
  const { mes } = req.params;
  const { dataInicial, kwhInicial } = req.body;

  // Construindo o objeto de atualização com os campos fornecidos
  const updateFields = {
    dataInicial,
    kwhInicial,
  };

  Dados.findOneAndUpdate({ mes }, updateFields, { new: true })
    .then((dadosAtualizados) => {
      if (dadosAtualizados) {
        res.send('Registro dados inicias atualizado com sucesso!');
      } else {
        res.status(404).send('Registro (mês) não encontrado.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao atualizar o registro de dados iniciais.');
    });
});

//ROTASS PARA GET ----------------

// ROTA PARA OBTENÇÃO DO VALOR DOS TRÊS PRIMEIROS CAMPOS DE UM MÊS ESPECÍFICO (mes,kwh inicial,data inicial)
// parâmetro String nome do mês do registro
router.get('/dados/iniciais/:mes', (req, res) => {
  const { mes } = req.params;

  Dados.findOne({ mes })
    .then((dados) => {
      if (dados) {
        const { mes, dataInicial, kwhInicial } = dados;
        const resultado = {
          mes,
          dataInicial,
          kwhInicial
        };
        res.json(resultado);
      } else {
        res.status(404).send('Registro (mês) não encontrado.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao buscar o registro de dados.');
    });
});


// ROTA PARA OBTENÇÃO DO VALOR DOS VALORES FINAIS (*KWH FINAL* + *DATA FINAL*)
// parâmetro String nome do mês do registro
router.get('/dados/finais/:mes', (req, res) => {
  const { mes } = req.params;

  Dados.findOne({ mes })
    .then((dados) => {
      if (dados) {
        const { dataFinal, kwhFinal } = dados;
        const resultado = {
          dataFinal,
          kwhFinal
        };
        res.json(resultado);
      } else {
        res.status(404).send('Registro (mês) não encontrado.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao buscar o registro de dados.');
    });
});

// ROTA PARA OBTENÇÃO DO VALOR DOS RESULTADOS
// parâmetro String nome do mês do registro
router.get('/dados/resultados/:mes', (req, res) => {
  const { mes } = req.params;

  Dados.findOne({ mes })
    .then((dados) => {
      if (dados) {
        const { resultadoKwh, resultadoPeriodo, resultadoValor } = dados;
        const resultado = {
          resultadoKwh,
          resultadoPeriodo,
          resultadoValor
        };
        res.json(resultado);
      } else {
        res.status(404).send('Registro (mês) não encontrado.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao buscar o registro de dados.');
    });
});


// Exportando o router
module.exports = router;















