import {
  DepositedState,
  OwnershipChanged,
  TradingFeeRedeemed,
  WalletAmountRedeemed
} from "../generated/All41Exchange/All41Exchange"
import { All41Deposit, All41Withdrawal, WalletPool } from "../generated/schema"

/**
 * Handles creation and edits of WalletPool entities
 */
function handleWalletPool<T>(event: T): void {
  // Storing wallet pool in store using wallet address
  let walletPoolEntity = WalletPool.load(event.params.wallet.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!walletPoolEntity) {
    walletPoolEntity = new WalletPool(event.params.wallet.toHex())

    // These values are set once and do not ever change again
    walletPoolEntity.id = event.params.wallet.toHex()
    walletPoolEntity.wallet = event.params.wallet
  }

  // BigInt and BigDecimal math are supported
  // walletPoolEntity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  walletPoolEntity.daiInPool = event.params.dai
  walletPoolEntity.cDaiInPool = event.params.cDai

  // Entities can be written to the store with `.save()`
  walletPoolEntity.save()
}

/**
 * Handles creation and edits of All41Deposit entities
 */
function handleAll41Deposit(event: DepositedState): void {
  // Storing all41DepositEntity in store using event.transaction.hash.toHex() (the ID of the transaction)
  // TODO: i think we dont need to load here since this is only ever set one time
  let all41DepositEntity = All41Deposit.load(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!all41DepositEntity) {
    all41DepositEntity = new All41Deposit(event.transaction.hash.toHex())

    // These values are set once and do not ever change again
    all41DepositEntity.id = event.transaction.hash.toHex()
    all41DepositEntity.wallet = event.params.wallet
    all41DepositEntity.sender = event.params.sender
    all41DepositEntity.daiInPool = event.params.dai
    all41DepositEntity.cDaiInPool = event.params.cDai
    all41DepositEntity.totalCost = event.params.total
    all41DepositEntity.daiAmount = event.params.daiAmount
    all41DepositEntity.tradingFeeInvested = event.params.tradingFeeInvested
  }

  // Entities can be written to the store with `.save()`
  all41DepositEntity.save()
}

/**
 * Handles creation and edits of All41Withdrawal entities
 */
 function handleAll41Withdrawal(event: WalletAmountRedeemed): void {
// Storing all41WithdrawalEntity in store using event.transaction.hash.toHex() (the ID of the transaction)
  // TODO: i think we dont need to load here since this is only ever set one time
  let all41WithdrawalEntity = All41Withdrawal.load(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!all41WithdrawalEntity) {
    all41WithdrawalEntity = new All41Withdrawal(event.transaction.hash.toHex())

    // These values are set once and do not ever change again
    all41WithdrawalEntity.id = event.transaction.hash.toHex()
    all41WithdrawalEntity.wallet = event.params.wallet
    all41WithdrawalEntity.daiInPool = event.params.dai
    all41WithdrawalEntity.cDaiInPool = event.params.cDai
    all41WithdrawalEntity.daiRedeemed = event.params.daiRedeemed
  }

  // Entities can be written to the store with `.save()`
  all41WithdrawalEntity.save()
 }

/**
 * Detect and handle DepositedState events from All41Exchange contract
 */
export function handleDepositedState(event: DepositedState): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type

  handleWalletPool(event)
  handleAll41Deposit(event)  
}

export function handleOwnershipChanged(event: OwnershipChanged): void {}

export function handleTradingFeeRedeemed(event: TradingFeeRedeemed): void {}

/**
 * Detect and handle WalletAmountRedeemed events from All41Exchange contract
 */
export function handleWalletAmountRedeemed(event: WalletAmountRedeemed): void {
  handleWalletPool(event)
  handleAll41Withdrawal(event)
}
