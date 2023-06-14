import { useAccount } from 'wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import { useLitDecryption } from '@/hooks/useLitProtocol'
import { useRetrieveHoldingTicketsByAddress } from '@/hooks/useTicketContract'
import {
  Box,
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'

type Props = {
  encryptedFile: string
  encryptedSymmetricKey: string
  tokenId: number
  decryptTokenIds?: number[]
}

const SecretMessage: FC<Props> = ({
  encryptedFile,
  encryptedSymmetricKey,
  tokenId,
  decryptTokenIds
}) => {
  const { decrypt } = useLitDecryption(tokenId, decryptTokenIds)
  const { address } = useAccount()
  const { data, isLoading } = useRetrieveHoldingTicketsByAddress(address!)
  const holdingTicketTokenIds = useMemo(
    () => data?.map((d) => d.id.toNumber()),
    [data]
  )

  const isDecryptConditions = useMemo(() => {
    if (decryptTokenIds) {
      return decryptTokenIds?.every((n) => holdingTicketTokenIds?.includes(n))
    } else {
      return true
    }
  }, [decryptTokenIds, holdingTicketTokenIds])

  const [message, setMessage] = useState<string>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const decryptMessage = useCallback(async () => {
    if (!message) {
      try {
        const decryptedMessage = await decrypt(
          encryptedFile,
          encryptedSymmetricKey
        )
        let binary = ''
        const bytes = new Uint8Array(decryptedMessage?.decryptedFile)
        const len = bytes.byteLength
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        setMessage(window.btoa(binary))
      } catch (error) {
        return
      }
    }
    onOpen()
  }, [decrypt])

  return (
    <Box>
      <Divider my={5} />
      {!isLoading && (
        <Button
          onClick={() => decryptMessage()}
          colorScheme="teal"
          height="auto"
          py={2}
        >
          このチケットホルダーだけが読める
          <br />
          メッセージ・カードをみる
        </Button>
      )}

      {!isDecryptConditions && !isLoading && (
        <Box>
          シークレット・メッセージを閲覧するためには、このチケットに加えてID「
          {decryptTokenIds?.join('、')}
          」のチケットを保持している必要があります。
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box py={5}>
              <Image
                margin="0 auto"
                src={`data:image;base64, ${message}`}
                alt=""
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default SecretMessage
