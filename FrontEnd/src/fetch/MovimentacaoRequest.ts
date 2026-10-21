import type { MovimentacaoDTO } from '../dto';
import { appConfig } from '../appConfig';

type MovimentacaoInput = Omit<MovimentacaoDTO, 'id_movimentacao' | 'produto'>;

class MovimentacaoRequests {
	private readonly serverURL = appConfig.render_url;
	private readonly endpoint = '/api/movimentacoes';

	private headers() {
		return {
			'Content-Type': 'application/json',
			'x-access-token': localStorage.getItem('token') ?? '',
		};
	}

	async listar(): Promise<MovimentacaoDTO[]> {
		const response = await fetch(`${this.serverURL}${this.endpoint}`, { headers: this.headers() });
		if (response.status === 204) return [];
		if (!response.ok) throw new Error('Não foi possível listar as movimentações.');
		return response.json() as Promise<MovimentacaoDTO[]>;
	}

	async obter(id: number): Promise<MovimentacaoDTO> {
		const response = await fetch(`${this.serverURL}${this.endpoint}/${id}`, { headers: this.headers() });
		if (!response.ok) throw new Error('Não foi possível buscar a movimentação.');
		return response.json() as Promise<MovimentacaoDTO>;
	}

	async cadastrar(movimentacao: MovimentacaoInput): Promise<boolean> {
		const response = await fetch(`${this.serverURL}${this.endpoint}`, {
			method: 'POST',
			headers: this.headers(),
			body: JSON.stringify(movimentacao),
		});
		if (!response.ok) throw new Error('Não foi possível cadastrar a movimentação.');
		return true;
	}
}

export default new MovimentacaoRequests();
