import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

// Import the secret key from the environment
const secret = process.env.JWT_SECRET || "default-secret";
const secretKey = new TextEncoder().encode(secret);
const issuer = process.env.JWT_ISSUER || "default-issuer";
const audience = process.env.JWT_AUDIENCE || "default-audience";
const expirationTime = process.env.JWT_EXPIRATION_TIME || "1h";

export enum TokenType {
  User = "user",
  Mechanic = "mechanic",
  Admin = "admin",
  StoreOwner = "store_owner",
}

const generateToken = (user: {
  id: string;
  email: string;
  name: string;
  type: TokenType;
}) => {
  const jwt = new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    type: user.type,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expirationTime)
    .sign(secretKey);

  return jwt;
};

const verifyToken = async (token: string) => {
  token = token.replace("Bearer ", "");

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer,
      audience,
    });

    return payload;
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };
