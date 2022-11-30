import { useEffect, useMemo, useRef, useState } from 'react'
import useWallet from '../../../contexts/WalletContext'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../../../functions/formatters/formatIpfsImageUrl'
import AssetFilters from '../AssetFilters'
import AssetCard from '../AssetCard'

const INITIAL_DISPLAY_AMOUNT = 20

const WalletAssets = ({ policyId }) => {
  const { isMobile } = useScreenSize()
  const { populatedWallet } = useWallet()

  const [rendered, setRendered] = useState([])
  const [displayNum, setDisplayNum] = useState(INITIAL_DISPLAY_AMOUNT)
  const bottomRef = useRef(null)

  useEffect(() => {
    const handleScroll = (e) => {
      const { pageYOffset, innerHeight } = e.composedPath()[1]
      const isScrolledToBottom = bottomRef.current?.offsetTop <= pageYOffset + innerHeight

      if (isScrolledToBottom) {
        setDisplayNum((prev) => prev + INITIAL_DISPLAY_AMOUNT)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const traitsObj = useMemo(() => getFileForPolicyId(policyId, 'traits'), [policyId])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'flex-start',
      }}
    >
      <AssetFilters
        assetsArr={populatedWallet.assets[policyId]}
        traitsMatrix={Object.entries(traitsObj).sort((a, b) => a[0].localeCompare(b[0]))}
        callbackRendered={(arr) => setRendered(arr)}
      />

      <section className='flex-col' style={{ width: isMobile ? '100vw' : 'calc(100vw - 300px)' }}>
        <div style={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'center' }}>
          {!rendered.length ? (
            <div style={{ fontSize: '3rem' }}>None exist...</div>
          ) : (
            rendered.map((asset, idx) =>
              idx < displayNum ? (
                <AssetCard
                  key={`collection-asset-${asset.assetId}-${idx}`}
                  mainTitles={[asset.displayName]}
                  subTitles={[`Rank: ${asset.rarityRank}`]}
                  imageSrc={formatIpfsImageUrl(asset.image.ipfs, !!asset.rarityRank)}
                  itemUrl={`https://jpg.store/asset/${asset.assetId}`}
                  tableRows={Object.entries(asset.attributes)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([cat, attr]) => [
                      `${cat}:`,
                      attr,
                      traitsObj[cat]?.find((trait) => trait.onChainName === attr)?.percent,
                    ])}
                />
              ) : null
            )
          )}
        </div>

        <div ref={bottomRef} />
      </section>
    </div>
  )
}

export default WalletAssets
