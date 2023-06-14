export const generateChatGroupName = (
  ticketId: string,
  ticketName: string,
  participantAddress: string
) => {
  return `HTK${ticketId}:${participantAddress}`
}
