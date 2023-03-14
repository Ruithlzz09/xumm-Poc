require('dotenv').config()

const { env } = process
const isTestNet = env.IS_TESTNET === 'true'

module.exports = {
    XUMM_API_KEY: env.XUMM_API_KEY,
    XUMM_API_SECRET: env.XUMM_API_SECRET,
    APP_NAME: env.APP_NAME,
    XRPL_SERVER_URL: isTestNet ? env.XRPL_NFT_DEVNET : env.XRPL_MAINNET,
    isTestNet,
    NOTIFICATION:env.PUSH_NOTIFICATION === 'true',
    EXTERNAL_ADDRESS:env.EXTERNAL_ADDRESS,
    TOKEN_OFFER:env.TOKEN_OFFER,
    BUYER_ADDRESS:env.BUYER_ADDRESS,
    tokenID :env.tokenID
}
