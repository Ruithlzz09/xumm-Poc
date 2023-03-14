const { XummSdk } = require('xumm-sdk')
const { XUMM_API_KEY, XUMM_API_SECRET,isTestNet, NOTIFICATION,EXTERNAL_ADDRESS,XRPL_SERVER_URL,BUYER_ADDRESS,tokenID } = require('./config')
const { initXrplService,explorerUrlForTxn } = require('./utils')
const { download_image } = require('./utils/download')
const request = require('./utils/payloads')
const {searchTransaction} = require('./utils/transaction')

const signIn = async() =>{
    const info = {}
    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)
    const appInfo = await Sdk.ping()
    console.log(`App Name: ${appInfo.application.name}`)
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
    await download_image(refs.qr_png)
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

const createSellTokenOffer = async(client,info)=>{
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
    const {address,buyerAddress} = info
    // eslint-disable-next-line consistent-return
    const subscription = await Sdk.payload.createAndSubscribe(request.createSellOffer({address,pushEnabled,userToken,buyerAddress,tokenID}), event =>{
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
    await download_image(refs.qr_png)
    console.log('downloaded images to scan')
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
    if( XRPL_SERVER_URL !== result.response.environment_nodeuri){
        console.log('User has submitted request to incorrect node')
    }

}


initXrplService().then(async client=>{
    let info={}
    if (NOTIFICATION){
        console.log('Sign In to get User token to enable push notification')
        info = await signIn()
    }
    console.log('Proceeding with Main Request')
    info.address = EXTERNAL_ADDRESS
    info.tokenID = tokenID
    info.buyerAddress = BUYER_ADDRESS
    createSellTokenOffer(client,info)
})

