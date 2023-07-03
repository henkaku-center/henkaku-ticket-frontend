import { TicketInfoProps } from '@/hooks/useTicketInfo'

export const checkSaleStatus = (ticketInfo: TicketInfoProps) => {
  const now = Date.now()
  if (now < (ticketInfo.open_blockTimestamp as number) * 1000) return 0
  if (now > (ticketInfo.close_blockTimestamp as number) * 1000) return 2
  return 1
}
