export const appConfig = {
  render_url: (
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? 'https://sprint-loja-de-inform-tica.onrender.com'
      : 'http://localhost:1285')
  ).replace(/\/$/, ''),
};
