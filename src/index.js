const { XummSdk } = require('xumm-sdk')
const { XUMM_API_KEY, XUMM_API_SECRET,isTestNet } = require('./config')
const { initXrplService,explorerUrlForTxn } = require('./utils')
const request = require('./utils/payloads')
const {searchTransaction} = require('./utils/transaction')

const signIn = async() =>{
    const info = {}
    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)
    const nftDevnetQR ='https://nnwqrfc.dlvr.cloud/XLS20-QR.png'
    const appInfo = await Sdk.ping()
    console.log(`App Name: ${appInfo.application.name}`)
    console.log('To Connect with Nft-devnet',nftDevnetQR)
    const subscription = await Sdk.payload.createAndSubscribe(request.signIn, event =>{
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
        const result = await Sdk.payload.get(resolveData.payload_uuidv4)
        // User token is mentioned here
        const {environment_nodeuri,environment_nodetype} = result.response
        info.user_token=result.application.issued_user_token || ''
        // Using node and node_uri we can confirm whether 
        // user is connect to nft-devnet or mainnet
        info.node= environment_nodetype|| ''
        info.node_uri=environment_nodeuri||''
    }
    info.signed= resolveData.signed
    console.log(info.node,info.node_uri,'\n\n')
    return info
}

const main = async (client,info) => {
    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)
    // Sdk ping contains info like application name, webhookurl
    // quota -rateLimit
    const appInfo = await Sdk.ping()
    console.log(`App Name: ${appInfo.application.name}`)
    // if userToken stored for given xumm app & is valid
    // then push notification can be send else normal flow works
    const userToken = {'user_token':info.user_token}
    const pushEnabled = true
    // indicates whether to send push notification or not
    // eslint-disable-next-line consistent-return
    const subscription = await Sdk.payload.createAndSubscribe(request.payment({pushEnabled,userToken}), event =>{
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
        const resp = await searchTransaction(client,txid)
        resp.transactionHash = txid
        resp.explorerUrl = explorerUrlForTxn(txid,isTestNet)
        console.log('Transaction Detail')
        console.log(resp)
    }
    /**
     * Let's fetch the full payload end result, and get the issued
     * user token, we can use to send our next payload per Push notification
     */
    const result = await Sdk.payload.get(resolveData.payload_uuidv4)
    // User token is mentioned here
    console.log('User token:', result.application.issued_user_token)
    console.log(result.response)
}

const validateInputs = (offerId,address)=>{
    if (offerId==='' || offerId===undefined){
        throw new Error(`Offer id does not exist: ${offerId} in request call`)
    }
    if (address==='' || address===undefined){
        throw new Error(`Address does not exist: ${address} in request call`)
    }
}

const acceptTokenOffer = async(client,info)=>{
    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)
    // Sdk ping contains info like application name, webhookurl
    // quota -rateLimit
    const appInfo = await Sdk.ping()
    console.log(`App Name: ${appInfo.application.name}`)
    // if userToken stored for given xumm app & is valid
    // then push notification can be send else normal flow works
    const userToken = {'user_token':info.user_token}
    // indicates whether to send push notification or not
    const pushEnabled = true
    const {offerId,address} = info
    validateInputs(offerId,address)
    // eslint-disable-next-line consistent-return
    const subscription = await Sdk.payload.createAndSubscribe(request.acceptSellOffer({address,offerId,pushEnabled,userToken}), event =>{
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
        const resp = await searchTransaction(client,txid)
        resp.transactionHash = txid
        resp.explorerUrl = explorerUrlForTxn(txid,isTestNet)
        console.log('Transaction Detail')
        console.log(resp)
    }
    /**
     * Let's fetch the full payload end result, and get the issued
     * user token, we can use to send our next payload per Push notification
     */
    const result = await Sdk.payload.get(resolveData.payload_uuidv4)
    // User token is mentioned here
    console.log('User token:', result.application.issued_user_token)
    console.log(result.response)

}


initXrplService().then(async client=>{
    if (isTestNet){
        const nftDevnetQR ='https://nnwqrfc.dlvr.cloud/XLS20-QR.png'
        console.log('To Connect with Nft-devnet',nftDevnetQR)
    }
    console.log('Sign In to get User token to enable push notification')
    const info = await signIn()
    console.log('Proceeding with payment')
    info.offerId = '24CF3BDAB405686C88E61DC13A31B2B253338D78DE37922A0A3F662F1DE2A552'
    info.address = 'r3nvis13AH3SHr7YA5KHLBZitDrMadYDo5'
    // main(client,info)
    acceptTokenOffer(client,info)
})

