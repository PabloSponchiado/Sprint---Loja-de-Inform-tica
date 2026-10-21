import type { LoginResponse } from '../dto';
import { appConfig } from '../appConfig';

class AuthRequests {
	private readonly serverURL = appConfig.render_url;

	async login(email: string, senha: string): Promise<LoginResponse> {
		const response = await fetch(`${this.serverURL}/api/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, senha }),
		});

		const data = await response.json().catch(() => ({}));
		if (!response.ok) {
			throw new Error(data.message ?? `Erro ${response.status}: ${response.statusText}`);
		}

		return data as LoginResponse;
	}
}

export default new AuthRequests();
