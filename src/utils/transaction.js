const searchTransaction = async (client, txId) => {
    const { result } = await client.request({
        command: 'tx',
        transaction: txId,
    })
    return result
}

module.exports = {
    searchTransaction
}