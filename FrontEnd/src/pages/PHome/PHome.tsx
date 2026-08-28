import { TopNav } from '../../components/Navegacao/TopNav';
import CategoriaRequests from '../../fetch/CategoriaRequest';
import MovimentacaoRequests from '../../fetch/MovimentacaoRequest';
import ProdutoRequests from '../../fetch/ProdutoRequest';
import { useEffect, useState } from 'react';

export function HomePage() {
  const [produtos, setProdutos] = useState(0);
  const [categorias, setCategorias] = useState(0);
  const [movimentacoes, setMovimentacoes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [produtosData, categoriasData, movimentacoesData] = await Promise.all([
          ProdutoRequests.listar(),
          CategoriaRequests.listar(),
          MovimentacaoRequests.listar(),
        ]);

        setProdutos(produtosData.length);
        setCategorias(categoriasData.length);
        setMovimentacoes(movimentacoesData.length);
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <>
      <TopNav />
      <main className="page-shell">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Painel geral</p>
            <h2>Controle centralizado da operação</h2>
          </div>
          <button type="button" className="primary-button">+ Novo cadastro</button>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Produtos</span>
            <strong>{loading ? '...' : produtos}</strong>
          </article>
          <article className="stat-card">
            <span>Categorias</span>
            <strong>{loading ? '...' : categorias}</strong>
          </article>
          <article className="stat-card">
            <span>Movimentações</span>
            <strong>{loading ? '...' : movimentacoes}</strong>
          </article>
        </section>
      </main>
    </>
  );
}
