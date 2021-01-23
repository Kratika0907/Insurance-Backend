require('dotenv').config()
export const config = {
    secrets: {
      jwt: 'bcginsurancecasestudy',
      jwtExp: '100d'
    },
    dbUrl: `mongodb+srv://kratika:${process.env.DB_PASSWORD}@cluster0.x6gvf.mongodb.net/Insurance?retryWrites=true&w=majority`
  }
