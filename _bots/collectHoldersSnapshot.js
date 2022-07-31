require('dotenv').config()
const cron = require('node-cron')
const fs = require('fs')
const { exec } = require('child_process')
const assetsFile = require('../data/assets/fox')
const getWalletAddressOfAsset = require('../functions/blockfrost/getWalletAddressOfAsset')
const getStakeKeyFromWalletAddress = require('../functions/blockfrost/getStakeKeyFromWalletAddress')
const { BAD_FOX_WALLET, JPG_STORE_WALLET, CNFT_IO_WALLET, EPOCH_ART_WALLET } = require('../constants/addresses')

const ROYALTY_SHARE = 56000 // 1000000 * 0.07 * 0.8
const EXCLUDE_ADDRESSES = [BAD_FOX_WALLET, JPG_STORE_WALLET, CNFT_IO_WALLET, EPOCH_ART_WALLET]

const getFoxHolders = (timestamp) =>
  new Promise((resolve, reject) => {
    // manage git pull
    exec('git fetch && git pull --no-rebase', async (gitPullError, gitPullStdout, gitPullStderr) => {
      const assets = assetsFile.assets
      const stakeAddresses = {}
      let totalFoxCount = 0

      try {
        for (let idx = 0; idx < assets.length; idx++) {
          const {
            asset,
            onchain_metadata: { attributes },
          } = assets[idx]

          console.log('\nProcessing index:', idx)
          console.log('Asset:', asset)

          const { address } = await getWalletAddressOfAsset(asset)

          if (EXCLUDE_ADDRESSES.includes(address)) {
            console.log('This wallet address is excluded!')
          } else {
            const isCrypto = attributes.Mouth === '(F) Crypto'
            const isCashBag = attributes.Mouth === '(M) Cash Bag'

            let stakeKey = ''
            const existingStakeKeyArr = Object.entries(stakeAddresses).filter(([sKey, obj]) =>
              obj.addresses.includes(address)
            )

            if (existingStakeKeyArr.length) {
              stakeKey = existingStakeKeyArr[0][0]
            } else {
              stakeKey = await getStakeKeyFromWalletAddress(address)
            }

            if (stakeAddresses[stakeKey]) {
              const addressAlreadyExists = stakeAddresses[stakeKey].addresses.find((str) => str === address)

              if (!addressAlreadyExists) {
                stakeAddresses[stakeKey].addresses.push(address)
              }

              stakeAddresses[stakeKey].foxCount += 1
              stakeAddresses[stakeKey].cryptoCount += isCrypto ? 1 : 0
              stakeAddresses[stakeKey].cashBagCount += isCashBag ? 1 : 0
            } else {
              stakeAddresses[stakeKey] = {
                addresses: [address],
                foxCount: 1,
                cryptoCount: isCrypto ? 1 : 0,
                cashBagCount: isCashBag ? 1 : 0,
              }
            }

            totalFoxCount++
            console.log('Stake key:', stakeKey, stakeAddresses[stakeKey])
          }
        }

        const adaPerFox = ROYALTY_SHARE / totalFoxCount

        const wallets = Object.entries(stakeAddresses).map(([sKey, obj]) => {
          const adaForFoxes = obj.foxCount * adaPerFox
          const adaForTraits = obj.cryptoCount * 10 + obj.cashBagCount * 10

          return {
            satekKey: sKey,
            addresses: obj.addresses,
            counts: {
              foxCount: obj.foxCount,
              cryptoCount: obj.cryptoCount,
              cashBagCount: obj.cashBagCount,
            },
            payout: {
              adaForFoxes,
              adaForTraits,
              total: adaForFoxes + adaForTraits,
            },
          }
        })

        fs.writeFileSync(
          './data/snapshots/holders.json',
          JSON.stringify({
            _wen: timestamp,
            totalFoxCount,
            totalAdaPayout: wallets.reduce((prev, curr) => prev + curr.payout.total, 0),
            wallets,
          }),
          'utf8'
        )

        console.log('\nDone!')
      } catch (error) {
        console.error(error)
      }

      // manage git push
      exec(
        'git add ./data/snapshots/holders.json && git commit -m "🤖 BOT: updated holders snapshot" && git push',
        (gitPushError, gitPushStdout, gitPushStderr) => {
          resolve(true)
        }
      )
    })
  })

const runCronJob = async () => {
  console.log('Running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  try {
    await getFoxHolders(timestamp)
  } catch (error) {
    console.error(error)
  }

  console.log('Cron job finished')
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})