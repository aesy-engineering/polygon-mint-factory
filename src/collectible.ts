import { ApprovalForAll, TransferBatch, TransferSingle } from "../generated/templates/RootCollectible/RootCollectible"
import { BigInt, ethereum, store } from '@graphprotocol/graph-ts'
import { Account, Collection, Transaction, Transfer } from "../generated/schema"
import { fetchAccount, fetchBalance, fetchCollection, fetchToken, events, transactions, constants, fetchApproval} from './utils/contract'

function registerTransfer(
    event: ethereum.Event,
    suffix: string,
    collectionEntity: Collection,
    operator: Account,
    from: Account,
    to: Account,
    id: BigInt,
    value: BigInt
    ): void{

    let tokenEntity = fetchToken(collectionEntity, id)
    let transferEntity = new Transfer(events.id(event).concat(suffix))

    transferEntity.transaction = transactions.log(event).id
    transferEntity.collection = collectionEntity.id
    transferEntity.token = tokenEntity.id
    transferEntity.operator = operator.id
    transferEntity.senderAddress = from.id
    transferEntity.receiverAddress = to.id
    transferEntity.value = value
    
    if(from.id != constants.ADDRESS_ZERO){
        let balanceEntity1 = fetchBalance(tokenEntity, from)
        balanceEntity1.value =  balanceEntity1.value==constants.BIGINT_ZERO ? constants.BIGINT_ZERO : balanceEntity1.value.minus(transferEntity.value)
        balanceEntity1.save()
        if(balanceEntity1.value == constants.BIGINT_ZERO){
            // remove entity from store if balance reach zero
            store.remove("Balance", balanceEntity1.id)
        }
    }else{
        collectionEntity.currentSupply =  collectionEntity.currentSupply.plus(transferEntity.value)
    }

    if(to.id != constants.ADDRESS_ZERO){
        let balanceEntity2 = fetchBalance(tokenEntity, to)
        balanceEntity2.value = balanceEntity2.value.plus(transferEntity.value)
        balanceEntity2.save()
    }else{
        collectionEntity.currentSupply = collectionEntity.currentSupply==constants.BIGINT_ZERO ? constants.BIGINT_ZERO : collectionEntity.currentSupply.minus(transferEntity.value)
    }
    
      // saving transfers to transaction manually instead of deriving
      let txEntity = Transaction.load(event.transaction.hash.toHexString())
      if(txEntity != null){
        let transferArray = txEntity.transfers
        transferArray.push(transferEntity.id)
        txEntity.transfers = transferArray
        txEntity.save()
      }

      
    transferEntity.save()
    tokenEntity.save()
    collectionEntity.save()
}

export function handleTransferSingle(event: TransferSingle): void{
    let collectionEntity = fetchCollection(event.address)
    let operator = fetchAccount(event.params.operator)
    let from = fetchAccount(event.params.from)
    let to = fetchAccount(event.params.to)
   
    collectionEntity.save()
    operator.save()
    from.save()
    to.save()
    registerTransfer(
       event,
       "",
       collectionEntity,
       operator,
       from,
       to,
       event.params.id,
       event.params.value
    )
   
   }


   export function handleTransferBatch(event: TransferBatch): void{
        let collectionEntity = fetchCollection(event.address)
        let operator = fetchAccount(event.params.operator)
        let from = fetchAccount(event.params.from)
        let to = fetchAccount(event.params.to)

        collectionEntity.save()
        operator.save()
        from.save()
        to.save()

        let ids = event.params.ids
        let values = event.params.values
        for(let i = 0; i< ids.length; i++){
            registerTransfer(
                event,
                "-".concat(i.toString()),
                collectionEntity,
                operator,
                from,
                to,
                ids[i],
                values[i]
            )
        }
    }

    export function handleApproval(event: ApprovalForAll): void{
        let collectionEntity: Collection = fetchCollection(event.address)
        let accountEntity:Account = fetchAccount(event.params.account)
        let operatoryEntity:Account = fetchAccount(event.params.operator)

        let approvalEntity = fetchApproval(accountEntity, operatoryEntity, collectionEntity)
        approvalEntity.approved =  event.params.approved

        collectionEntity.save()
        accountEntity.save()
        operatoryEntity.save()
        approvalEntity.save()
    }