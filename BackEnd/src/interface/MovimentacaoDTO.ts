export default interface MovimentacaoDTO {
    id_movimentacao: number;
    id_produto: number;
    id_movimentacao_origem?: number | null;
    tipo: string;
    motivo: string;
    quantidade: number;
    preco_unitario_praticado?: number | null;
    valor_total?: number | null;
    observacao: string;
    data_movimentacao: Date;
    produto?: {
        id_produto: number;
        codigo?: string;
        nome?: string;
    } | null;
}
