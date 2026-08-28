import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../../components/Navegacao/TopNav';
import CategoriaRequests from '../../fetch/CategoriaRequest';
import MovimentacaoRequests from '../../fetch/MovimentacaoRequest';
import ProdutoRequests from '../../fetch/ProdutoRequest';
import type { CategoriaDTO, MovimentacaoDTO, ProdutoDTO } from '../../dto';

const headersMap = {
  produtos: ['Código', 'Nome', 'Categoria', 'Preço', 'Estoque', 'Status'],
  categorias: ['ID', 'Nome'],
  movimentacoes: ['Produto', 'Tipo', 'Motivo', 'Quantidade', 'Data'],
} as const;

export function ListagemPage({ tipo }: { tipo: 'produtos' | 'categorias' | 'movimentacoes' }) {
  const [items, setItems] = useState<ProdutoDTO[] | CategoriaDTO[] | MovimentacaoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tipo === 'produtos') {
          const data = await ProdutoRequests.listar();
          setItems(data);
        } else if (tipo === 'categorias') {
          const data = await CategoriaRequests.listar();
          setItems(data);
        } else {
          const data = await MovimentacaoRequests.listar();
          setItems(data);
        }
      } catch (error) {
        console.error(`Erro ao carregar ${tipo}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tipo]);

  const formatTitle = {
    produtos: 'Produtos',
    categorias: 'Categorias',
    movimentacoes: 'Movimentações',
  }[tipo];

  return (
    <>
      <TopNav />
      <main className="page-shell">
        <section className="list-header">
          <div>
            <p className="eyebrow">Listagem</p>
            <h2>{formatTitle}</h2>
          </div>
          <button type="button" className="primary-button">+ Adicionar</button>
        </section>

        {loading ? (
          <div className="empty-state">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">Nenhum registro encontrado.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {headersMap[tipo].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tipo === 'produtos' && (items as ProdutoDTO[]).map((produto) => (
                  <tr key={produto.id_produto}>
                    <td>{produto.codigo}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.categoria?.nome ?? '-'}</td>
                    <td>{Number(produto.preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td>{produto.quantidade_disponivel}</td>
                    <td>{produto.ativo ? 'Ativo' : 'Inativo'}</td>
                    <td>
                      <Link to={`/detalhes/produtos/${produto.id_produto}`}>Detalhes</Link>
                    </td>
                  </tr>
                ))}

                {tipo === 'categorias' && (items as CategoriaDTO[]).map((categoria) => (
                  <tr key={categoria.id_categoria}>
                    <td>{categoria.id_categoria}</td>
                    <td>{categoria.nome}</td>
                    <td>
                      <Link to={`/detalhes/categorias/${categoria.id_categoria}`}>Detalhes</Link>
                    </td>
                  </tr>
                ))}

                {tipo === 'movimentacoes' && (items as MovimentacaoDTO[]).map((movimentacao) => (
                  <tr key={movimentacao.id_movimentacao}>
                    <td>{movimentacao.produto?.nome ?? movimentacao.id_produto}</td>
                    <td>{movimentacao.tipo}</td>
                    <td>{movimentacao.motivo}</td>
                    <td>{movimentacao.quantidade}</td>
                    <td>{new Date(movimentacao.data_movimentacao).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <Link to={`/detalhes/movimentacoes/${movimentacao.id_movimentacao}`}>Detalhes</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
