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
  const {address='',offerId='',pushEnabled=false,userToken=''} = payload
  return {
      'txjson': {
      'TransactionType': 'NFTokenAcceptOffer',
      'Account':address,
      'NFTokenSellOffer':offerId
    },
    ...(pushEnabled && userToken)
  }
}

const createSellOffer = (payload)=>{
  const {address='',pushEnabled=false,userToken='',buyerAddress='',tokenID:NFTokenID} = payload
  return {
      txjson: {
      TransactionType: "NFTokenCreateOffer",
      Account:address,
      Destination:buyerAddress,
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