import {
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Box,
  useToast,
  Flex,
  Badge
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { NFTImage } from '@/components/NFTImage'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
import { TicketInfoProps } from '@/hooks/useTicketInfo'
import {
  useCurrentSupply,
  useIsHoldingByTokenId,
  useMintTicket
} from '@/hooks/useTicketContract'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'
import SecretMessage from '@/components/MintTicket/SecretMessage'
import UpdateSecretMessageCrypt from './UpdateSecretMessageCrypt'
import dayjs from 'dayjs'
import { useApproval, useChainId } from '@/hooks'
import { getContractAddress } from '@/utils/contractAddresses'
import { Approve } from '../Approve'
import { ethers } from 'ethers'
import ChatModal from './ChatModal'
import fromExponential from 'from-exponential'
import { checkSaleStatus } from '@/utils/checkSaleStatus'

interface Props {
  id: number
  item: TicketInfoProps
  maxSupply: number
  imageOnly?: boolean
}
interface mintStateProps {
  status: 'minted' | 'mintable' | 'noMintable' | 'soldout'
  freeMintable: boolean
}
const MintTicket: React.FC<Props> = ({ id, item, imageOnly, ...props }) => {
  const { t } = useTranslation('ticket')
  const toast = useToast()
  const {
    writeAsync,
    isLoading: isMinting,
    isSuccess,
    minted
  } = useMintTicket(id)
  const { isHolding } = useIsHoldingByTokenId(id)
  const { data: currentSupply, isLoading: isLoadingCurrentSupply } =
    useCurrentSupply(id)

  const [mintState, setMintState] = useState<mintStateProps>({
    status: 'mintable',
    freeMintable: false
  })

  const mint = async () => {
    if (!writeAsync) return
    try {
      await writeAsync({ recklesslySetUnpreparedArgs: [Number(id)] })
    } catch (error: any) {
      toast({
        id: 'MINT_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  useEffect(() => {
    if (props.maxSupply <= currentSupply?.toNumber()) {
      setMintState({ ...mintState, status: 'soldout' })
    }
  }, [currentSupply])

  useEffect(() => {
    if (minted) {
      setMintState({ ...mintState, status: 'minted', freeMintable: false })
    }
  }, [minted])

  const creatorName = useMemo(
    () =>
      item?.tokenURIJSON?.attributes?.length > 0
        ? item?.tokenURIJSON?.attributes.reduce((text, attribute) => {
            const currentText =
              attribute?.trait_type === 'CreatorName' ? attribute.value : ''
            return text + currentText
          }, '')
        : '',
    [item]
  )

  const saleStatus = useMemo(() => checkSaleStatus(item), [item])

  const blockTimeStamp = useMemo(() => {
    return {
      salesStatus: saleStatus,
      openText: dayjs((item.open_blockTimestamp as number) * 1000).format(
        'YYYY/MM/DD'
      ),
      closeText: dayjs((item.close_blockTimestamp as number) * 1000).format(
        'YYYY/MM/DD'
      )
    }
  }, [saleStatus, item.close_blockTimestamp, item.open_blockTimestamp])

  const { address } = useAccount()

  const ticketPrice = useMemo(() => {
    return Number(
      ethers.utils.formatEther(fromExponential(item.price.toString()))
    )
  }, [item])

  const { chainId } = useChainId()
  const henkakuV2 = getContractAddress({
    name: 'henkakuErc20',
    chainId: chainId
  }) as `0x${string}`
  const ticket = getContractAddress({
    name: 'ticket',
    chainId: chainId
  }) as `0x${string}`
  const { approved } = useApproval(henkakuV2, ticket, address, ticketPrice)

  return (
    <>
      <Box>
        <Heading mt={imageOnly ? 5 : 50} size="lg">
          {item?.tokenURIJSON?.name}
        </Heading>
      </Box>
      <Grid
        templateColumns={{
          lg: !imageOnly ? '450px 1fr' : '1fr'
        }}
        alignItems="center"
        gap={{ lg: 6 }}
      >
        <GridItem>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              <Badge ml={1} variant="outline" colorScheme="yellow">
                preview
              </Badge>
            </Text>
            <Text fontSize="sm" textAlign="right" mt={1}>
              <>
                {t('SALES_PERIOD')}：{blockTimeStamp.openText}〜
                {blockTimeStamp.closeText}
                {t('SALES_PERIOD_HELPER')}
              </>
            </Text>
          </Flex>
          {item && (
            <NFTImage imageUrl={parseIpfs2Pinata(item?.tokenURIJSON?.image)} />
          )}
          {creatorName && (
            <Text textAlign="right" fontSize="sm" mt={1}>
              {creatorName}
            </Text>
          )}
          <Text mt={5}>{item?.tokenURIJSON?.description}</Text>
        </GridItem>
        {!imageOnly && (
          <GridItem>
            <Box mb={{ lg: 10 }}>
              <>
                {(mintState.status === 'minted' || isHolding) && (
                  <Box>
                    <Text>{t('TITLE.MINTED')}</Text>
                  </Box>
                )}
                {blockTimeStamp.salesStatus !== 1 && !isHolding && (
                  <Box mt={{ base: 5 }}>
                    <Heading size="md">
                      {blockTimeStamp.salesStatus === 0 && (
                        <Text>{t('TITLE.BEFORE_SALE')}</Text>
                      )}
                      {blockTimeStamp.salesStatus === 2 && (
                        <Text>{t('TITLE.END_OF_SALE')}</Text>
                      )}
                    </Heading>
                  </Box>
                )}
                {mintState.status === 'noMintable' && (
                  <Text>{t('TITLE.NOT_MINTABLE')}</Text>
                )}
                {mintState.status === 'soldout' && (
                  <Text>{t('TITLE.SOLD_OUT')}</Text>
                )}
                {blockTimeStamp.salesStatus === 1 &&
                  mintState.status === 'mintable' &&
                  !approved && (
                    <Box>
                      <Text textAlign="right" fontSize="lg" mt={1}>
                        {t('TITLE.MINTABLE')}
                      </Text>
                      <Text textAlign="right" fontSize="2xl" fontWeight="bold">
                        <>
                          {ticketPrice}
                          HENKAKU
                        </>
                      </Text>
                      <Approve erc20={henkakuV2} spender={ticket}>
                        {t('APPROVE')}
                      </Approve>
                    </Box>
                  )}
                {blockTimeStamp.salesStatus === 1 &&
                  mintState.status === 'mintable' &&
                  !isHolding &&
                  approved && (
                    <Box>
                      <Text textAlign="right" fontSize="lg" mt={1}>
                        {t('TITLE.MINTABLE')}
                      </Text>
                      <Text textAlign="right" fontSize="2xl" fontWeight="bold">
                        <>
                          {ethers.utils.formatEther(
                            fromExponential(item.price.toString())
                          )}
                          HENKAKU
                        </>
                      </Text>
                      <Button
                        width="100%"
                        colorScheme="teal"
                        mt={5}
                        loadingText="minting..."
                        isLoading={isMinting || (isSuccess && !minted)}
                        onClick={mint}
                      >
                        {t('MINT')}
                      </Button>
                    </Box>
                  )}

                {item?.tokenURIJSON.encryptedFile &&
                  item?.tokenURIJSON.encryptedSymmetricKey &&
                  (isHolding || mintState.status === 'minted') && (
                    <SecretMessage
                      encryptedFile={String(item.tokenURIJSON.encryptedFile)}
                      encryptedSymmetricKey={
                        item.tokenURIJSON.encryptedSymmetricKey
                      }
                      decryptTokenIds={item.tokenURIJSON.decryptTokenIds}
                      tokenId={id}
                    />
                  )}
              </>
              {item?.creator === address &&
                item?.tokenURIJSON?.encryptedSymmetricKey && (
                  <Box mt="1">
                    <UpdateSecretMessageCrypt
                      tokenId={id}
                      encryptedSymmetricKey={
                        item?.tokenURIJSON?.encryptedSymmetricKey
                      }
                      decryptTokenIds={item?.tokenURIJSON?.decryptTokenIds}
                    />
                  </Box>
                )}
            </Box>

            {(isHolding || mintState.status === 'minted') && (
              <ChatModal receiverAddress={item.creator.toString()} />
            )}
          </GridItem>
        )}
      </Grid>
    </>
  )
}
export default MintTicket
