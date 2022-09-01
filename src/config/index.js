require('dotenv').config()

const { env } = process

module.exports = {
    XUMM_API_KEY: env.XUMM_API_KEY,
    XUMM_API_SECRET: env.XUMM_API_SECRET,
    APP_NAME: env.APP_NAME,
}
