import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "";
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "";

// Setup Auth0 JWKS client
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
});

// Get signing key for JWT header.kid
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid!, function (err, key) {
    if (err) {
      callback(err, undefined);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

// Verifies a token using Auth0 public key
export async function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: AUTH0_AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      },
      (err: any, decoded: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decoded);
      }
    );
  });
}
