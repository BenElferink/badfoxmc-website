import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'

const TOKEN_IMAGE_SRC = '/media/tokens/nftc/token.png'
const TOKEN_POLICY_ID = 'b0af30edf2c7f11465853821137e0a6ebc395cab71ee39c24127ffb4'
const TOKEN_NAME = 'NFTC'
const PROJECT_NAME = 'NFT Creative'
const WHO_CAN_EARN: WhoCanEarn = ['Bad Fox', 'Bad Motorcycle', 'Bad Key']

const Page = () => {
  return (
    <div className='max-w-[800px] mx-auto px-4 flex flex-col items-center'>
      <TokenHeader
        projectName={PROJECT_NAME}
        tokenName={TOKEN_NAME}
        tokenSrc={TOKEN_IMAGE_SRC}
        policyId={TOKEN_POLICY_ID}
      />
      <TokenWhoEarns whoCanEarn={WHO_CAN_EARN} />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>Prerequisites</h4>

        <div className='flex items-center justify-center'>
          <div className='mx-2'>- none -</div>
        </div>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet with{' '}
            <Link href='https://dripdropz.io/' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              Drip Dropz
            </Link>
            .
          </li>
          <li className='text-sm'>Claim &quot;NFTC&quot; from the available tokens.</li>
          <li className='text-sm'>Repeat every epoch (5 days).</li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm text-center'>
            50 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every epoch (5 days).
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
