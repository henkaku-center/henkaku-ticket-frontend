import { BigNumber, ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils.js'
import fromExponential from 'from-exponential'
import { useMemo, useState } from 'react'
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  useContractEvent,
  usePrepareContractWrite
} from 'wagmi'

const APPROVE_CALLBACK_STATUS = {
  PENDING: 1,
  FAIL: 2,
  FINISH: 3
}

const useApprove = (erc20: string, spender: string) => {
  const [status, setStatus] = useState<number>()
  const { config } = usePrepareContractWrite({
    address: erc20,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender as `0x${string}`, parseEther('10000')],
    overrides: {
      gasLimit: BigNumber.from(450000)
    }
  })

  const { write: contractApprove } = useContractWrite({
    ...config,
    onError(error) {
      console.log('approve ERROR:', error)
      setStatus(APPROVE_CALLBACK_STATUS.FAIL)
    },
    onSuccess(data) {
      console.log('approve SUCCESS:', data)
      setStatus(APPROVE_CALLBACK_STATUS.PENDING)
    }
  })

  return {
    status: status,
    approve: () => contractApprove?.()
  }
}

const useApproval = (
  erc20: string,
  spenderAddress: string,
  address: string | undefined,
  comparedValue?: number
) => {
  const { data } = useContractRead({
    address: erc20,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      (address as `0x${string}`) || ethers.constants.AddressZero,
      spenderAddress as `0x${string}`
    ],
    watch: true
  })

  const allowanceValue = useMemo(() => {
    return Number(
      ethers.utils.formatEther(fromExponential(data?.toString() || 0))
    )
  }, [data])

  const approved = useMemo(() => {
    if (allowanceValue < (comparedValue || 1)) {
      return false
    }
    return true
  }, [allowanceValue, comparedValue])

  return {
    approved,
    allowanceValue
  }
}

export { useApproval, useApprove, APPROVE_CALLBACK_STATUS }
