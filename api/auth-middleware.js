import dotenv from 'dotenv';
dotenv.config({ override: true });

export function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied (No token present)' });
  try {
    if (token === `Bearer ${process.env.TOKEN}`) {
      next();
    }
    else {
      res.status(401).json({ error: 'Access denied' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};