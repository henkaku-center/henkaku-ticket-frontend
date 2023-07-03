import Link from 'next/link'
import React from 'react'
import { TicketInfoProps } from '@/hooks/useTicketInfo'
import {
  Box,
  Button,
  Image,
  AspectRatio,
  Text,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react'
import { Ticket } from '@/types'
import { useAllTicketsInfo } from '@/hooks/useTicketInfo'
import styles from './TicketsList.module.css'
import useTranslation from 'next-translate/useTranslation'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'
import { checkSaleStatus } from '@/utils/checkSaleStatus'

interface TicketsListProps {
  items: Ticket.TicketInfoStructOutput[]
  type?: 'simple'
}

const TicketsList: React.FC<TicketsListProps> = ({ items, type }) => {
  const { allTicketsInfo } = useAllTicketsInfo(items)
  const { t } = useTranslation('common')

  if (!allTicketsInfo)
    return (
      <Stack direction="row" justifyContent="center" alignItems="center" m={10}>
        <Spinner />
      </Stack>
    )
  if (allTicketsInfo.length <= 0) return <Box>{t('EMPTY_TICKET_LIST')}</Box>

  if (type === 'simple')
    return <TicketListItems allTicketsInfo={allTicketsInfo} type={type} />
  return (
    <Tabs colorScheme="teal">
      <TabList>
        <Tab minWidth="34%">{t('ON_SALE')}</Tab>
        <Tab minWidth="33%">{t('BEFORE_SALE')}</Tab>
        <Tab minWidth="33%">{t('END_OF_SALE')}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel paddingInline={0}>
          <TicketListItems allTicketsInfo={allTicketsInfo} status={1} />
        </TabPanel>
        <TabPanel paddingInline={0}>
          <TicketListItems allTicketsInfo={allTicketsInfo} status={0} />
        </TabPanel>
        <TabPanel paddingInline={0}>
          <TicketListItems allTicketsInfo={allTicketsInfo} status={2} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const TicketListItems = ({
  allTicketsInfo,
  type,
  status = null
}: {
  allTicketsInfo: TicketInfoProps[]
  type?: 'simple'
  status?: number | null
}) => {
  const { t } = useTranslation('common')
  const currentTicketsInfo =
    status !== null
      ? allTicketsInfo.filter(
          (ticketInfo) => checkSaleStatus(ticketInfo) === status
        )
      : allTicketsInfo
  return currentTicketsInfo.length > 0 ? (
    <SimpleGrid
      columns={{ sm: 3, md: 4 }}
      spacing="30px"
      p="0"
      textAlign="center"
      rounded="lg"
    >
      {currentTicketsInfo.map((ticketInfo) => {
        if (!ticketInfo.tokenURIJSON) return
        return (
          <div key={ticketInfo.id as number} className={styles.list}>
            <div className={styles.image}>
              <Link href={`/ticket/${ticketInfo.id}`}>
                <AspectRatio ratio={1}>
                  <Box>
                    <Image
                      src={parseIpfs2Pinata(ticketInfo.tokenURIJSON.image)}
                      alt=""
                    />
                  </Box>
                </AspectRatio>
              </Link>
            </div>
            <Text pt={2} pb={2} mb="auto">
              {ticketInfo.tokenURIJSON.name}
            </Text>
            {type !== 'simple' && (
              <Link href={`/ticket/${ticketInfo.id}`}>
                <Button width="100%" size="sm">
                  {t('GET_TICKET')}
                </Button>
              </Link>
            )}
          </div>
        )
      })}
    </SimpleGrid>
  ) : (
    <>{t('EMPTY_TICKET_LIST')}</>
  )
}

export default TicketsList
