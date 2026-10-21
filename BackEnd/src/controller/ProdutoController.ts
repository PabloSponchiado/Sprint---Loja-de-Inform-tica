import Produto from "../model/Produto.js";
import { type Request, type Response } from "express";
import type ProdutoDTO from "../interface/ProdutoDTO.js";

class ProdutoController extends Produto {

    static async todos(req: Request, res: Response) {
        try {
            const lista = await Produto.listarProdutos();
            if (lista.length === 0) {
                res.status(204).send();
                return;
            }
            res.status(200).json(lista);
        } catch (error) {
            console.error("[ProdutoController] Erro ao listar produtos:", error);
            res.status(500).json({ mensagem: "Erro interno ao recuperar produtos." });
        }
    }

    static async produto(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ mensagem: "ID inválido. Informe um número inteiro positivo." });
                return;
            }
            const produto = await Produto.listarProduto(id);
            res.status(200).json(produto);
        } catch (error: any) {
            console.error(`[ProdutoController] Erro ao buscar produto (id: ${req.params.id}):`, error);
            if (error.message?.includes("não encontrado")) {
                res.status(404).json({ mensagem: error.message });
                return;
            }
            res.status(500).json({ mensagem: "Erro interno ao recuperar o produto." });
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dados: ProdutoDTO = req.body;

            if (dados == null || dados.id_categoria == null || !dados.codigo || !dados.nome || dados.preco_unitario == null) {
                res.status(400).json({ mensagem: "Campos obrigatórios ausentes: id_categoria, codigo, nome, preco_unitario." });
                return;
            }

            const produto = new Produto(
                dados.id_categoria,
                dados.codigo,
                dados.nome,
                dados.preco_unitario,
                dados.descricao ?? null,
                dados.quantidade_disponivel ?? undefined,
                dados.quantidade_minima ?? undefined,
                dados.ativo ?? undefined,
                dados.data_cadastro ? new Date(dados.data_cadastro) : undefined
            );

            const ok = await Produto.cadastrarProduto(produto);
            if (ok) {
                res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
            } else {
                res.status(400).json({ mensagem: "Não foi possível cadastrar o produto." });
            }

        } catch (error) {
            console.error("[ProdutoController] Erro ao cadastrar produto:", error);
            res.status(500).json({ mensagem: "Erro interno ao cadastrar o produto." });
        }
    }

    static async atualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ mensagem: "ID inválido. Informe um número inteiro positivo." });
                return;
            }

            const dados: ProdutoDTO = req.body;
            if (dados == null || dados.id_categoria == null || !dados.codigo || !dados.nome || dados.preco_unitario == null || dados.quantidade_minima == null || dados.quantidade_disponivel == null || dados.ativo == null) {
                res.status(400).json({ mensagem: "Campos obrigatórios ausentes para atualização: id_categoria, codigo, nome, preco_unitario, quantidade_disponivel, quantidade_minima, ativo." });
                return;
            }

            const result = await Produto.atualizarProduto(
                id,
                dados.id_categoria,
                dados.codigo,
                dados.nome,
                dados.descricao ?? null,
                dados.preco_unitario,
                dados.quantidade_disponivel,
                dados.quantidade_minima,
                dados.ativo
            );

            if (result) {
                res.status(200).json({ mensagem: "Produto atualizado com sucesso." });
            } else {
                res.status(404).json({ mensagem: "Produto não encontrado." });
            }

        } catch (error: any) {
            console.error(`[ProdutoController] Erro ao atualizar produto (id: ${req.params.id}):`, error);
            if (error.message?.includes("não encontrado")) {
                res.status(404).json({ mensagem: error.message });
                return;
            }
            res.status(500).json({ mensagem: "Erro interno ao atualizar o produto." });
        }
    }

    static async remover(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ mensagem: "ID inválido. Informe um número inteiro positivo." });
                return;
            }
            const resultado = await Produto.removerProduto(id);
            if (resultado) {
                res.status(200).json({ mensagem: "Produto removido com sucesso." });
            } else {
                res.status(404).json({ mensagem: "Produto não encontrado." });
            }
        } catch (error: any) {
            console.error(`[ProdutoController] Erro ao remover produto (id: ${req.params.id}):`, error);
            if (error.message?.includes("não encontrado")) {
                res.status(404).json({ mensagem: error.message });
                return;
            }
            res.status(500).json({ mensagem: "Erro interno ao remover o produto." });
        }
    }
}

export default ProdutoController;
