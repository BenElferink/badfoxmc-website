const formatIpfsImageUrl = (ipfsUri: string) => {
  return ipfsUri.replace('ipfs://', 'https://image-optimizer.jpgstoreapis.com/')

  // return ipfsUri.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/')
  // return ipfsUri.replace('ipfs://', 'https://images.cnft.tools/ipfs/')
  // return ipfsUri.replace('ipfs://', 'https://ipfs.jpgstoreapis.com/')
  // return ipfsUri.replace('ipfs://', 'https://alwaysinvert.mypinata.cloud/ipfs/')
}

export default formatIpfsImageUrl
