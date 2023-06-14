import {
  useRegisterTicket,
  useRetrieveAllTicket
} from '@/hooks/useTicketContract'
import useTranslation from 'next-translate/useTranslation'
import { FC, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Text,
  useToast
} from '@chakra-ui/react'
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import { useUploadImageFile, useUploadMetadataJson } from '@/hooks/usePinata'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useLitEncryption } from '@/hooks/useLitProtocol'
import { BigNumber, ethers } from 'ethers'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import SecretMessageForm from '@/components/CreateTicket/SecretMessageForm'
import {
  useRevenueSharing,
  RevenueSharingData
} from '@/hooks/useRevenueSharing'
import { HIDE_TICKET_LIST } from '@/constants/Ticket'

type FormData = {
  name: string
  description: string
  image: File | null
  secretMessage: File | null
  decryptTokenIds: number[]
  revenueSharingData: RevenueSharingData[]
  creatorName: string
  maxSupply: number
  price: number
  blockTimeStamp: Date[]
}

interface TicketTokenMetadata {
  name: string
  image: string
  description?: string | null | undefined
  animation_url?: string | null | undefined
  external_url?: string | null | undefined
  encryptedFile?: string
  encryptedSymmetricKey?: string
  decryptTokenIds?: number[]
  attributes: TokenAttribute[]
}

interface TokenAttribute {
  trait_type: string
  value: number | string
  display_type?: string | null | undefined
  max_value?: number | null | undefined
  trait_count?: number | null | undefined
  order?: number | null | undefined
}

const metadata_external_url = 'https://ticket.henkaku.org'

const CreateTicketForm: FC = () => {
  const { t } = useTranslation('common')
  const { address } = useAccount()
  const router = useRouter()
  const toast = useToast()
  const { initEncrypt, updateEncrypt, encryptedSymmetricKey } =
    useLitEncryption()

  const { data } = useRetrieveAllTicket()
  const filteredTokenId = useMemo(() => {
    return data
      ?.filter((n) => !HIDE_TICKET_LIST.includes(n.id.toNumber()))
      .map((n) => n.id.toNumber())
  }, [data])
  console.log(filteredTokenId)

  const {
    control,
    handleSubmit,
    formState,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      image: null,
      secretMessage: null,
      revenueSharingData: [{ shareholdersAddress: '', sharesAmount: null }],
      decryptTokenIds: [],
      creatorName: '',
      maxSupply: 10,
      price: 10,
      blockTimeStamp: [new Date(), new Date()]
    }
  })

  const {
    sharesAmounts,
    shareholdersAddresses,
    isCorrectPercentage,
    mappingAmountPercentage,
    mappingShareholdersAddresses
  } = useRevenueSharing({ watch })

  const {
    fields: revenueSharingFields,
    append: revenueSharingAppend,
    remove: revenueSharingRemove
  } = useFieldArray({
    control,
    name: 'revenueSharingData'
  })

  const [metadataURI, setMetadataURI] = useState('')

  const {
    isLoading: txIsLoading,
    isSuccess,
    writeAsync,
    registeredTokenId
  } = useRegisterTicket(
    Number(watch('maxSupply')),
    metadataURI,
    Number(watch('price')),
    [watch('blockTimeStamp')[0], watch('blockTimeStamp')[1]]
  )

  const uploadFile = useUploadImageFile()
  const uploadMetadata = useUploadMetadataJson()

  useEffect(() => {
    const callback = async () => {
      if (isSuccess && registeredTokenId) {
        if (encryptedSymmetricKey) {
          await updateEncrypt(
            registeredTokenId,
            encryptedSymmetricKey,
            watch('decryptTokenIds')
          )
        }
        router.push(`/ticket/${registeredTokenId}`)
      }
    }
    callback()
  }, [registeredTokenId, isSuccess])

  const submit = async (data: FormData) => {
    try {
      if (!data.image || !isCorrectPercentage) return
      const tempDecryptTokenIds = data.decryptTokenIds
        .filter((n) => n !== null)
        .map((n) => Number(n))
      const isExistsTokenIds = tempDecryptTokenIds.every((n) =>
        filteredTokenId?.includes(n)
      )
      if (!isExistsTokenIds) {
        toast({
          id: 'NOT_EXISTS_TOKENID',
          title: t('CLAIM.TOAST.NOT_EXISTS_SECRET_MESSAGE_TOKENID'),
          status: 'error',
          duration: 5000,
          position: 'top'
        })
        return
      }

      const imageIPFSHash = await uploadFile(data.image)
      const metadataJson: TicketTokenMetadata = {
        name: data.name,
        image: `ipfs://${imageIPFSHash}`,
        description: data.description,
        external_url: metadata_external_url,
        attributes: [
          {
            trait_type: 'OrganizerAddress',
            value: address!
          },
          {
            trait_type: 'OrganizerName',
            value: data.creatorName
          }
        ]
      }

      if (data.secretMessage) {
        if (tempDecryptTokenIds[0]) {
          metadataJson.decryptTokenIds = tempDecryptTokenIds
        }
        const encryptedInfo = await initEncrypt(data.secretMessage)
        metadataJson.encryptedFile = encryptedInfo?.stringifiedEncryptedFile
        metadataJson.encryptedSymmetricKey =
          encryptedInfo?.encryptedSymmetricKey
      }

      const metadataIPFSHash = await uploadMetadata(metadataJson)
      setMetadataURI(`ipfs://${metadataIPFSHash}`)
      await txWithContract(
        data.maxSupply,
        `ipfs://${metadataIPFSHash}`,
        ethers.utils.parseEther(String(data.price)),
        data.blockTimeStamp
      )
      return
    } catch (error) {
      console.log(error)
    }
  }

  const txWithContract = async (
    maxSupply: number,
    metaDataURL: string,
    price: BigNumber,
    blockTimeStamp: Date[]
  ) => {
    try {
      if (!writeAsync) return
      const open_blockTimeStamp = Math.floor(
        (blockTimeStamp[0]?.getTime() || Date.now()) / 1000
      )
      const close_clockTimeStamp = Math.floor(
        (blockTimeStamp[1]?.getTime() || Date.now()) / 1000
      )
      const shareholdersAmount = sharesAmounts.map((amount) =>
        ethers.utils.parseEther(String(amount))
      )

      await writeAsync({
        recklesslySetUnpreparedArgs: [
          maxSupply,
          metaDataURL,
          price,
          open_blockTimeStamp,
          close_clockTimeStamp,
          shareholdersAddresses,
          shareholdersAmount
        ]
      })
      return
    } catch (error: any) {
      toast({
        id: 'REGISTER_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  const validateFileSize = (file: File | null, limit: number) => {
    if (!file) return true
    return file.size / (1024 * 1024) > limit ? `Upto ${limit}MB` : true
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(submit)}>
        <FormControl mt={5} isRequired>
          <FormLabel mt="1em" htmlFor="ticketName">
            {t('NEW_TICKET_TITLE_LABEL')}
          </FormLabel>
          <Controller
            control={control}
            name="name"
            rules={{ required: t('REQUIRED_INPUT') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="ticketName"
                  type="text"
                  isRequired={true}
                  placeholder={t('NEW_TICKET_TITLE_LABEL')}
                  onChange={onChange}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl mt={5} isRequired>
          <FormLabel mt="1em" htmlFor="imageFile">
            {t('NEW_TICKET_PICTURE_LABEL')}
          </FormLabel>
          <Controller
            control={control}
            name="image"
            rules={{
              required: t('REQUIRED_INPUT'),
              validate: (v) => validateFileSize(v, 3)
            }}
            render={({ field: { onChange }, fieldState }) => (
              <>
                <Input
                  variant="unstyled"
                  p={1}
                  id="imageFile"
                  type="file"
                  accept={'image/*'}
                  isRequired={true}
                  onChange={(e) =>
                    e.target.files && e.target.files[0].size
                      ? onChange(e.target.files[0])
                      : false
                  }
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <SecretMessageForm
          control={control}
          watch={watch}
          validateFileSize={validateFileSize}
        />

        <FormControl mt={5} isRequired>
          <FormLabel mt="1em" htmlFor="ticketName">
            {t('NEW_TICKET_DESCRIPTION')}
          </FormLabel>
          <Controller
            control={control}
            name="description"
            rules={{ required: t('REQUIRED_INPUT') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="ticketName"
                  type="text"
                  isRequired={true}
                  placeholder={t('NEW_TICKET_DESCRIPTION')}
                  onChange={onChange}
                  value={value}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel mt="1em" htmlFor="creatorName">
            {t('NEW_TICKET_CREATOR_NAME')}
          </FormLabel>
          <Controller
            control={control}
            name="creatorName"
            render={({ field: { onChange, value } }) => (
              <Input
                variant="outline"
                id="creatorName"
                type="text"
                placeholder={t('NEW_TICKET_CREATOR_NAME')}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="maxSupply">
            {t('NEW_TICKET_MAX_SUPPLY')}
          </FormLabel>
          <Controller
            control={control}
            name="maxSupply"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="maxSupply"
                  type="number"
                  placeholder={t('NEW_TICKET_MAX_SUPPLY')}
                  onChange={onChange}
                  value={value}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="price">
            {t('NEW_TICKET_PRICE')}
          </FormLabel>
          <Controller
            control={control}
            name="price"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="price"
                  type="number"
                  placeholder={t('NEW_TICKET_PRICE')}
                  onChange={(v) => {
                    onChange(v)
                    mappingAmountPercentage()
                  }}
                  value={value}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="revenueSharingData">
            {t('NEW_TICKET_POOL_WALLET')}
          </FormLabel>
          {revenueSharingFields.map((field, index) => (
            <Flex justifyContent="flex-end" key={field.id} mb={2}>
              <Controller
                control={control}
                name={`revenueSharingData.${index}.shareholdersAddress`}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      variant="outline"
                      type="text"
                      placeholder={t('NEW_TICKET_POOL_WALLET')}
                      value={value}
                      isRequired
                      onChange={(v) => {
                        onChange(v)
                        mappingShareholdersAddresses()
                      }}
                    />
                  </>
                )}
              />
              <Controller
                control={control}
                name={`revenueSharingData.${index}.sharesAmount`}
                rules={{
                  required: t('REQUIRED_INPUT')
                }}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <Flex alignItems="center">
                      <Input
                        variant="outline"
                        type="number"
                        width="60px"
                        ml={2}
                        mr={1}
                        placeholder="0"
                        textAlign="right"
                        value={String(value)}
                        isRequired
                        onChange={(v) => {
                          onChange(v)
                          mappingAmountPercentage()
                        }}
                      />
                      %
                    </Flex>
                    {sharesAmounts.length > 0 && (
                      <Text fontSize="xs" mt={2}>
                        {sharesAmounts[index]} トークン
                      </Text>
                    )}
                  </Box>
                )}
              />
            </Flex>
          ))}
          {!isCorrectPercentage && (
            <Box color="red.300">
              {t('NEW_TICKET_INCORRECT_TOTAL_PERCENTAGE')}
            </Box>
          )}
          <Flex justifyContent="flex-end">
            <IconButton
              colorScheme="teal"
              aria-label="Add Wallet Address"
              size="md"
              icon={<AddIcon />}
              onClick={() =>
                revenueSharingAppend({
                  shareholdersAddress: '',
                  sharesAmount: null
                })
              }
              mr={2}
            />
            <IconButton
              colorScheme="teal"
              aria-label="Add Wallet Address"
              size="md"
              icon={<MinusIcon />}
              onClick={() =>
                revenueSharingFields.length > 1 &&
                revenueSharingRemove(revenueSharingFields.length - 1)
              }
            />
          </Flex>
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="blockTimeStamp">
            {t('NEW_TICKET_TIMESTAMP')}
          </FormLabel>
          <Controller
            control={control}
            name="blockTimeStamp"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <RangeDatepicker
                  id="blockTimeStamp"
                  selectedDates={value}
                  onDateChange={onChange}
                  configs={{
                    dateFormat: 'yyyy/MM/dd',
                    dayNames: '日月火水木金土'.split(''), // length of 7
                    monthNames:
                      '1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月'.split(
                        ','
                      ) // length of 12
                  }}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <Button
          mt={10}
          colorScheme="teal"
          isLoading={
            formState.isSubmitting || (isSuccess && !registeredTokenId)
          }
          width="full"
          type="submit"
        >
          {t('BUTTON_CREATE')}
        </Button>

        <Text color="red.400" textAlign="right" mt={1}>
          {t('NEW_TICKET_TAKING_TIME')}
        </Text>
      </form>
    </Box>
  )
}

export default CreateTicketForm
