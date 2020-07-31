import { Component, ViewChild, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ToastyService } from 'ng2-toasty';
import { ConfirmationService } from 'primeng/components/common/api';

import { PessoaService } from './../pessoa.service';
import { PessoaFiltro } from '../pessoa.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { AuthService } from 'app/seguranca/auth.service';


@Component({
  selector: 'app-pessoas-pesquisar',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  @ViewChild('tabela') grid;

  constructor(
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private toasty: ToastyService,
    private confirmation: ConfirmationService,
    private title: Title,
    private auth: AuthService
    ) {}

    ngOnInit() {
      this.title.setTitle('Pesquisa de pessoas');
    }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }



  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
          // this.grid.first = 0  para setar a pagina 1 da tabela ativando o metodo aoMudarPagina.
        }

        this.toasty.success('Lançamento excluído com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  mudarStatus(pessoa: any) {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo , novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.toasty.success(`Pessoa ${acao} com sucesso!`);
      } )
      .catch(erro => this.errorHandler.handle(erro));
  }



}
