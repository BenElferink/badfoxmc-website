import { useEffect, useRef, useState } from 'react'
import { useMarket } from '../../../contexts/MarketContext'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import AssetFilters from '../AssetFilters'
import AssetCard from '../AssetCard'
import Loader from '../../Loader'
import { ADA_SYMBOL } from '../../../constants/ada'
import formatIpfsImageUrl from '../../../functions/formatters/formatIpfsImageUrl'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
import foxAssetsFile from '../../../data/assets/bad-fox.json'
import foxTraitsFile from '../../../data/traits/bad-fox.json'

const INITIAL_DISPLAY_AMOUNT = 20

const CollectionAssets = ({ policyId }) => {
  const { isMobile } = useScreenSize()
  const { allListed, fetchAndSetAllListed } = useMarket()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading && !allListed.length) {
      ;(async () => {
        setLoading(true)
        await fetchAndSetAllListed()
        setLoading(false)
      })()
    }
  }, [])

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'flex-start',
      }}
    >
      <AssetFilters
        assetsArr={policyId === BAD_FOX_POLICY_ID ? foxAssetsFile.assets : []}
        traitsMatrix={Object.entries(policyId === BAD_FOX_POLICY_ID ? foxTraitsFile : {}).sort((a, b) =>
          a[0].localeCompare(b[0])
        )}
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
                  subTitles={[
                    `Rank: ${asset.rarityRank}`,
                    asset.price ? `Listed: ${ADA_SYMBOL}${asset.price}` : 'Not listed',
                  ]}
                  imageSrc={formatIpfsImageUrl(asset.image.ipfs, !!asset.rarityRank)}
                  itemUrl={`https://jpg.store/asset/${asset.assetId}`}
                  tableRows={Object.entries(asset.attributes)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([cat, attr]) => [
                      `${cat}:`,
                      attr,
                      foxTraitsFile[cat].find((trait) => trait.onChainName === attr)?.percent,
                    ])}
                />
              ) : null
            )
          )}

          {loading ? <Loader /> : null}
        </div>

        <div ref={bottomRef} />
      </section>
    </div>
  )
}

export default CollectionAssets
