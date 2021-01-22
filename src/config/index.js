const env = process.env.NODE_ENV || 'development'
const envConfig = require('./dev').config
const baseConfig = {
  env,
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  }
}

export default {
    ...baseConfig,
    ...envConfig
}