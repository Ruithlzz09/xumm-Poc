const { XummSdk } = require('xumm-sdk')
const readline = require('readline');
const { XUMM_API_KEY, XUMM_API_SECRET,isTestNet, NOTIFICATION,XRPL_SERVER_URL } = require('./config')
const { initXrplService,explorerUrlForTxn } = require('./utils')
const request = require('./utils/payloads')
const {searchTransaction} = require('./utils/transaction')

const validateInputs = (offerId,address)=>{
    if (offerId==='' || offerId===undefined){
        throw new Error(`Offer id does not exist: ${offerId} in request call`)
    }
    if (address==='' || address===undefined){
        throw new Error(`Address does not exist: ${address} in request call`)
    }
}

const signIn = async() =>{
    const info = {}
    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)
    const appInfo = await Sdk.ping()
    console.log(`App Name: ${appInfo.application.name}`)
    const subscription = await Sdk.payload.createAndSubscribe(request.signIn, event =>{
        // console.log('New payload event:', event.data)
        // The event data contains a property 'signed' (true or false), return
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }
    })

    const payload = subscription.created // contains the created payload data
    const {next={},pushed} = payload
    // console.log(`QR Code link: ${refs.qr_png}`)
    console.log(`Xumm App link for sign: ${next?.always}`)
    console.log('Pushed Notification send:', pushed ? 'yes' : 'no')
    // await download_image(refs.qr_png)
    const resolveData = await subscription.resolved
    if (resolveData.signed === false) {
        console.log('The request is rejected')
        throw new Error('sign in request is failed')
    }
    if (resolveData.signed === true) {
        info.status='successful'
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
    // console.log(info.node,info.node_uri,'\n\n')
    return info
}


async function getOffers(client,tokenId) {
    let nftSellOffers = {}
    try {
        nftSellOffers = await client.request({
            method: 'nft_sell_offers',
            nft_id: tokenId,
        })
    } catch (err) {
        console.log('info', '[getOffers]', `No sell offers for tokenId ${tokenId}`)
    }
    return nftSellOffers
}
const fetchOffers = async (client,tokenId,beautify=false) => {
    let nftSellOffers = await getOffers(client,tokenId)
    delete nftSellOffers.id
    delete nftSellOffers.type
    if (beautify){
        nftSellOffers =
        nftSellOffers?.result?.offers.map((x) => ({
            Seller: x.owner,
            Buyer: x.destination,
            tokenOfferIndex: x.nft_offer_index
        })) ?? []
    }else{
        nftSellOffers =
        nftSellOffers?.result?.offers.map((x) => ({
            owner: x.owner,
            offerId: x.nft_offer_index,
            destination: x.destination,
        })) ?? []
    }
    return { nftSellOffers, tokenId }
}
const importNFT = async(client,info)=>{
    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)
    // Sdk ping contains info like application name, webhookurl
    // quota -rateLimit
    // if userToken stored for given xumm app & is valid
    // then push notification can be send else normal flow works
    const userToken = {'user_token':info.user_token}
    // indicates whether to send push notification or not
    const pushEnabled = true
    const {seller,buyer,tokenID} = info
    // eslint-disable-next-line consistent-return
    const subscription = await Sdk.payload.createAndSubscribe(request.createSellOffer({seller,pushEnabled,userToken,buyer,tokenID}), event =>{
        // console.log('New payload event:', event.data)
        // The event data contains a property 'signed' (true or false), return
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }
    })

    const payload = subscription.created // contains the created payload data
    const {next={},pushed} = payload
    // console.log(`QR Code link: ${refs.qr_png}`)
    console.log(`Xumm App link for sign: ${next?.always}`)
    console.log('Pushed Notification send:', pushed ? 'yes' : 'no')
    // await download_image(refs.qr_png)
    // console.log('downloaded images to scan')
    const resolveData = await subscription.resolved
    if (resolveData.signed === false) {
        throw new Error('The request is rejected')
    }
    if (resolveData.signed === true) {
        // console.log('The request is signed')
        const {txid} = resolveData
        const resp = await searchTransaction(client,txid)
        resp.transactionHash = txid
        resp.explorerUrl = explorerUrlForTxn(txid,isTestNet)
        // console.log('Transaction Detail')
        console.log(`Explorer Link for import NFT i.e token sell offer created: ${resp.explorerUrl}`)
        // console.log(await searchTransaction(txid))
        console.log(await fetchOffers(client,tokenID,true))
    }
    /**
     * Let's fetch the full payload end result, and get the issued
     * user token, we can use to send our next payload per Push notification
     */
    const result = await Sdk.payload.get(resolveData.payload_uuidv4)
    // User token is mentioned here
    // console.log('User token:', result.application.issued_user_token)
    // console.log(result.response)
    if( XRPL_SERVER_URL !== result.response.environment_nodeuri){
        console.log('User has submitted request to incorrect node')
    }

}



const exportNFT = async(client,info)=>{
    const Sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET)
    // Sdk ping contains info like application name, webhookurl
    // quota -rateLimit
    // if userToken stored for given xumm app & is valid
    // then push notification can be send else normal flow works
    const userToken = {'user_token':info.user_token}
    // indicates whether to send push notification or not
    const pushEnabled = true
    const {offerId,buyer} = info
    validateInputs(offerId,buyer)
    // eslint-disable-next-line consistent-return
    const subscription = await Sdk.payload.createAndSubscribe(request.acceptSellOffer({buyer,offerId,pushEnabled,userToken}), event =>{
        // console.log('New payload event:', event.data)

        // The event data contains a property 'signed' (true or false), return
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }
    })

    const payload = subscription.created // contains the created payload data
    const {next={},pushed} = payload
    // console.log(`QR Code link: ${refs.qr_png}`)
    console.log(`Xumm App link for sign: ${next?.always}`)
    console.log('Pushed Notification send:', pushed ? 'yes' : 'no')
    // await download_image(refs.qr_png)
    // console.log('downloaded images to scan')
    const resolveData = await subscription.resolved
    if (resolveData.signed === false) {
        throw new Error('The request is rejected')
    }
    if (resolveData.signed === true) {
        // console.log('The request is signed')
        const {txid} = resolveData
        const resp = await searchTransaction(client,txid)
        resp.transactionHash = txid
        resp.explorerUrl = explorerUrlForTxn(txid,isTestNet)
        console.log('Transaction Hash for Export',txid)
        console.log(`Explorer Link for export NFT i.e token accept offer: ${resp.explorerUrl}`)
    }
    /**
     * Let's fetch the full payload end result, and get the issued
     * user token, we can use to send our next payload per Push notification
     */
    const result = await Sdk.payload.get(resolveData.payload_uuidv4)
    // User token is mentioned here
    // console.log('User token:', result.application.issued_user_token)
    // console.log(result.response)
    if( XRPL_SERVER_URL !== result.response.environment_nodeuri){
        console.log('User has submitted request to incorrect node')
    }

}

function askQuestion(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question(message, (answer) => {
      rl.close();
      if (answer.trim() === '') {
        reject(new Error('Input cannot be empty'));
      } else {
        resolve(answer);
      }
    });
  });
}

initXrplService().then(async client=>{
    const info={}
    try {
        const choice = await askQuestion('Choose 1 for import and 2 for export and 3 for exit: ').then(resp=>parseInt(resp,10))
        if (choice===1){
            info.buyer = await askQuestion('Please Enter Buyer Address: ')
            info.seller = await askQuestion('Please Enter Seller Address: ')
            info.tokenID = await askQuestion('Please Enter NFT TokenID: ')
            await importNFT(client,info).catch(err=>console.log(err.message))
        } else if (choice === 2){
            info.buyer = await askQuestion('Please Enter Buyer Address: ')
            info.offerId = await askQuestion('Please Enter Offer ID: ')
            await exportNFT(client,info).catch(err=>console.log(err.message))
        } else{
            console.log('Invalid option')
        }
    } catch (error) {
        console.log(error.message)
    }finally{
        console.log('closing application now')
        process.exit(0)
    }
})


