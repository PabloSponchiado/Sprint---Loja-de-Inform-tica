import Movimentacao from "../model/Movimentacao.js";
import { type Request, type Response } from "express";
import type { MovimentacaoDTO } from "../model/Movimentacao.js";

class MovimentacaoController extends Movimentacao {
    static async todos(req: Request, res: Response) {
        try {
            const lista = await Movimentacao.listarMovimentacoes();
            if (lista.length === 0) {
                res.status(204).send();
                return;
            }
            res.status(200).json(lista);
        } catch (error) {
            console.error('[MovimentacaoController] Erro ao listar movimentações:', error);
            res.status(500).json({ mensagem: 'Erro interno ao recuperar movimentações.' });
        }
    }

    static async movimentacao(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ mensagem: 'ID inválido. Informe um número inteiro positivo.' });
                return;
            }
            const m = await Movimentacao.listarMovimentacao(id);
            res.status(200).json(m);
        } catch (error: any) {
            console.error(`[MovimentacaoController] Erro ao buscar movimentação (id: ${req.params.id}):`, error);
            if (error.message?.includes('não encontrada')) {
                res.status(404).json({ mensagem: error.message });
                return;
            }
            res.status(500).json({ mensagem: 'Erro interno ao recuperar a movimentação.' });
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dados: MovimentacaoDTO = req.body;

            if (!dados || !dados.id_produto || !dados.tipo || !dados.motivo || !dados.quantidade || !dados.observacao) {
                res.status(400).json({ mensagem: 'Campos obrigatórios ausentes: id_produto, tipo, motivo, quantidade, observacao.' });
                return;
            }

            // Se for VENDA, os campos financeiros são obrigatórios (validado no DB também)
            if (dados.motivo === 'VENDA' && (dados.preco_unitario_praticado == null || dados.valor_total == null)) {
                res.status(400).json({ mensagem: 'Para VENDA informe preco_unitario_praticado e valor_total.' });
                return;
            }

            const m = new Movimentacao(
                dados.id_produto,
                dados.tipo,
                dados.motivo,
                dados.quantidade,
                dados.observacao,
                dados.preco_unitario_praticado ?? null,
                dados.valor_total ?? null,
                dados.id_movimentacao_origem ?? null,
                dados.data_movimentacao ? new Date(dados.data_movimentacao) : undefined
            );

            const ok = await Movimentacao.cadastrarMovimentacao(m);
            if (ok) res.status(201).json({ mensagem: 'Movimentação cadastrada com sucesso.' });
            else res.status(400).json({ mensagem: 'Não foi possível cadastrar a movimentação.' });

        } catch (error) {
            console.error('[MovimentacaoController] Erro ao cadastrar movimentação:', error);
            res.status(500).json({ mensagem: 'Erro interno ao cadastrar a movimentação.' });
        }
    }
}

export default MovimentacaoController;
