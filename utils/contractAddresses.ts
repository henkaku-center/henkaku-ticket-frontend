import { chainId } from 'wagmi'

interface ContractAddresses {
  [name: string]: {
    [chainId: number]: string
  }
}

interface getContractAddressArg {
  name: keyof ContractAddresses
  chainId: number | undefined
}

const contractAddresses: ContractAddresses = {
  henkakuErc20: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS as `0x${string}`) ??
      '',
    [chainId.polygonMumbai]:
      (process.env.NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS as `0x${string}`) ??
      '',
    [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  ticket: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_TICKET_ADDRESS as `0x${string}`) ?? '',
    [chainId.polygonMumbai]:
      (process.env.NEXT_PUBLIC_CONTRACT_TICKET_ADDRESS as `0x${string}`) ?? '',
    [chainId.goerli]: '0x6beD9e854eC468373B70a00d864E660b9F224D32',
    [chainId.polygon]: '0xbE914D66aF1D6B7C46e1dfB641E4adCb6205cFc2'
  }
}

const defaultChainID = process.env.production ? chainId.polygon : chainId.goerli

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddresses[name][chainId || defaultChainID]
}

export {
  contractAddresses as contractAddresses,
  defaultChainID,
  getContractAddress
}
