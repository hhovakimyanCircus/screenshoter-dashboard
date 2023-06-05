import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: `${process.env.AUTH0_BASE_URL}/login`,
    });
  },
});
