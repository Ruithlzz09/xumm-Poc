require('dotenv').config()

const { env } = process
const isTestNet = env.IS_TESTNET === 'true'

module.exports = {
    XUMM_API_KEY: env.XUMM_API_KEY,
    XUMM_API_SECRET: env.XUMM_API_SECRET,
    APP_NAME: env.APP_NAME,
    XRPL_SERVER_URL: isTestNet ? env.XRPL_NFT_DEVNET : env.XRPL_MAINNET,
    isTestNet
}
