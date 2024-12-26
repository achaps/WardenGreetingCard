# Cross-Chain Greeting Card dApp

A decentralized application that allows users to send motivational quotes across different blockchain networks using Warden Protocol.

## Features

- Send motivational quotes to any address on supported chains
- Retrieve quotes sent to your address
- Cross-chain messaging using Warden Protocol's GMP
- Modern and responsive UI
- MetaMask integration

## Prerequisites

- Node.js and npm installed
- MetaMask browser extension
- Access to supported blockchain networks (Ethereum, Polygon, BSC, Avalanche)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd warden-greeting-card
```

2. Install dependencies:
```bash
npm install
```

3. Deploy the smart contract:
   - Deploy `GreetingCard.sol` to your desired network
   - Update `CONTRACT_ADDRESS` in `script.js` with your deployed contract address

4. Start the development server:
```bash
npm start
```

## Usage

1. Connect your wallet using MetaMask
2. Enter your motivational quote
3. Select the destination chain
4. Enter the recipient's address
5. Click "Send Quote" to send your message
6. Use "Retrieve Quote" to view quotes sent to your address

## Smart Contract

The `GreetingCard.sol` contract is deployed on multiple chains and uses Warden Protocol's GMP (General Message Passing) for cross-chain communication.

### Key Functions

- `storeQuote`: Store a quote locally
- `retrieveQuote`: Get a quote for a specific address
- `sendCrossChainQuote`: Send a quote to another chain

## Security

- The contract uses Solidity 0.8.0+ for built-in overflow protection
- Only the GMP contract can handle cross-chain messages
- Input validation on both frontend and contract level

## Contributing

Feel free to submit issues and pull requests.

## License

MIT 