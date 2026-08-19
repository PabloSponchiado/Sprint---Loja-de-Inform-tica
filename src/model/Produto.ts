// Modelo de dados para Produto
// Segue o mesmo padrão usado em Emprestimo: atributos privados, getters/setters,
// método estático para CRUD e um toDTO privado para mapear linhas do banco.

import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

// DTO simples para transportar dados de produto
export interface ProdutoDTO {
    id_produto: number;
    id_categoria: number;
    codigo: string;
    nome: string;
    descricao: string | null;
    preco_unitario: number;
    quantidade_disponivel: number;
    quantidade_minima: number;
    ativo: boolean;
    data_cadastro: Date;
    categoria?: {
        id_categoria: number;
        nome: string | null;
    } | null;
}

class Produto {

    private id_produto: number = 0;
    private id_categoria: number;
    private codigo: string;
    private nome: string;
    private descricao: string | null;
    private preco_unitario: number;
    private quantidade_disponivel: number = 0;
    private quantidade_minima: number = 0;
    private ativo: boolean = true;
    private data_cadastro: Date = new Date();

    constructor(
        _id_categoria: number,
        _codigo: string,
        _nome: string,
        _preco_unitario: number,
        _descricao?: string | null,
        _quantidade_disponivel?: number,
        _quantidade_minima?: number,
        _ativo?: boolean,
        _data_cadastro?: Date
    ) {
        this.id_categoria = _id_categoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.preco_unitario = _preco_unitario;
        this.descricao = _descricao ?? null;
        this.quantidade_disponivel = _quantidade_disponivel ?? 0;
        this.quantidade_minima = _quantidade_minima ?? 0;
        this.ativo = _ativo ?? true;
        this.data_cadastro = _data_cadastro ?? new Date();
    }

    // ========== GETTERS E SETTERS ==========
    public getIdProduto(): number { return this.id_produto; }
    public setIdProduto(value: number): void { this.id_produto = value; }

    public getIdCategoria(): number { return this.id_categoria; }
    public setIdCategoria(value: number): void { this.id_categoria = value; }

    public getCodigo(): string { return this.codigo; }
    public setCodigo(value: string): void { this.codigo = value; }

    public getNome(): string { return this.nome; }
    public setNome(value: string): void { this.nome = value; }

    public getDescricao(): string | null { return this.descricao; }
    public setDescricao(value: string | null): void { this.descricao = value; }

    public getPrecoUnitario(): number | null { return this.preco_unitario; }
    public setPrecoUnitario(value: number): void { this.preco_unitario = value; }

    public getQuantidadeDisponivel(): number | null { return this.quantidade_disponivel; }
    public setQuantidadeDisponivel(value: number): void { this.quantidade_disponivel = value; }

    public getQuantidadeMinima(): number | null { return this.quantidade_minima; }
    public setQuantidadeMinima(value: number): void { this.quantidade_minima = value; }

    public getAtivo(): boolean { return this.ativo; }
    public setAtivo(value: boolean): void { this.ativo = value; }

    public getDataCadastro(): Date { return this.data_cadastro; }
    public setDataCadastro(value: Date): void { this.data_cadastro = value; }

    // ========== toDTO privado ==========
    private static toDTO(linha: any): ProdutoDTO {
        return {
            id_produto: linha.id_produto,
            id_categoria: linha.id_categoria,
            codigo: linha.codigo,
            nome: linha.nome,
            descricao: linha.descricao ?? null,
            preco_unitario: parseFloat(linha.preco_unitario),
            quantidade_disponivel: linha.quantidade_disponivel,
            quantidade_minima: linha.quantidade_minima,
            ativo: linha.ativo,
            data_cadastro: linha.data_cadastro,
            categoria: linha.categoria_nome !== undefined ? {
                id_categoria: linha.id_categoria,
                nome: linha.categoria_nome ?? null
            } : null
        };
    }

    // ========== MÉTODOS ESTÁTICOS (CRUD) ==========
    static async listarProdutos(): Promise<ProdutoDTO[]> {
        try {
            const query = `
                SELECT p.*, c.nome AS categoria_nome
                FROM produto p
                LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
                WHERE p.ativo = TRUE;
            `;
            const resposta = await database.query(query);
            return resposta.rows.map(Produto.toDTO);
        } catch (error) {
            console.error("[ProdutoModel] Erro ao listar produtos:", error);
            throw error;
        }
    }

    static async listarProduto(id_produto: number): Promise<ProdutoDTO> {
        try {
            const query = `
                SELECT p.*, c.nome AS categoria_nome
                FROM produto p
                LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
                WHERE p.id_produto = $1;
            `;
            const resposta = await database.query(query, [id_produto]);
            if (resposta.rows.length === 0) {
                throw new Error(`Produto com ID ${id_produto} não encontrado.`);
            }
            return Produto.toDTO(resposta.rows[0]);
        } catch (error) {
            console.error(`[ProdutoModel] Erro ao buscar produto (id: ${id_produto}):`, error);
            throw error;
        }
    }

    static async cadastrarProduto(produto: Produto): Promise<boolean> {
        try {
            const query = `
                INSERT INTO produto
                    (id_categoria, codigo, nome, descricao, preco_unitario, quantidade_disponivel, quantidade_minima, ativo, data_cadastro)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                RETURNING id_produto;
            `;
            const valores = [
                produto.getIdCategoria(),
                produto.getCodigo(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPrecoUnitario(),
                produto.getQuantidadeDisponivel(),
                produto.getQuantidadeMinima(),
                produto.getAtivo(),
                produto.getDataCadastro()
            ];
            const resultado = await database.query(query, valores);
            if (resultado.rows.length === 0) {
                throw new Error("INSERT não retornou ID — cadastro pode ter falhado.");
            }
            console.info(`[ProdutoModel] Produto cadastrado. ID: ${resultado.rows[0].id_produto}`);
            return true;
        } catch (error) {
            console.error("[ProdutoModel] Erro ao cadastrar produto:", error);
            throw error;
        }
    }

    static async atualizarProduto(
        id_produto: number,
        id_categoria: number | null,
        codigo: string | null,
        nome: string | null,
        descricao: string | null,
        preco_unitario: number | null,
        quantidade_disponivel: number | null,
        quantidade_minima: number | null,
        ativo: boolean
    ): Promise<boolean> {
        try {
            const query = `
                UPDATE produto
                SET id_categoria = $1,
                    codigo = $2,
                    nome = $3,
                    descricao = $4,
                    preco_unitario = $5,
                    quantidade_disponivel = $6,
                    quantidade_minima = $7,
                    ativo = $8
                WHERE id_produto = $9
                RETURNING id_produto;
            `;
            const valores = [id_categoria, codigo, nome, descricao, preco_unitario, quantidade_disponivel, quantidade_minima, ativo, id_produto];
            const resultado = await database.query(query, valores);
            if (resultado.rowCount === 0) {
                throw new Error(`Produto com ID ${id_produto} não encontrado.`);
            }
            return true;
        } catch (error) {
            console.error(`[ProdutoModel] Erro ao atualizar produto (id: ${id_produto}):`, error);
            throw error;
        }
    }

    static async removerProduto(id_produto: number): Promise<boolean> {
        try {
            const query = `
                UPDATE produto
                SET ativo = FALSE
                WHERE id_produto = $1;
            `;
            const resposta = await database.query(query, [id_produto]);
            if (resposta.rowCount === 0) {
                throw new Error(`Produto com ID ${id_produto} não encontrado.`);
            }
            console.info(`[ProdutoModel] Produto removido logicamente. ID: ${id_produto}`);
            return true;
        } catch (error) {
            console.error(`[ProdutoModel] Erro ao remover produto (id: ${id_produto}):`, error);
            throw error;
        }
    }
}

export default Produto;
