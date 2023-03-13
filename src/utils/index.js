const xrpl = require("xrpl");
const { XRPL_SERVER_URL } = require("../config");

let XRPL_CLIENT = null;
const logs= (info,methodName,message)=>{
    console.log(`${info}-${methodName}-${message}`)
}

const getXrplCredentials = () => ({ serverUrl: XRPL_SERVER_URL })

const getXrplClient = () => XRPL_CLIENT;

const disconnectXrpl = () => {
  XRPL_CLIENT != null
    ? XRPL_CLIENT.disconnect()
    : logs("info", "[disconnectXrpl]", "XRPL is already disconnected now");
  XRPL_CLIENT=null
};

const initXrplService = async()=> {
  const { serverUrl } = getXrplCredentials();
  try {
    XRPL_CLIENT = new xrpl.Client(serverUrl);
    await XRPL_CLIENT.connect();
    logs("info", "[initXrplService]", `Connected to xrpl service ${serverUrl}`);
  } catch (error) {
    logs(
      "error",
      "[initXrplService]",
      `Trying to connect at url : ${serverUrl} Error: ${error.stack || error}`
    );
    throw error;
  }
  return XRPL_CLIENT
}

const explorerUrlForTxn = (txid,IS_TESTNET) => {
    const url = IS_TESTNET? 'https://testnet.xrpl.org/transactions/':'https://livenet.xrpl.org/transactions/'
    return url + txid
}

module.exports = {
  getXrplClient,
  disconnectXrpl,
  initXrplService,
  explorerUrlForTxn
}
