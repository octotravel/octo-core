import { HttpUnauthorized } from './Error';

export class AuthCore {
  public getAuthToken(req: Request): string | null {
    const authorization = req.headers.get('Authorization') ?? '';
    const [auth, token] = authorization.split(' ');
    if (auth === 'Bearer') {
      const isLegacyToken = token.includes('_');
      if (isLegacyToken) {
        const [, legacyToken] = token.split('_');
        return legacyToken ?? null;
      }
      return token ?? null;
    }
    if (auth === 'Basic') {
      const [, decodedToken] = atob(token).split(':');
      return decodedToken ?? null;
    }
    return null;
  }

  public checkAuthToken = (req: Request): string => {
    const token = this.getAuthToken(req);
    if (token === null) {
      throw new HttpUnauthorized({ error: 'Unauthorized' });
    }
    return token;
  };
}
