import moment = require('moment');

export class Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

export class Pessoa {
  codigo: number;
  nome: string;
  endereco = new Endereco();
  ativo = true;
}

export class Categoria {
  codigo: number;
}

export class Lancamento {
  codigo: number;
  tipo = 'RECEITA';
  descricao: string;
  dataVencimento: Date;
  dataPagamento: Date;
  valor: number;
  observacao: string;
  pessoa = new Pessoa();
  categoria = new Categoria();

  static toJson(lancamento: Lancamento): any {
    return {

      codigo : lancamento.codigo,
      tipo : lancamento.tipo,
      descricao : lancamento.descricao,
      valor : lancamento.valor,
      observacao : lancamento.observacao,
      pessoa : lancamento.pessoa,
      categoria : lancamento.categoria ,
      dataVencimento: moment(lancamento.dataVencimento).format('DD/MM/YYYY'),
      dataPagamento: moment(lancamento.dataPagamento).format('DD/MM/YYYY')

    };
  }
}
