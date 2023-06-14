import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input
} from '@chakra-ui/react'
import { FC, useCallback, useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Controller, useFieldArray } from 'react-hook-form'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'

interface Props {
  control: any
  watch: any
  validateFileSize(file: File | null, limit: number): string | true
}

const SecretMessageForm: FC<Props> = ({ control, watch, validateFileSize }) => {
  const { t } = useTranslation('common')
  const {
    fields: decryptTokenIdFields,
    append: decryptTokenIdAppend,
    remove: decryptTokenIdRemove
  } = useFieldArray({
    control,
    name: 'decryptTokenIds'
  })
  const isExistsSameTokenId = useCallback(() => {
    const decryptTokenIds = watch('decryptTokenIds')
    const s = new Set(decryptTokenIds)
    return s.size !== decryptTokenIds.length
  }, [watch])

  const [isShowDecryptTokenIds, toggleShowDecryptTokenIds] = useState(false)
  useEffect(() => {
    if (!watch('secretMessage')) {
      decryptTokenIdRemove()
      toggleShowDecryptTokenIds(false)
    }
  }, [watch('secretMessage')])

  return (
    <>
      <FormControl mt={5}>
        <FormLabel mt="1em" htmlFor="secretMessage">
          {t('NEW_TICKET_SECRET_MESSAGE_LABEL')}
        </FormLabel>
        <Controller
          control={control}
          name="secretMessage"
          rules={{
            validate: (v) => validateFileSize(v, 0.5)
          }}
          render={({ field: { onChange }, fieldState }) => (
            <>
              <Input
                variant="unstyled"
                p={1}
                id="secretMessage"
                type="file"
                accept={'image/*'}
                onChange={(e) =>
                  e.target.files ? onChange(e.target.files[0]) : false
                }
              />
              <Box color="red.300">{fieldState.error?.message}</Box>
            </>
          )}
        />
      </FormControl>

      {watch('secretMessage') && (
        <FormControl>
          {!isShowDecryptTokenIds ? (
            <>
              <FormLabel mt="1em" htmlFor="decryptTokenIdsButton" fontSize="sm">
                {t('NEW_TICKET_CONDITIONS_SECRET_MESSAGE_LABEL')}
              </FormLabel>
              <Button
                name="decryptTokenIdsButton"
                size="sm"
                onClick={() => {
                  decryptTokenIdAppend(null)
                  toggleShowDecryptTokenIds((bool) => !bool)
                }}
              >
                {t('ADD_LINKED_DECRYPT_TOKEN_IDS_BUTTON_LABEL')}
              </Button>
            </>
          ) : (
            <>
              <FormLabel mt="1em" htmlFor="decryptTokenIds" fontSize="sm">
                {t('NEW_TICKET_SECRET_LINKED_DECRYPT_TOKEN_IDS_LABEL')}
              </FormLabel>
              <Flex justifyContent="flex-start" flexWrap="wrap">
                {decryptTokenIdFields.map((field, index) => (
                  <Controller
                    control={control}
                    name={`decryptTokenIds.${index}`}
                    rules={{
                      required: t('REQUIRED_INPUT')
                    }}
                    key={field.id}
                    render={({ field: { onChange, value } }) => (
                      <Box mr={2} mb={3}>
                        <Input
                          variant="outline"
                          type="number"
                          width="60px"
                          placeholder="ID"
                          textAlign="right"
                          value={String(value)}
                          isRequired
                          onChange={(v) => {
                            onChange(v)
                          }}
                        />
                      </Box>
                    )}
                  />
                ))}
              </Flex>
              <Flex justifyContent="space-between" mt={3}>
                {isExistsSameTokenId() && (
                  <Box color="red.300">{t('EXISTS_SAME_TOKENID')}</Box>
                )}
                <Flex ml="auto">
                  <IconButton
                    colorScheme="teal"
                    aria-label="Add Wallet Address"
                    size="md"
                    icon={<AddIcon />}
                    onClick={() => decryptTokenIdAppend(null)}
                    mr={2}
                  />
                  <IconButton
                    colorScheme="teal"
                    aria-label="Add Wallet Address"
                    size="md"
                    icon={<MinusIcon />}
                    onClick={() => {
                      decryptTokenIdRemove(decryptTokenIdFields.length - 1)
                      decryptTokenIdFields.length <= 1 &&
                        toggleShowDecryptTokenIds((bool) => !bool)
                    }}
                  />
                </Flex>
              </Flex>
            </>
          )}
        </FormControl>
      )}
    </>
  )
}

export default SecretMessageForm
