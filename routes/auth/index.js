import express from 'express'
import crypto from 'crypto'
import cookie from 'cookie'
import { getTokens, refreshTokenTokenAge, verifyRefreshTokenMiddleware } from './utils.js';
import { configDotenv } from "dotenv";

configDotenv();

const authRouter = express.Router();
authRouter.use(express.json())



authRouter.post("/login", (req, res) => {
    console.log('login req')
  const { login, password } = req.body;

  const hash = crypto
    .createHmac("sha256", process.env.PASSWORD_SECRET)
    .update(password)
    .digest("hex");
  const isVerifiedPassword = hash === process.env.PASSWORD_HASH;

  if (login !== process.env.LOGIN || !isVerifiedPassword) {
    return res.status(401).send("Login fail");
  }

  const { refreshToken } = getTokens(login);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", refreshToken, {
//      domain: process.env.DOMAIN,
      httpOnly: true,
      maxAge: refreshTokenTokenAge,
    })
  );
  res.send(JSON.stringify({allow: true, token: refreshToken}));
});

authRouter.get("/verify", verifyRefreshTokenMiddleware, (req, res) => {
    res.send(JSON.stringify({allow: true})).status(200)
})

authRouter.get("/profile", verifyRefreshTokenMiddleware, (req, res) => {
  res.send("admin");
});

authRouter.get("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", "", {
      httpOnly: true,
      maxAge: 0,
    })
  );
  res.sendStatus(200);
});

export default authRouter;