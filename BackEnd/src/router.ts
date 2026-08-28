import { Router, type Request, type Response } from "express";
import { Auth } from "./middleware/Auth.js";

import CategoriaController from './controller/CategoriaController.js';
import MovimentacaoController from './controller/MovimentacaoController.js';
import ProdutoController from './controller/ProdutoController.js';

const router = Router();

// HEALTH CHECK
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Aplicação online.", timestamp: new Date() });
});

// LOGIN
router.post('/api/login', Auth.validacaoUsuario);

// ROTAS DE PRODUTO
router.get('/api/produtos', Auth.verifyToken, ProdutoController.todos);
router.get('/api/produtos/:id', Auth.verifyToken, ProdutoController.produto);
router.post('/api/produtos', Auth.verifyToken, ProdutoController.cadastrar);
router.put('/api/produtos/:id', Auth.verifyToken, ProdutoController.atualizar);
router.delete('/api/produtos/:id', Auth.verifyToken, ProdutoController.remover);

// ROTAS DE CATEGORIA
router.get('/api/categorias', Auth.verifyToken, CategoriaController.todos);
router.get('/api/categorias/:id', Auth.verifyToken, CategoriaController.categoria);
router.post('/api/categorias', Auth.verifyToken, CategoriaController.cadastrar);
router.put('/api/categorias/:id', Auth.verifyToken, CategoriaController.atualizar);
router.delete('/api/categorias/:id', Auth.verifyToken, CategoriaController.remover);

// ROTAS DE MOVIMENTAÇÃO
router.get('/api/movimentacoes', Auth.verifyToken, MovimentacaoController.todos);
router.get('/api/movimentacoes/:id', Auth.verifyToken, MovimentacaoController.movimentacao);
router.post('/api/movimentacoes', Auth.verifyToken, MovimentacaoController.cadastrar);

export { router };
