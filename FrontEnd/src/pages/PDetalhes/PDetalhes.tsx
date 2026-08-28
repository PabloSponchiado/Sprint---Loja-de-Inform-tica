import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TopNav } from '../../components/Navegacao/TopNav';
import CategoriaRequests from '../../fetch/CategoriaRequest';
import MovimentacaoRequests from '../../fetch/MovimentacaoRequest';
import ProdutoRequests from '../../fetch/ProdutoRequest';
import type { CategoriaDTO, MovimentacaoDTO, ProdutoDTO } from '../../dto';

export function DetalhesPage() {
  const { tipo, id } = useParams();
  const [item, setItem] = useState<ProdutoDTO | CategoriaDTO | MovimentacaoDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!tipo || !id) return;

      try {
        const numericId = Number(id);
        if (tipo === 'produtos') {
          const data = await ProdutoRequests.obter(numericId);
          setItem(data);
        } else if (tipo === 'categorias') {
          const data = await CategoriaRequests.obter(numericId);
          setItem(data);
        } else {
          const data = await MovimentacaoRequests.obter(numericId);
          setItem(data);
        }
      } catch (error) {
        console.error('Erro ao carregar detalhe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [tipo, id]);

  if (loading) {
    return (
      <>
        <TopNav />
        <main className="page-shell"><div className="empty-state">Carregando detalhe...</div></main>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <TopNav />
        <main className="page-shell"><div className="empty-state">Registro não encontrado.</div></main>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <main className="page-shell detail-page">
        <section className="detail-card">
          <p className="eyebrow">Detalhes</p>
          <h2>{tipo === 'produtos' ? (item as ProdutoDTO).nome : tipo === 'categorias' ? (item as CategoriaDTO).nome : (item as MovimentacaoDTO).motivo}</h2>

          <dl className="detail-grid">
            {tipo === 'produtos' && (
              <>
                <div><dt>Código</dt><dd>{(item as ProdutoDTO).codigo}</dd></div>
                <div><dt>Categoria</dt><dd>{(item as ProdutoDTO).categoria?.nome ?? '-'}</dd></div>
                <div><dt>Preço</dt><dd>{Number((item as ProdutoDTO).preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</dd></div>
                <div><dt>Estoque</dt><dd>{(item as ProdutoDTO).quantidade_disponivel}</dd></div>
                <div><dt>Status</dt><dd>{(item as ProdutoDTO).ativo ? 'Ativo' : 'Inativo'}</dd></div>
                <div><dt>Descrição</dt><dd>{(item as ProdutoDTO).descricao ?? 'Sem descrição'}</dd></div>
              </>
            )}

            {tipo === 'categorias' && (
              <>
                <div><dt>ID</dt><dd>{(item as CategoriaDTO).id_categoria}</dd></div>
                <div><dt>Nome</dt><dd>{(item as CategoriaDTO).nome}</dd></div>
              </>
            )}

            {tipo === 'movimentacoes' && (
              <>
                <div><dt>Produto</dt><dd>{(item as MovimentacaoDTO).produto?.nome ?? (item as MovimentacaoDTO).id_produto}</dd></div>
                <div><dt>Tipo</dt><dd>{(item as MovimentacaoDTO).tipo}</dd></div>
                <div><dt>Motivo</dt><dd>{(item as MovimentacaoDTO).motivo}</dd></div>
                <div><dt>Quantidade</dt><dd>{(item as MovimentacaoDTO).quantidade}</dd></div>
                <div><dt>Valor</dt><dd>{(item as MovimentacaoDTO).valor_total ? Number((item as MovimentacaoDTO).valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}</dd></div>
                <div><dt>Data</dt><dd>{new Date((item as MovimentacaoDTO).data_movimentacao).toLocaleString('pt-BR')}</dd></div>
              </>
            )}
          </dl>
        </section>
      </main>
    </>
  );
}
