import { type FormEvent, useEffect, useState } from 'react';
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

type EditForm = {
  id_categoria: string;
  codigo: string;
  nome: string;
  descricao: string;
  preco_unitario: string;
  quantidade_disponivel: string;
  quantidade_minima: string;
  ativo: boolean;
};

export function ListagemPage({ tipo }: { tipo: 'produtos' | 'categorias' | 'movimentacoes' }) {
  const [items, setItems] = useState<ProdutoDTO[] | CategoriaDTO[] | MovimentacaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [editingItem, setEditingItem] = useState<ProdutoDTO | CategoriaDTO | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    id_categoria: '', codigo: '', nome: '', descricao: '', preco_unitario: '',
    quantidade_disponivel: '', quantidade_minima: '', ativo: true,
  });

  const atualizarLista = async () => {
    if (tipo === 'produtos') setItems(await ProdutoRequests.listar());
    else if (tipo === 'categorias') setItems(await CategoriaRequests.listar());
    else setItems(await MovimentacaoRequests.listar());
  };

  const adicionar = async () => {
    if (tipo === 'movimentacoes') return;

    const nome = window.prompt('Nome:')?.trim();
    if (!nome) return;

    try {
      setActionError('');
      if (tipo === 'categorias') {
        await CategoriaRequests.cadastrar({ nome });
      } else {
        const codigo = window.prompt('Código:')?.trim();
        const idCategoria = Number(window.prompt('ID da categoria:'));
        const preco = Number(window.prompt('Preço unitário:'));
        if (!codigo || !Number.isInteger(idCategoria) || idCategoria <= 0 || !Number.isFinite(preco)) return;
        await ProdutoRequests.cadastrar({
          id_categoria: idCategoria,
          codigo,
          nome,
          preco_unitario: preco,
          quantidade_disponivel: 0,
          quantidade_minima: 0,
          ativo: true,
          descricao: null,
        });
      }
      await atualizarLista();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível cadastrar o registro.');
    }
  };

  const abrirEdicao = (item: ProdutoDTO | CategoriaDTO) => {
    setActionError('');
    setEditingItem(item);
    if (tipo === 'categorias') {
      setEditForm({ ...editForm, nome: item.nome });
      return;
    }

    const produto = item as ProdutoDTO;
    setEditForm({
      id_categoria: String(produto.id_categoria),
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao ?? '',
      preco_unitario: String(produto.preco_unitario),
      quantidade_disponivel: String(produto.quantidade_disponivel),
      quantidade_minima: String(produto.quantidade_minima),
      ativo: produto.ativo,
    });
  };

  const editar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;

    try {
      setActionError('');
      if (tipo === 'categorias') {
        await CategoriaRequests.atualizar((editingItem as CategoriaDTO).id_categoria, { nome: editForm.nome.trim() });
      } else {
        const produto = editingItem as ProdutoDTO;
        await ProdutoRequests.atualizar(produto.id_produto, {
          id_categoria: Number(editForm.id_categoria), codigo: editForm.codigo.trim(), nome: editForm.nome.trim(),
          descricao: editForm.descricao.trim() || null, preco_unitario: Number(editForm.preco_unitario),
          quantidade_disponivel: Number(editForm.quantidade_disponivel), quantidade_minima: Number(editForm.quantidade_minima),
          ativo: editForm.ativo, data_cadastro: produto.data_cadastro,
        });
      }
      setEditingItem(null);
      await atualizarLista();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível atualizar o registro.');
    }
  };

  const remover = async (id: number) => {
    if (!window.confirm('Deseja realmente remover este registro?')) return;

    try {
      setActionError('');
      if (tipo === 'categorias') await CategoriaRequests.remover(id);
      else if (tipo === 'produtos') await ProdutoRequests.remover(id);
      else return;
      await atualizarLista();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível remover o registro.');
    }
  };

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
          {tipo !== 'movimentacoes' && <button type="button" className="primary-button" onClick={adicionar}>+ Adicionar</button>}
        </section>

        {actionError && <p role="alert" className="action-error">{actionError}</p>}

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
                      <button type="button" onClick={() => abrirEdicao(produto)}>Editar</button>
                      <button type="button" onClick={() => remover(produto.id_produto)}>Excluir</button>
                    </td>
                  </tr>
                ))}

                {tipo === 'categorias' && (items as CategoriaDTO[]).map((categoria) => (
                  <tr key={categoria.id_categoria}>
                    <td>{categoria.id_categoria}</td>
                    <td>{categoria.nome}</td>
                    <td>
                      <Link to={`/detalhes/categorias/${categoria.id_categoria}`}>Detalhes</Link>
                      <button type="button" onClick={() => abrirEdicao(categoria)}>Editar</button>
                      <button type="button" onClick={() => remover(categoria.id_categoria)}>Excluir</button>
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

        {editingItem && (
          <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditingItem(null)}>
            <form className="edit-modal" onSubmit={editar}>
              <div className="modal-header">
                <div><p className="eyebrow">Edição</p><h3>{tipo === 'categorias' ? 'Editar categoria' : 'Editar produto'}</h3></div>
                <button type="button" className="modal-close" aria-label="Fechar" onClick={() => setEditingItem(null)}>×</button>
              </div>

              {tipo === 'categorias' ? (
                <label className="field-label">Nome
                  <input required value={editForm.nome} onChange={(event) => setEditForm({ ...editForm, nome: event.target.value })} />
                </label>
              ) : (
                <div className="form-grid">
                  <label className="field-label">ID da categoria
                    <input required type="number" min="1" value={editForm.id_categoria} onChange={(event) => setEditForm({ ...editForm, id_categoria: event.target.value })} />
                  </label>
                  <label className="field-label">Código
                    <input required value={editForm.codigo} onChange={(event) => setEditForm({ ...editForm, codigo: event.target.value })} />
                  </label>
                  <label className="field-label field-wide">Nome
                    <input required value={editForm.nome} onChange={(event) => setEditForm({ ...editForm, nome: event.target.value })} />
                  </label>
                  <label className="field-label field-wide">Descrição
                    <textarea value={editForm.descricao} onChange={(event) => setEditForm({ ...editForm, descricao: event.target.value })} />
                  </label>
                  <label className="field-label">Preço unitário
                    <input required type="number" min="0" step="0.01" value={editForm.preco_unitario} onChange={(event) => setEditForm({ ...editForm, preco_unitario: event.target.value })} />
                  </label>
                  <label className="field-label">Estoque atual
                    <input required type="number" min="0" value={editForm.quantidade_disponivel} onChange={(event) => setEditForm({ ...editForm, quantidade_disponivel: event.target.value })} />
                  </label>
                  <label className="field-label">Estoque mínimo
                    <input required type="number" min="0" value={editForm.quantidade_minima} onChange={(event) => setEditForm({ ...editForm, quantidade_minima: event.target.value })} />
                  </label>
                  <label className="checkbox-label"><input type="checkbox" checked={editForm.ativo} onChange={(event) => setEditForm({ ...editForm, ativo: event.target.checked })} /> Produto ativo</label>
                </div>
              )}
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setEditingItem(null)}>Cancelar</button><button type="submit" className="primary-button">Salvar alterações</button></div>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
