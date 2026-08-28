import { DatabaseModel } from "./DatabaseModel.js";
import type CategoriaDTO from "../interface/CategoriaDTO.js";

const database = new DatabaseModel().pool;

class Categoria {
    private id_categoria: number = 0;
    private nome: string;

    constructor(_nome: string) {
        this.nome = _nome;
    }

    public getIdCategoria(): number { return this.id_categoria; }
    public setIdCategoria(value: number): void { this.id_categoria = value; }

    public getNome(): string { return this.nome; }
    public setNome(value: string): void { this.nome = value; }

    private static toDTO(linha: any): CategoriaDTO {
        return {
            id_categoria: linha.id_categoria,
            nome: linha.nome
        };
    }

    static async listarCategorias(): Promise<CategoriaDTO[]> {
        try {
            const query = `SELECT id_categoria, nome FROM categoria ORDER BY nome`;
            const resp = await database.query(query);
            return resp.rows.map(Categoria.toDTO);
        } catch (error) {
            console.error('[CategoriaModel] Erro ao listar categorias:', error);
            throw error;
        }
    }

    static async listarCategoria(id_categoria: number): Promise<CategoriaDTO> {
        try {
            const query = `SELECT id_categoria, nome FROM categoria WHERE id_categoria = $1`;
            const resp = await database.query(query, [id_categoria]);
            if (resp.rows.length === 0) throw new Error(`Categoria com ID ${id_categoria} não encontrada.`);
            return Categoria.toDTO(resp.rows[0]);
        } catch (error) {
            console.error(`[CategoriaModel] Erro ao buscar categoria (id: ${id_categoria}):`, error);
            throw error;
        }
    }

    static async cadastrarCategoria(categoria: Categoria): Promise<boolean> {
        try {
            const query = `INSERT INTO categoria (nome) VALUES ($1) RETURNING id_categoria`;
            const valores = [categoria.getNome()];
            const resp = await database.query(query, valores);
            if (resp.rows.length === 0) throw new Error('INSERT não retornou ID.');
            console.info(`[CategoriaModel] Categoria cadastrada. ID: ${resp.rows[0].id_categoria}`);
            return true;
        } catch (error) {
            console.error('[CategoriaModel] Erro ao cadastrar categoria:', error);
            throw error;
        }
    }

    static async atualizarCategoria(id_categoria: number, nome: string): Promise<boolean> {
        try {
            const query = `UPDATE categoria SET nome = $1 WHERE id_categoria = $2 RETURNING id_categoria`;
            const resp = await database.query(query, [nome, id_categoria]);
            if (resp.rowCount === 0) throw new Error(`Categoria com ID ${id_categoria} não encontrada.`);
            return true;
        } catch (error) {
            console.error(`[CategoriaModel] Erro ao atualizar categoria (id: ${id_categoria}):`, error);
            throw error;
        }
    }

    static async removerCategoria(id_categoria: number): Promise<boolean> {
        try {
            const query = `DELETE FROM categoria WHERE id_categoria = $1`;
            const resp = await database.query(query, [id_categoria]);
            if (resp.rowCount === 0) throw new Error(`Categoria com ID ${id_categoria} não encontrada.`);
            console.info(`[CategoriaModel] Categoria removida. ID: ${id_categoria}`);
            return true;
        } catch (error) {
            console.error(`[CategoriaModel] Erro ao remover categoria (id: ${id_categoria}):`, error);
            throw error;
        }
    }
}

export default Categoria;
