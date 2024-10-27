import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  const cookie = req.cookies["user"];

  if (!cookie) {
    res.status(401).json({ message: "Devi prima effettuare l'accesso" });
    return;
  }

  const verified = jwt.verify(cookie, process.env.JWT_SECRET!) as JwtPayload;

  if (!verified) {
    res.status(401).json({ message: "Devi prima effettuare l'accesso" });
    return;
  }

  res.locals.verified = verified;

  next();
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ message: "Non autorizzato" });
    return;
  }
  if (token !== process.env.ADMIN_SECRET) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
}
