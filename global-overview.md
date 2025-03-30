## Partisia Blockchain Authentication Reference

### 1. Wallet Authentication System

#### Core Architecture

- **End-to-End Encrypted Communication**: Partisia Wallet implements secure communication channels between dApps and wallets
- **Permission-Based Model**: Granular permission system (sign, private_key) for security
- **Browser Extension Integration**: Available for Chrome/Chromium, Firefox, Brave, and Edge
- **Connection Lifecycle**: Initialization → Permission Request → User Approval → Secure Channel → Interaction → Termination

#### Partisia SDK Integration (Recommended Method)

```javascript
import PartisiaSdk from 'partisia-sdk'

// Initialize SDK
const sdk = new PartisiaSdk()

// Connect to wallet
await sdk.connect({
  permissions: ['sign'],
  dappName: 'My Partisia dApp',
  chainId: 'Partisia Blockchain'
})

// Verify connection
if (sdk.isConnected) {
  console.log(`Connected to account: ${sdk.connection.account.address}`)
}
```

#### Connection Object Structure

```javascript
{
  "connection": {
    "account": {
      "address": "00cb7d60b722e85f7530e67652ef41ad84b9c8cd17", // On-chain address
      "pub": "02156ef2d8e1d406549822aa790d838d6c550f79a3c397d9912129b122203a75a3" // Public key
    },
    "popupWindow": {
      "tabId": 237,
      "box": "02408b13a15b07e479f4933f8b006907426238f048957187fd6eb077c25d044358"
    }
  },
  "seed": "62825305f0d64932fee23549d8dbd230d4d4d011ee2596f4f07e6af3c61ac8cb" // dApp seed for secure communication
}
```

#### Transaction Signing

```javascript
// Simple UTF-8 message signing
const result = await sdk.signMessage({
  payload: 'Hello, Partisia Blockchain!',
  payloadType: 'utf8'
})

// Contract interaction with hex payload
const result = await sdk.signMessage({
  contract: '01a4082d9d560749ecd0ffa1dcaaaee2c2cb25d881',
  payload: dataPayload.toString('hex'),
  payloadType: 'hex_payload'
})
```

#### Response Object

```javascript
{
  "signature": "304402...",           // Cryptographic signature
  "serializedTransaction": "0ab401...", // Complete serialized transaction
  "digest": "8773e068...",            // Hash digest that was signed
  "trxHash": "11d09178b39c10520aec717200a4a5cd229e948bc15c4a87e65d682008f86db5", // Transaction hash
  "isFinalOnChain": false             // Indicates if transaction is finalized
}
```

### 2. Smart Contract Development

#### Contract Types

1. **System Smart Contracts**: Permanent contracts maintaining the PBC ecosystem (deployment, orchestration)
2. **Public Smart Contracts**: Standard contracts written in Rust-based PBC contract language
3. **ZK Smart Contracts**: Contracts with privacy-preserving computation using MPC technology

#### Contract Lifecycle

1. **Creation**: Contract is deployed as a WASM file and initialized
2. **Active**: Contract state can be changed through actions and interactions
3. **Destruction**: Contract is destroyed when it hits expiration date or runs out of gas

#### Development Framework

Smart contracts use a macro-based system for defining components:

```rust
#[state]
pub struct VotingContractState {
    proposal_id: u64,
    mp_addresses: Vec<Address>,
    votes: SortedVecMap<Address, u8>,
    closed: u8,
}

#[init]
pub fn initialize(
    context: ContractContext,
    proposal_id: u64,
    mp_addresses: Vec<Address>,
) -> (VotingContractState, Vec<EventGroup>) {
  // Initialization code
}

#[action]
pub fn vote(
    context: ContractContext,
    state: VotingContractState,
    vote: u8,
) -> (VotingContractState, Vec<EventGroup>) {
  // Voting logic
}

#[callback(shortname = 13)]
pub fn callback_function(
  contract_context: ContractContext,
  callback_context: CallbackContext,
  state: ContractState,
) -> (ContractState, Vec<EventGroup>) {
  // Callback handling
}
```

#### Key Macros

- `#[state]`: Declares the contract's state structure
- `#[action]`: Defines functions that can be called externally
- `#[init]`: Specifies initialization logic
- `#[callback]`: Handles responses from other contract calls

#### Contract Context

Each action receives:
- `ContractContext`: Contains caller address, contract address, block information
- Current state
- RPC arguments
- Must return: (Updated state, Vector of EventGroups)

#### Contract Interaction Model

- **Functional Approach**: Each interaction takes input and returns output without side effects
- **Event-Based Communication**: Contracts communicate via events scheduled between transactions
- **Transaction Isolation**: Each transaction is isolated for security

### 3. Implementing Voting in PartiVotes

For a voting platform like PartiVotes, several key components can be leveraged:

#### Authentication Flow

1. **User Connection**: Implement `sdk.connect()` to establish wallet connection
2. **Identity Verification**: Use wallet address as unique identifier
3. **Transaction Signing**: Enable vote submission through signed transactions

#### Voting Contract Example

```rust
#[state]
pub struct VotingState {
    proposal_name: String,
    proposal_description: String,
    eligible_voters: Vec<Address>,
    votes: SortedVecMap<Address, Vote>,
    start_time: Timestamp,
    end_time: Timestamp,
    finalized: bool,
    results: Option<VoteResults>
}

#[action]
pub fn cast_vote(
    context: ContractContext,
    state: VotingState,
    vote_choice: u8,
) -> (VotingState, Vec<EventGroup>) {
    // Verify voter eligibility
    // Record vote
    // Return updated state
}

#[action]
pub fn finalize_vote(
    context: ContractContext,
    state: VotingState,
) -> (VotingState, Vec<EventGroup>) {
    // Check if voting period ended
    // Calculate results
    // Return finalized state
}
```

### 4. Key Files Reference

For deeper exploration, here are the key files in the repository:

1. **Wallet SDK Documentation**:
   - `/core/documentation/developers/dev-tools/wallet-sdk-typescript/README.md`
   - `/core/documentation/developers/dev-tools/wallet-sdk-typescript/integration-guide.md`

2. **Smart Contract Guides**:
   - `/core/documentation/developers/guides/smart-contracts/what-is-a-smart-contract.md`
   - `/core/documentation/developers/guides/smart-contracts/programmers-guide-to-smart-contracts.md`
   - `/core/documentation/developers/guides/smart-contracts/compile-and-deploy-contracts.md`
   - `/core/documentation/developers/guides/smart-contracts/how-to-create-a-vote-from-a-smart-contract.md`

3. **Implementation Examples**:
   - `/language/example-web-client/src/main/shared/ConnectedWallet.ts`
   - `/language/example-web-client/src/main/shared/MpcWalletSignatureProvider.ts`
   - `/language/example-web-client/src/main/token/WalletIntegration.ts`

### 5. Best Practices for Implementation

1. **Security-First Approach**:
   - Never request private keys in production
   - Implement proper error handling for wallet interactions
   - Validate transaction signatures

2. **User Experience**:
   - Show clear connection status
   - Display pending transactions
   - Provide human-readable transaction previews

3. **Error Handling**:
   - Implement automatic retries for wallet connection
   - Display user-friendly error messages
   - Log detailed errors for debugging

4. **Performance Optimization**:
   - Minimize state size in contracts
   - Optimize gas usage in smart contract code
   - Implement proper batching for multiple operations