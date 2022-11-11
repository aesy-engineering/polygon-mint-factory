import {
  ClaimedWithReferral as ClaimedWithReferralEvent,
} from "../generated/ClaimReferral/ClaimReferral"
import {
  ClaimedWithReferral, Account
} from "../generated/schema"
import { fetchAccount } from "./utils/contract"
export function handleClaimedWithReferral(
  event: ClaimedWithReferralEvent
): void {
  let entity = new ClaimedWithReferral(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  let fromAcc: Account = fetchAccount(event.params.from)
  let byAcc: Account = fetchAccount(event.params.by)
  entity.from = fromAcc.id
  entity.tokenAddress = event.params.tokenAddress
  entity.tokenId = event.params.tokenId
  entity.by = byAcc.id
  entity.referral = event.params.referral
  entity.save()
  fromAcc.save()
  byAcc.save()
}