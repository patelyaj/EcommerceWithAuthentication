import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });

  res.cookie('jwt', token, {
    maxAge: 60 * 60 * 1000, // 1 minute in MS
    httpOnly : true
  });
};

export default generateTokenAndSetCookie;