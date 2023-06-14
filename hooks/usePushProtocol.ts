import { useCallback, useEffect, useState } from 'react'
import * as push from '@pushprotocol/restapi'
import { useAccount, useSigner } from 'wagmi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import { generateChatGroupName } from '@/utils/push-chat'

const env = ENV.STAGING

export const useInitPush = () => {
  const [user, setUser] = useState<push.IUser | null>(null)
  const { address } = useAccount()

  useEffect(() => {
    const fetch = async () => {
      if (!address) return
      const _user = await push.user.get({ account: `eip155:${address}`, env })
      setUser(_user)
    }
    fetch()
  }, [address])

  const createUser = useCallback(async () => {
    if (!address) return
    try {
      const _user = await push.user.create({ account: address, env })
      setUser(_user)
    } catch (error) {
      console.log(error)
    }
  }, [address])

  return { user, createUser }
}

export const useDecryptedPvtKey = (user: push.IUser | null) => {
  const [key, setKey] = useState<string | null>(null)
  const { data: signer } = useSigner()

  useEffect(() => {
    const fetch = async () => {
      if (!user || !signer || key) return
      try {
        const pgpDecryptedPvtKey = await push.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          signer: signer as any
        })
        setKey(pgpDecryptedPvtKey)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, [user, signer])

  return { key }
}

export const useCreateGroupChat = (key: string | null) => {
  const { address } = useAccount()
  const createGroupChat = useCallback(
    (members: string[], groupName: string) => {
      if (!key || !address) return
      try {
        const res = push.chat.createGroup({
          groupName,
          groupDescription: 'Henkaku Ticket　スレッド',
          members,
          groupImage: '',
          admins: [],
          isPublic: false,
          account: address,
          pgpPrivateKey: key,
          env
        })
        return res
      } catch (error) {
        console.log(error)
        return
      }
    },
    [key, address]
  )

  return { createGroupChat }
}

export const useAllChats = (key: string | null) => {
  const { address } = useAccount()

  const [chats, setChats] = useState<push.IFeeds[]>()

  useEffect(() => {
    const fetch = async () => {
      if (!address || !key || typeof chats === 'object') return

      try {
        const _chats = await push.chat.chats({
          account: `eip155:${address}`,
          toDecrypt: true,
          pgpPrivateKey: key,
          env
        })
        setChats(_chats)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, [key, address])

  return { chats }
}

export const useChatHistory = (key: string, receiverAddress?: string) => {
  const { address } = useAccount()

  const [chatHistory, setChatHistory] = useState<push.IMessageIPFS[]>()

  useEffect(() => {
    const fetch = async () => {
      if (
        !address ||
        !key ||
        !receiverAddress ||
        typeof chatHistory === 'object'
      )
        return

      try {
        const conversationHash = await push.chat.conversationHash({
          account: `eip155:${address}`,
          conversationId: `eip155:${receiverAddress}`,
          env
        })

        if (conversationHash.threadHash) {
          const _chatHistory = await push.chat.history({
            account: `eip155:${address}`,
            threadhash: conversationHash.threadHash,
            toDecrypt: true,
            pgpPrivateKey: key,
            env
          })
          setChatHistory(_chatHistory.reverse())
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, [key, address, receiverAddress])

  const appendMessage = useCallback(
    (newMessage: push.IMessageIPFS[]) => {
      if (!chatHistory) return
      setChatHistory(chatHistory.concat(newMessage))
    },
    [chatHistory]
  )

  return { chatHistory, appendMessage }
}

export const useChatRequests = (user: push.IUser, key: string | null) => {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const [chatRequests, setChatRequests] = useState<push.IFeeds[]>()

  useEffect(() => {
    const fetch = async () => {
      if (!user || !key || typeof chatRequests === 'object') return

      try {
        const _chatRequests = await push.chat.requests({
          account: user.did,
          toDecrypt: true,
          pgpPrivateKey: key,
          env
        })
        setChatRequests(_chatRequests)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, [user, key])

  const approveRequest = useCallback(
    async (chatId: string) => {
      if (!key || !signer) return
      try {
        const res = await push.chat.approve({
          account: address,
          senderAddress: chatId,
          pgpPrivateKey: key,
          signer: signer as any,
          env
        })

        return res
      } catch (error) {
        console.log(error)
        return
      }
    },
    [key, signer, address]
  )

  return { chatRequests, approveRequest }
}

export const useSendChat = (user: push.IUser, key: string) => {
  const { data: signer } = useSigner()

  const sendChat = useCallback(
    async (messageContent: string, receiverAddress?: string) => {
      if (!signer || !key || !user) return
      try {
        const res = await push.chat.send({
          receiverAddress: `eip155:${receiverAddress}`,
          messageContent,
          messageType: 'Text',
          pgpPrivateKey: key,
          signer: signer as any,
          env
        })

        const decryptedChat = await push.chat.decryptConversation({
          messages: [res],
          connectedUser: user,
          pgpPrivateKey: key
        })

        return decryptedChat
      } catch (error) {
        console.log(error)
        return
      }
    },
    [key, signer, user]
  )

  return { sendChat }
}
