import {
  Initialized as InitializedEvent,
  NewProject as NewProjectEvent,
  RootFactoryOwnershipTransferred as RootFactoryOwnershipTransferredEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent
} from "../generated/RootFactory/RootFactory"
import {
  Initialized,
  NewProject,
  RootFactoryOwnershipTransferred,
  Paused,
  Unpaused
} from "../generated/schema"

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.version = event.params.version
  entity.save()
}

export function handleNewProject(event: NewProjectEvent): void {
  let entity = new NewProject(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.creator = event.params.creator
  entity.standard = event.params.standard
  entity.project = event.params.project
  entity.name = event.params.name
  entity.save()
}

export function handleRootFactoryOwnershipTransferred(
  event: RootFactoryOwnershipTransferredEvent
): void {
  let entity = new RootFactoryOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.account = event.params.account
  entity.save()
}
