import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';

import { CategoriaService } from 'app/categorias/categoria.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { Lancamento } from './../../core/model';
import { LancamentoService } from '../lancamento.service';


@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  pessoas = [];
  categorias = [];
  lancamento = new Lancamento();
  dataVencimento1: string;
  dataPagamento1: string;

  constructor(
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private toasty: ToastyService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title

  ) { }

  ngOnInit() {
    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Lançamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo)
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
     this.formatarData();

    this.lancamentoService.adicionar(this.lancamento)
    .then(lancamentoAdicionado => {
      this.toasty.success('Lançamento adicionado com sucesso!');

      // form.reset();
      // this.lancamento = new Lancamento();
      this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento(form: FormControl) {


    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;

        this.toasty.success('Lançamento alterado com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  private  formatarData() {




  this.dataVencimento1 = moment(this.dataVencimento1).format('DD/MM/YYYY');
  // this.lancamento.dataVencimento = moment(  this.dataVencimento1  , 'DD/MM/YYYY').toDate();
  // this.lancamento.dataVencimento =  moment(this.dataVencimento1).format('DD/MM/YYYY');


  this.dataPagamento1 = moment(this.dataPagamento1).format('DD/MM/YYYY');
  this.lancamento.dataPagamento = moment(this.dataPagamento1 , 'DD/MM/YYYY').toDate();

 console.log(this.dataVencimento1);
 console.log(this.lancamento.dataVencimento);




    if ( this.lancamento.dataPagamento ) {
    // this.lancamento.dataPagamento  = moment(this.lancamento.dataPagamento).format('DD/MM/YYYY');
    }

    if (this.lancamento.dataVencimento) {
   //  this.lancamento.dataVencimento = moment(this.lancamento.dataVencimento).format('DD/MM/YYYY');
    }

    console.log(this.lancamento);


    }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {


        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas
          .map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }


  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }



}
