import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import config from './config'
import { signup, signin, protect } from './utils/auth'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import insuranceRouter from './resources/policy/insurance.router'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signup)
app.post('/signin', signin)

app.use('/api', protect)
app.use('/api/user', userRouter)
app.use('/api/policy', insuranceRouter)


export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`Insurance Server on http://localhost:${config.port}/api`)
    })
  } catch (err) {
    console.error(err)
  }
}