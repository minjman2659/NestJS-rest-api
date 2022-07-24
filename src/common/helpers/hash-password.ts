import * as crypto from 'crypto';

export const hashPassword = (password: string) => {
  return crypto
    .createHmac('sha512', process.env.PASSWORD_SALT)
    .update(password)
    .digest('hex');
};
