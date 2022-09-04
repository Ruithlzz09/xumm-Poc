const { XummSdk } = require('xumm-sdk')
const { XUMM_API_KEY, XUMM_API_SECRET } = require('./config')

const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)

const main = async () => {
    // Sdk ping contains info like application name, webhookurl
    // quota -rateLimit
    const appInfo = await Sdk.ping()
    console.log(`App Name: ${appInfo.application.name}`)
    // if userToken stored for given xumm app & is valid
    // then push notification can be send else normal flow works
    const userToken = {'user_token':'6edbc693-8c01-422d-a0c3-11ff8196e868'}
    // indicates whether to send push notification or not
    const pushEnabled =true
    const request = {
        'txjson': {
            "TransactionType": "Payment",
            "Destination": "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
            "Amount": "10000"
        },
        ...(pushEnabled && userToken)
}

    // eslint-disable-next-line consistent-return
    const subscription = await Sdk.payload.createAndSubscribe(request, event =>{
        console.log('New payload event:', event.data)

        // The event data contains a property 'signed' (true or false), return
        if (Object.keys(event.data).indexOf('signed') > -1) {
        return event.data
        }
    })

    const payload = subscription.created // contains the created payload data
    const {refs={},next={},pushed} = payload
    console.log(`QR Code link: ${refs.qr_png}`)
    console.log(`Xumm App link for sign: ${next?.always}`)
    console.log('Pushed Notification send:', pushed ? 'yes' : 'no')

    const resolveData = await subscription.resolved
    if (resolveData.signed === false) {
        console.log('The request is rejected')
    }
    if (resolveData.signed === true) {
        console.log('The request is signed')
        const {txid} = resolveData
        const info = await Sdk.getTransaction(txid)
        console.log(info)
    }
    /**
     * Let's fetch the full payload end result, and get the issued
     * user token, we can use to send our next payload per Push notification
     */
    const result = await Sdk.payload.get(resolveData.payload_uuidv4)
    // User token is mentioned here
    console.log('User token:', result.application.issued_user_token)
}

main()
