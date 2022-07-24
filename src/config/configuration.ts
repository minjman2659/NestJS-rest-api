export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  API_HOST: process.env.API_HOST,
  CLIENT_HOST: process.env.CLIENT_HOST,
  SECRET_KEY: process.env.SECRET_KEY,
  POSTGRES: {
    DATABASE: process.env.POSTGRES_DATABASE,
    PORT: process.env.POSTGRES_PORT,
    HOST: process.env.POSTGRES_HOST,
    USER: process.env.POSTGRES_USER,
    PW: process.env.POSTGRES_PW,
  },
});
