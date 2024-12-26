// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';

contract GreetingCard is AxelarExecutable {
    IAxelarGasService public immutable gasService;
    
    mapping(address => string) public quotes;
    
    event QuoteStored(address indexed sender, string quote);
    event CrossChainQuoteSent(address indexed sender, string destinationChain, string recipient);
    
    constructor(address gateway_, address gasService_) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasService_);
    }
    
    function storeQuote(string memory _quote) public {
        quotes[msg.sender] = _quote;
        emit QuoteStored(msg.sender, _quote);
    }
    
    function retrieveQuote(address _address) public view returns (string memory) {
        return quotes[_address];
    }
    
    function sendCrossChainQuote(
        string memory destinationChain,
        string memory destinationAddress,
        string memory _quote,
        string memory wardenRouterAddress
    ) external payable {
        // Store quote locally
        storeQuote(_quote);
        
        // Prepare the payload
        bytes memory payload = abi.encode(destinationAddress, _quote);
        
        // Pay for gas
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                wardenRouterAddress,
                payload,
                msg.sender
            );
        }
        
        // Send the message through Axelar GMP
        gateway.callContract(
            destinationChain,
            wardenRouterAddress,
            payload
        );
        
        emit CrossChainQuoteSent(msg.sender, destinationChain, destinationAddress);
    }

    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        // Decode the payload
        (string memory recipient, string memory quote) = abi.decode(payload, (string, string));
        
        // Convert string address to address type
        address recipientAddress = _stringToAddress(recipient);
        
        // Store the quote for the recipient
        quotes[recipientAddress] = quote;
    }
    
    // Helper function to convert string to address
    function _stringToAddress(string memory _address) internal pure returns (address) {
        bytes memory temp = bytes(_address);
        uint160 result = 0;
        
        for (uint i = 2; i < 42; i++) { // Skip '0x' prefix
            uint8 val = uint8(temp[i]);
            if (val >= 48 && val <= 57) {
                val -= 48;
            } else if (val >= 65 && val <= 70) {
                val -= 55;
            } else if (val >= 97 && val <= 102) {
                val -= 87;
            }
            
            result = result * 16 + uint160(val);
        }
        
        return address(result);
    }
} 