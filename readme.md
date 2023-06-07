# XUMM-PoC

Refer the sample.env for env sample and update key values and rename sample.env to .env

There are three ways to integrate  with our platform/app and easily interact with end users for sign in & transaction signing (basically the MetaMask experience, except not based on a browser plugin but on a mobile app).

1. Backend integration: you call our API (with our SDK or directly on our API), generate a sign in or sign request, get a paylaod ID, redirect URL (which is also the content for the QR code) and websocket URL for live status updates. Your backend communicates this to your frontend.
2. Frontend-only integration through OAuth2 (PKCE) & JWT in return, then to be used @ frontend with our Javsacript/Typescript SDK or directly to our API
3. Embedded (‘dApp like’) as a webapp inside Xumm, we call this ‘xApps’. JWT and API calls are easy, through our Javsacript/Typescript SDK in your xApp frontend.
   
In this Repo, We are covering approach1
If you want to identify a user based on a signed transaction (without asking the user for a payment) you can send a payload with a false TransactionType ie Sign In User.We are connecting our network on devnet network

Learning Material
 1. [XUMM SDK](https://dev.to/wietse/xumm-sdk-1-get-your-xumm-api-credentials-5c3i)
 2. [Xumm Integration](https://www.youtube.com/watch?v=skHP3nLNlEQ)
 3. [Payload](https://xumm.readme.io/docs/payload-workflow)
 4. [Payload-transaction](https://xumm.readme.io/docs/payload-transaction-data)
 5. [Register App for xumm credentials](https://xumm.readme.io/docs/register-your-app)
 6. [To Create new funded account](https://xrpl.org/xrp-testnet-faucet.html)
 7. [Different Networks](https://xrpl.org/parallel-networks.html)
 8. [Reserves](https://xrpl.org/reserves.html#reserves)
 9. [QR codes](https://xumm.readme.io/docs/payload-response-resources)
 10. [Accept Offer](https://xrpl.org/nftokenacceptoffer.html#nftokenacceptoffer)
 11. [Transaction Errors](https://xrpl.org/transaction-results.html)
   
Extra resources
1. [Frontend Integration](https://oauth2-pkce-demo.xumm.dev/)
2. [Sign In User](https://xumm.readme.io/docs/user-sign-in)
3. [Push Notification](https://xumm.readme.io/docs/pushing-sign-requests)
4. [Observe payload status](https://xumm.readme.io/docs/payload-status)
5. [Payment](https://xrpl.org/payment.html#payment)
   
Must know things
1. [Signing payload from specific address and towards a specific network](https://xumm.readme.io/discuss/62d91b5f2dc143006b3ee8cb)
2. [How do we detect if the account was signed through a test/dev/main net?](https://xumm.readme.io/discuss/62a3229d84de520013cdc948)
(https://xumm.readme.io/discuss/62a185c8a51f14003091f913)

# As per Discussion with Xumm Developers and at public Discord
There is no USDC on the XRPL.There is USD issued by Gatehub and by Bitstamp, but that's not USDC.There is no public Faucet in devnet for usd
In that case the parties to talk to are Gatehub and Bitstamp, and ask them to issue on testnet and provide a faucet there.
