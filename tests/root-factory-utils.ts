import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  Initialized,
  NewProject,
  RootFactoryOwnershipTransferred,
  Paused,
  Unpaused
} from "../generated/RootFactory/RootFactory"

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createNewProjectEvent(
  creator: Address,
  standard: i32,
  project: Address,
  name: string
): NewProject {
  let newProjectEvent = changetype<NewProject>(newMockEvent())

  newProjectEvent.parameters = new Array()

  newProjectEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  newProjectEvent.parameters.push(
    new ethereum.EventParam(
      "standard",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(standard))
    )
  )
  newProjectEvent.parameters.push(
    new ethereum.EventParam("project", ethereum.Value.fromAddress(project))
  )
  newProjectEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return newProjectEvent
}

export function createRootFactoryOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): RootFactoryOwnershipTransferred {
  let rootFactoryOwnershipTransferredEvent = changetype<
    RootFactoryOwnershipTransferred
  >(newMockEvent())

  rootFactoryOwnershipTransferredEvent.parameters = new Array()

  rootFactoryOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  rootFactoryOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return rootFactoryOwnershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
