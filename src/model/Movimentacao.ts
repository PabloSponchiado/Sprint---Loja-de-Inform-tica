import { DatabaseModel } from "./DatabaseModel.js";
import type MovimentacaoDTO from "../interface/MovimentacaoDTO.js";

const database = new DatabaseModel().pool;

class Movimentacao {
    private id_movimentacao: number = 0;
    private id_produto: number;
    private id_movimentacao_origem: number | null;
    private tipo: string;
    private motivo: string;
    private quantidade: number;
    private preco_unitario_praticado: number | null;
    private valor_total: number | null;
    private observacao: string;
    private data_movimentacao: Date = new Date();

    constructor(
        _id_produto: number,
        _tipo: string,
        _motivo: string,
        _quantidade: number,
        _observacao: string,
        _preco_unitario_praticado?: number | null,
        _valor_total?: number | null,
        _id_movimentacao_origem?: number | null,
        _data_movimentacao?: Date
    ) {
        this.id_produto = _id_produto;
        this.tipo = _tipo;
        this.motivo = _motivo;
        this.quantidade = _quantidade;
        this.observacao = _observacao;
        this.preco_unitario_praticado = _preco_unitario_praticado ?? null;
        this.valor_total = _valor_total ?? null;
        this.id_movimentacao_origem = _id_movimentacao_origem ?? null;
        this.data_movimentacao = _data_movimentacao ?? new Date();
    }

    public getIdMovimentacao(): number { return this.id_movimentacao; }
    public setIdMovimentacao(value: number): void { this.id_movimentacao = value; }

    public getIdProduto(): number { return this.id_produto; }
    public getTipo(): string { return this.tipo; }
    public getMotivo(): string { return this.motivo; }
    public getQuantidade(): number { return this.quantidade; }
    public getPrecoUnitarioPraticado(): number | null { return this.preco_unitario_praticado; }
    public getValorTotal(): number | null { return this.valor_total; }
    public getObservacao(): string { return this.observacao; }
    public getDataMovimentacao(): Date { return this.data_movimentacao; }

    private static toDTO(linha: any): MovimentacaoDTO {
        return {
            id_movimentacao: linha.id_movimentacao,
            id_produto: linha.id_produto,
            id_movimentacao_origem: linha.id_movimentacao_origem ?? null,
            tipo: linha.tipo,
            motivo: linha.motivo,
            quantidade: linha.quantidade,
            preco_unitario_praticado: linha.preco_unitario_praticado ?? null,
            valor_total: linha.valor_total ?? null,
            observacao: linha.observacao,
            data_movimentacao: linha.data_movimentacao,
            produto: linha.codigo ? {
                id_produto: linha.id_produto,
                codigo: linha.codigo,
                nome: linha.nome
            } : null
        };
    }

    static async listarMovimentacoes(): Promise<MovimentacaoDTO[]> {
        try {
            const query = `
                SELECT m.*, p.codigo, p.nome
                FROM movimentacao m
                JOIN produto p ON p.id_produto = m.id_produto
                ORDER BY m.data_movimentacao DESC;
            `;
            const resp = await database.query(query);
            return resp.rows.map(Movimentacao.toDTO);
        } catch (error) {
            console.error('[MovimentacaoModel] Erro ao listar movimentacoes:', error);
            throw error;
        }
    }

    static async listarMovimentacao(id_movimentacao: number): Promise<MovimentacaoDTO> {
        try {
            const query = `
                SELECT m.*, p.codigo, p.nome
                FROM movimentacao m
                JOIN produto p ON p.id_produto = m.id_produto
                WHERE m.id_movimentacao = $1;
            `;
            const resp = await database.query(query, [id_movimentacao]);
            if (resp.rows.length === 0) throw new Error(`Movimentação com ID ${id_movimentacao} não encontrada.`);
            return Movimentacao.toDTO(resp.rows[0]);
        } catch (error) {
            console.error(`[MovimentacaoModel] Erro ao buscar movimentacao (id: ${id_movimentacao}):`, error);
            throw error;
        }
    }

    static async cadastrarMovimentacao(m: Movimentacao): Promise<boolean> {
        try {
            const query = `
                INSERT INTO movimentacao
                    (id_produto, id_movimentacao_origem, tipo, motivo, quantidade, preco_unitario_praticado, valor_total, observacao, data_movimentacao)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                RETURNING id_movimentacao;
            `;
            const valores = [
                m.getIdProduto(),
                (m as any).id_movimentacao_origem ?? null,
                m.getTipo(),
                m.getMotivo(),
                m.getQuantidade(),
                m.getPrecoUnitarioPraticado(),
                m.getValorTotal(),
                m.getObservacao(),
                m.getDataMovimentacao()
            ];
            const resp = await database.query(query, valores);
            if (resp.rows.length === 0) throw new Error('INSERT não retornou ID.');
            console.info(`[MovimentacaoModel] Movimentação cadastrada. ID: ${resp.rows[0].id_movimentacao}`);
            return true;
        } catch (error) {
            console.error('[MovimentacaoModel] Erro ao cadastrar movimentacao:', error);
            throw error;
        }
    }
}

export default Movimentacao;
