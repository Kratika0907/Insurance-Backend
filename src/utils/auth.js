import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.boom.badRequest('need email and password')
  }

  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (err) {
    return res.boom.serverUnavailable('Sorry we cannot process')
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.boom.badRequest('need email and password')
  }
  try {
    const user = await User.findOne({ email: req.body.email })
      .select('email password')
      .exec()

    if (!user) {
      return res.boom.unauthorized('Invalid email and passoword combination')
    }

    const match = await user.checkPassword(req.body.password)

    if (!match) {
        return res.boom.unauthorized('Invalid email and passoword combination')
    }
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (err) {
    console.error(err)
    return res.boom.serverUnavailable('Sorry we cannot process')
  }
}
export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end()
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.boom.unauthorized()
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    return res.boom.unauthorized()
  }
  req.user = user
  next()
}