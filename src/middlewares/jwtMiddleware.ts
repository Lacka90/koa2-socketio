import * as jwt from 'jsonwebtoken';
import { config } from '../config';

function jwtVerify(token, secret): Promise<any> {
  return new Promise((resolve, reject) => jwt.verify(
    token,
    secret,
    (err, decoded) => err ? reject(err) : resolve(decoded)
  ));
}

export function jwtMiddleware({
  secret,
}) {
  return async function innerTokenMw(ctx, next) {
    const token = ctx.request.header['authorization'];
    if (!token || token.indexOf('Bearer ') !== 0) {
      return next();
    }

    const hcTokenString = token.split(' ')[1];

    try {
      const decoded = await jwtVerify(hcTokenString, secret);
      ctx.userId = decoded.userId;
      ctx.hcToken = decoded;

      return next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return ctx.throw('TokenExpriedError', 498);
      }
      return next(err);
    }
  };
}

function _jwtSign(data: any, expires: string) {
  return new Promise<string>((resolve, reject) => jwt.sign(
      data,
      config.token.secret,
      { expiresIn: expires, algorithm: config.token.algorithm },
      (err, result) => err ? reject(err) : resolve(result),
    ));
}

export function jwtSign(data: any) {
  return _jwtSign(data, config.token.expires);
}
