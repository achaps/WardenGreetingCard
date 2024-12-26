Project: Cross-Chain Greeting Card dApp
Description: A simple dApp that allows sending motivational quotes across chains for 2025 using Warden Protocol.

Files to create:
1. GreetingCard.sol
2. index.html
3. script.js

GreetingCard.sol rules:
- Use Solidity version 0.8.0 or higher
- Import necessary Warden Protocol interfaces
- Create a contract named GreetingCard
- Implement functions: storeQuote, retrieveQuote, sendCrossChainQuote
- Use mapping to store quotes with addresses as keys
- Implement GMP for cross-chain functionality

index.html rules:
- Use HTML5 doctype
- Include basic meta tags
- Create a simple form for inputting quotes
- Add buttons for sending and retrieving quotes
- Include placeholders for displaying quotes and transaction status

CSS rules : 
- Make it look super modern with 2024 styles 
- Make it responsive 
- Use matching colors 

script.js rules:
- Use ES6+ syntax
- Import Warden.js and ethers.js
- Implement functions: connectWallet, sendQuote, retrieveQuote, sendCrossChainQuote
- Use async/await for asynchronous operations
- Handle errors and display user-friendly messages
- Update UI elements based on transaction status

General rules:
- Keep code simple and readable
- Add comments to explain key functionalities
- Use consistent indentation and naming conventions
- Prioritize core functionality over advanced features to meet the 1-hour time constraint
