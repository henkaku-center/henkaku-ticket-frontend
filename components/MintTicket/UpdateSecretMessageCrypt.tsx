import { useLitEncryption } from '@/hooks/useLitProtocol'
import { Button, useToast } from '@chakra-ui/react'
import { FC, useCallback } from 'react'

type Props = {
  tokenId: number
  encryptedSymmetricKey: string
  decryptTokenIds?: number[]
}

const UpdateSecretMessageCrypt: FC<Props> = ({
  tokenId,
  encryptedSymmetricKey,
  decryptTokenIds
}) => {
  const { updateEncrypt } = useLitEncryption()
  const toast = useToast()

  const update = useCallback(async () => {
    try {
      await updateEncrypt(tokenId, encryptedSymmetricKey, decryptTokenIds)
      toast({
        id: 'UPDATE_CRYPT_SUCCESS',
        title: 'Success!',
        status: 'success',
        duration: 5000,
        position: 'top'
      })
    } catch (error) {
      toast({
        id: 'UPDATE_CRYPT_FAIL',
        title: 'Failed',
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }, [tokenId, encryptedSymmetricKey, decryptTokenIds, updateEncrypt])

  return (
    <Button width="100%" onClick={update}>
      Update Secret Key
    </Button>
  )
}

export default UpdateSecretMessageCrypt
