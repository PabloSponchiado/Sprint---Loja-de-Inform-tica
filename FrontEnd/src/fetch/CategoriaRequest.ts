import type { CategoriaDTO } from '../dto';
import { appConfig } from '../appConfig';

type CategoriaInput = Omit<CategoriaDTO, 'id_categoria'>;

class CategoriaRequests {
	private readonly serverURL = appConfig.render_url;
	private readonly endpoint = '/api/categorias';

	private headers() {
		return {
			'Content-Type': 'application/json',
			'x-access-token': localStorage.getItem('token') ?? '',
		};
	}

	async listar(): Promise<CategoriaDTO[]> {
		const response = await fetch(`${this.serverURL}${this.endpoint}`, { headers: this.headers() });
		if (response.status === 204) return [];
		if (!response.ok) throw new Error('Não foi possível listar as categorias.');
		return response.json() as Promise<CategoriaDTO[]>;
	}

	async obter(id: number): Promise<CategoriaDTO> {
		const response = await fetch(`${this.serverURL}${this.endpoint}/${id}`, { headers: this.headers() });
		if (!response.ok) throw new Error('Não foi possível buscar a categoria.');
		return response.json() as Promise<CategoriaDTO>;
	}

	async cadastrar(categoria: CategoriaInput): Promise<boolean> {
		return this.enviar('POST', categoria);
	}

	async atualizar(id: number, categoria: CategoriaInput): Promise<boolean> {
		return this.enviar('PUT', categoria, id);
	}

	async remover(id: number): Promise<boolean> {
		const response = await fetch(`${this.serverURL}${this.endpoint}/${id}`, {
			method: 'DELETE',
			headers: this.headers(),
		});
		if (!response.ok) throw new Error('Não foi possível remover a categoria.');
		return true;
	}

	private async enviar(method: 'POST' | 'PUT', body: CategoriaInput, id?: number): Promise<boolean> {
		const response = await fetch(`${this.serverURL}${this.endpoint}${id === undefined ? '' : `/${id}`}`, {
			method,
			headers: this.headers(),
			body: JSON.stringify(body),
		});
		if (!response.ok) throw new Error(`Não foi possível ${method === 'POST' ? 'cadastrar' : 'atualizar'} a categoria.`);
		return true;
	}
}

export default new CategoriaRequests();
