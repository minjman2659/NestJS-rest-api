import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPW = bcrypt.hashSync(password, salt);
  return hashedPW;
};

export const comparePassword = (
  originPW: string,
  hashedPW: string,
): boolean => {
  const isSame = bcrypt.compareSync(originPW, hashedPW);
  return isSame;
};
