import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  MetaTransaction,
  OwnershipTransferred
} from "../generated/RootForwarder/RootForwarder"

export function createMetaTransactionEvent(
  user: Address,
  destination: Address,
  nonce: BigInt,
  funcSig: Bytes
): MetaTransaction {
  let metaTransactionEvent = changetype<MetaTransaction>(newMockEvent())

  metaTransactionEvent.parameters = new Array()

  metaTransactionEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  metaTransactionEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )
  metaTransactionEvent.parameters.push(
    new ethereum.EventParam("nonce", ethereum.Value.fromUnsignedBigInt(nonce))
  )
  metaTransactionEvent.parameters.push(
    new ethereum.EventParam("funcSig", ethereum.Value.fromBytes(funcSig))
  )

  return metaTransactionEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
