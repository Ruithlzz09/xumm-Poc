const { XummSdk } = require('xumm-sdk')
const { XUMM_API_KEY, XUMM_API_SECRET } = require('./config')

const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)

const main = async () => {
    console.log(`Hi! This is where we'll be writing some code`)
    // Sdk ping contains info like application name, webhookurl
    // quota -rateLimit
    const appInfo = await Sdk.ping()
    console.log(`Ping App: ${appInfo.application.name}`)
    const request = {
        TransactionType: 'Payment',
        Destination: 'rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ',
        Amount: '10000',
        Memos: [
            {
                Memo: {
                    MemoData: 'F09F988E20596F7520726F636B21',
                },
            },
        ],
    }

    const payload = await Sdk.payload.create(request, true)
    const {refs={},next={}} = payload
    console.log(`QR Code link: ${refs.qr_png}`)
    console.log(`Xumm App link for sign: ${next?.always}`)
}

main()
