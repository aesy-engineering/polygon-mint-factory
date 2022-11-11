import { OrderFulfilled as OrderFulfilledEvent } from '../generated/SeaPort/SeaPort'
import { Account, Sale, Collection, Token } from '../generated/schema'
import { constants, fetchAccount, fetchCollection, fetchToken } from './utils/contract'
import { BigInt } from '@graphprotocol/graph-ts'

export function handleOrderFulfilled(event: OrderFulfilledEvent): void {
    let offer = event.params.offer
    let consideration = event.params.consideration
    // Only index root collection sales for now
    let collectionEntity = Collection.load(offer[0].token.toHexString())
    if(collectionEntity){
        let tokenEntity: Token = fetchToken(collectionEntity, offer[0].identifier)
        let offererEntity: Account = fetchAccount(event.params.offerer)
        let fulfillerEntity: Account = fetchAccount(event.params.recipient)
    
        let saleEntity: Sale = new Sale(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
        saleEntity.orderHash = event.params.orderHash
        saleEntity.offerer = offererEntity.id
        saleEntity.fulfiller = fulfillerEntity.id
        saleEntity.offer = tokenEntity.id
        saleEntity.quantity = offer[0].amount
        // let total :BigInt = constants.BIGINT_ZERO
        // for(let i = 0; i < consideration.length; i++){
        //     total.plus(consideration[i].amount)
        // }
        let total = consideration[0].amount.plus(consideration[1].amount)
        if(consideration.length > 2){
            total.plus(consideration[2].amount)
            saleEntity.royaltyAmount = consideration[2].amount
        }
        saleEntity.platformFee = consideration[1].amount
        saleEntity.saleAmount = consideration[0].amount
        saleEntity.totalAmount = total

        
        collectionEntity.save()
        tokenEntity.save()
        offererEntity.save()
        fulfillerEntity.save()
        saleEntity.save()
    }
}