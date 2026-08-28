import type { ProdutoDTO } from '../dto';
import { appConfig } from '../appConfig';

type ProdutoInput = Omit<ProdutoDTO, 'id_produto' | 'categoria'>;

class ProdutoRequests {
	private readonly serverURL = appConfig.render_url;
	private readonly endpoint = '/api/produtos';

	private headers() {
		return {
			'Content-Type': 'application/json',
			'x-access-token': localStorage.getItem('token') ?? '',
		};
	}

	async listar(): Promise<ProdutoDTO[]> {
		const response = await fetch(`${this.serverURL}${this.endpoint}`, { headers: this.headers() });
		if (response.status === 204) return [];
		if (!response.ok) throw new Error('Não foi possível listar os produtos.');
		return response.json() as Promise<ProdutoDTO[]>;
	}

	async obter(id: number): Promise<ProdutoDTO> {
		const response = await fetch(`${this.serverURL}${this.endpoint}/${id}`, { headers: this.headers() });
		if (!response.ok) throw new Error('Não foi possível buscar o produto.');
		return response.json() as Promise<ProdutoDTO>;
	}

	async cadastrar(produto: ProdutoInput): Promise<boolean> {
		return this.enviar('POST', produto);
	}

	async atualizar(id: number, produto: ProdutoInput): Promise<boolean> {
		return this.enviar('PUT', produto, id);
	}

	async remover(id: number): Promise<boolean> {
		const response = await fetch(`${this.serverURL}${this.endpoint}/${id}`, {
			method: 'DELETE',
			headers: this.headers(),
		});
		if (!response.ok) throw new Error('Não foi possível remover o produto.');
		return true;
	}

	private async enviar(method: 'POST' | 'PUT', body: ProdutoInput, id?: number): Promise<boolean> {
		const response = await fetch(`${this.serverURL}${this.endpoint}${id === undefined ? '' : `/${id}`}`, {
			method,
			headers: this.headers(),
			body: JSON.stringify(body),
		});
		if (!response.ok) throw new Error(`Não foi possível ${method === 'POST' ? 'cadastrar' : 'atualizar'} o produto.`);
		return true;
	}
}

export default new ProdutoRequests();
