const xrpl = require('xrpl')

const signIn ={
  'txjson': {
    'TransactionType': 'SignIn'
  },
  options:{
    submit:false
  }
}

// If no destination address and amount provided then use default
const payment = (payload)=>{
  const {address='rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ',amount='10000',pushEnabled=false,userToken=''} = payload
  return{
  'txjson': {
      'TransactionType': 'Payment',
      'Destination': address,
      'Amount':amount
    },
    ...(pushEnabled && userToken)
  }
}

const acceptSellOffer = (payload)=>{
  const {buyer='',offerId='',pushEnabled=false,userToken=''} = payload
  if (!xrpl.isValidAddress(buyer)){
    throw new Error('Please Check buyer address is invalid')
  }
  return {
      'txjson': {
      'TransactionType': 'NFTokenAcceptOffer',
      'Account':buyer,
      'NFTokenSellOffer':offerId
    },
    ...(pushEnabled && userToken)
  }
}

const createSellOffer = (payload)=>{
  const {seller='',pushEnabled=false,userToken='',buyer='',tokenID:NFTokenID} = payload
  if (!xrpl.isValidAddress(seller) || !xrpl.isValidAddress(buyer)){
    throw new Error('Please Check either seller or buyer address is invalid')
  }
  return {
      txjson: {
      TransactionType: "NFTokenCreateOffer",
      Account:seller,
      Destination:buyer,
      NFTokenID,
      Flags:1,
      Amount:'0'
    },
    ...(pushEnabled && userToken)
  }
}

module.exports ={
    signIn,
    payment,
    acceptSellOffer,
    createSellOffer
}