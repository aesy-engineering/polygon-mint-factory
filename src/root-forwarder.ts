import {
  MetaTransaction as MetaTransactionEvent,
} from "../generated/RootForwarder/RootForwarder"
import { MetaTransaction } from "../generated/schema"
import { fetchAccount, fetchContract } from "./utils/contract"

export function handleMetaTransaction(event: MetaTransactionEvent): void {
  let metaEntity = new MetaTransaction(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  let userEntity = fetchAccount(event.params.user)
  let contractEntity = fetchContract(event.params.destination)
  metaEntity.from = userEntity.id
  metaEntity.to = contractEntity.id
  metaEntity.nonce = event.params.nonce
  metaEntity.signature = event.params.funcSig

  userEntity.save()
  contractEntity.save()
  metaEntity.save()
}
