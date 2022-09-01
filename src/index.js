const { XummSdk } = require('xumm-sdk')
const { XUMM_API_KEY, XUMM_API_SECRET } = require('./config')

const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)

const main = async () => {
    console.log(`Hi! This is where we'll be writing some code`)
    // Sdk ping contains info like application name, webhookurl
    // quota -rateLimit
    const appInfo = await Sdk.ping()
    console.log(`Ping App: ${appInfo.application.name}`)
}

main()
