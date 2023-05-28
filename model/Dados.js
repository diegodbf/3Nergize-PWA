const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*Juntei tudo no mesmo modelo, porque, imaginei que >posteriormente< pode-se utilizar os registros
desse modelo no banco como sendo cada mês. 

As fases: Fornecimento dos 2 inputs iniciais (data inicial + kwh inicial) + salvamento com o resto null 
> depois, quando o cliente fornecer os dados finais (*kw final* e *data final*), 
utilizar rota de patch e atualizar os 2 campos de input finais (que estavam null) > utilizar a outra
rota de patch de Atualizar os Resultados do cálculo (que estavam null também).*/
let Dados = new Schema({
  mes: {
    type: String,
    required: true
  },
    dataInicial: {
      type: Date,
      required: true
    },
    kwhInicial: {
      type: Number,
      required: true
    },
    dataFinal: {
      type: Date,
      required: true
    },
    kwhFinal: {
      type: Number,
      required: true
    },
    resultadoKwh: {
      type: Number,
      required: true
    },
    resultadoPeriodo: {
      type: Number,
      required: true
    },
    resultadoValor: {
      type: Number,
      required: true
    },
  });

module.exports = mongoose.model('Dados', Dados);
