export interface UsuarioDTO {
  id_usuario: number;
  nome: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  auth: boolean;
  token: string;
  usuario: UsuarioDTO;
  message?: string;
}

export interface CategoriaDTO {
  id_categoria: number;
  nome: string;
}

export interface ProdutoDTO {
  id_produto: number;
  id_categoria: number;
  codigo: string;
  nome: string;
  descricao?: string | null;
  preco_unitario: number;
  quantidade_disponivel: number;
  quantidade_minima: number;
  ativo: boolean;
  data_cadastro?: string | Date;
  categoria?: {
    id_categoria: number;
    nome?: string | null;
  } | null;
}

export interface MovimentacaoDTO {
  id_movimentacao: number;
  id_produto: number;
  id_movimentacao_origem?: number | null;
  tipo: string;
  motivo: string;
  quantidade: number;
  preco_unitario_praticado?: number | null;
  valor_total?: number | null;
  observacao: string;
  data_movimentacao: string | Date;
  produto?: {
    id_produto: number;
    codigo?: string;
    nome?: string;
  } | null;
}
