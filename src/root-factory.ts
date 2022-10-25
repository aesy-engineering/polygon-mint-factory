import {
  NewProject
} from "../generated/RootFactory/RootFactory"

import { fetchAccount, fetchCollection } from "./utils/contract"

import { RootCollectible } from "../generated/templates"

export function handleNewProject(ProjectEvent: NewProject): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let creatorEntity = fetchAccount(ProjectEvent.params.creator)
  let collectionEntity = fetchCollection(ProjectEvent.params.project)
  // Create new Collection source
  RootCollectible.create(ProjectEvent.params.project)
  // Entity fields can be set based on event parameters
  collectionEntity.creator = creatorEntity.id
  collectionEntity.name = ProjectEvent.params.name
  collectionEntity.type = (ProjectEvent.params.standard == 1)? "ERC1155" : "ERC721"
  // collectionEntity.type = "ERC1155"
  // Entities can be written to the store with `.save()`
  creatorEntity.save()
  collectionEntity.save()

}

