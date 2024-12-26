const CONTRACT_ADDRESS = "0x5bB42DB6114b5CC7292778584907fb29A1E319Ce";

const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "gateway_",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "gasService_",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "destinationChain",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "recipient",
                "type": "string"
            }
        ],
        "name": "CrossChainQuoteSent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "quote",
                "type": "string"
            }
        ],
        "name": "QuoteStored",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "sourceChain",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "sourceAddress",
                "type": "string"
            },
            {
                "internalType": "bytes",
                "name": "payload",
                "type": "bytes"
            }
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gasService",
        "outputs": [
            {
                "internalType": "contract IAxelarGasService",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gateway",
        "outputs": [
            {
                "internalType": "contract IAxelarGateway",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "retrieveQuote",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "destinationChain",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "destinationAddress",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_quote",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "wardenRouterAddress",
                "type": "string"
            }
        ],
        "name": "sendCrossChainQuote",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_quote",
                "type": "string"
            }
        ],
        "name": "storeQuote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "quotes",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Chain configurations
const CHAIN_CONFIG = {
    "sepolia": {
        chainId: "11155111",
        name: "sepolia",
        wardenRouter: "0xe432150cce91c13a887f7D836923d5597adD8E31"
    },
    "ethereum": {
        chainId: "1",
        name: "ethereum",
        wardenRouter: "0xe432150cce91c13a887f7D836923d5597adD8E31"
    },
    "polygon": {
        chainId: "137",
        name: "polygon",
        wardenRouter: "0xe432150cce91c13a887f7D836923d5597adD8E31"
    },
    "binance": {
        chainId: "56",
        name: "binance",
        wardenRouter: "0xe432150cce91c13a887f7D836923d5597adD8E31"
    },
    "avalanche": {
        chainId: "43114",
        name: "avalanche",
        wardenRouter: "0xe432150cce91c13a887f7D836923d5597adD8E31"
    }
};

let provider, signer, contract;
let isConnected = false;
let selectedChain = "sepolia"; // Default to Sepolia testnet

// UI Elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletStatus = document.getElementById('walletStatus');
const quoteInput = document.getElementById('quote');
const networkCarousel = document.getElementById('networkCarousel');
const recipientAddress = document.getElementById('recipientAddress');
const sendQuoteBtn = document.getElementById('sendQuote');
const retrieveQuoteBtn = document.getElementById('retrieveQuote');
const statusDiv = document.getElementById('status');
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteList = document.getElementById('quoteList');

// Event Listeners
connectWalletBtn.addEventListener('click', connectWallet);
sendQuoteBtn.addEventListener('click', sendQuote);
retrieveQuoteBtn.addEventListener('click', retrieveQuote);

// Network selection
const networkOptions = document.querySelectorAll('.network-option');
networkOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        networkOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update selected chain
        selectedChain = option.dataset.chain;
    });
});

// Select Sepolia by default
document.querySelector('[data-chain="sepolia"]').classList.add('selected');

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('Please install MetaMask to use this dApp');
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        
        const address = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        isConnected = true;
        walletStatus.textContent = `Connected: ${address.substring(0, 6)}...${address.substring(38)}`;
        connectWalletBtn.textContent = 'Connected';
        updateUIState();
        showStatus('Wallet connected successfully!', 'success');
    } catch (error) {
        showStatus(error.message, 'error');
    }
}

async function sendQuote() {
    if (!isConnected) {
        showStatus('Please connect your wallet first', 'error');
        return;
    }

    try {
        const quote = quoteInput.value.trim();
        const recipient = recipientAddress.value.trim();
        const chainInfo = CHAIN_CONFIG[selectedChain];

        if (!quote || !recipient) {
            throw new Error('Please fill in all fields');
        }

        if (!ethers.utils.isAddress(recipient)) {
            throw new Error('Invalid recipient address');
        }

        showStatus('Sending quote...', 'success');
        
        // Valeur minimale pour les frais cross-chain
        const minGasValue = ethers.utils.parseEther("0.001");
        
        // Estimate gas needed for the cross-chain transaction
        console.log('Estimating gas with minimum value:', ethers.utils.formatEther(minGasValue), 'sETH');
        const gasEstimate = await contract.estimateGas.sendCrossChainQuote(
            chainInfo.name,
            recipient,
            quote,
            chainInfo.wardenRouter,
            { value: minGasValue }
        );
        console.log('Estimated gas:', gasEstimate.toString());

        console.log('Sending transaction...');
        const tx = await contract.sendCrossChainQuote(
            chainInfo.name,
            recipient,
            quote,
            chainInfo.wardenRouter,
            { 
                value: minGasValue,
                gasLimit: gasEstimate.mul(120).div(100)
            }
        );
        
        console.log('Transaction hash:', tx.hash);
        console.log('Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        // Créer un lien vers Sepolia Scan
        const sepoliaScanLink = `https://sepolia.etherscan.io/tx/${tx.hash}`;
        showStatus(`Quote sent successfully! View on <a href="${sepoliaScanLink}" target="_blank">Sepolia Scan</a>`, 'success');
        
        // Ajouter à l'historique après l'envoi réussi
        addQuoteToHistory(quote, 'sent', chainInfo.name);
        
        clearForm();
    } catch (error) {
        console.error('Error sending quote:', error);
        if (error.message.includes('insufficient funds')) {
            showStatus('Error: Gas value too low for cross-chain message. Try increasing the amount.', 'error');
        } else {
            showStatus(`Error: ${error.message}`, 'error');
        }
    }
}

async function retrieveQuote() {
    if (!isConnected) {
        showStatus('Please connect your wallet first', 'error');
        return;
    }

    try {
        const address = await signer.getAddress();
        console.log('Retrieving quote for address:', address);
        
        // Vérifier que le contrat est bien initialisé
        if (!contract) {
            throw new Error('Contract not initialized');
        }
        
        console.log('Contract address:', contract.address);
        
        // Vérifier que nous sommes sur le bon réseau (Sepolia)
        const network = await provider.getNetwork();
        console.log('Current network:', network);
        
        if (network.chainId !== 11155111) { // Sepolia chainId
            throw new Error('Please switch to Sepolia network to retrieve quotes');
        }

        // Vérifier que le contrat existe et a du code
        const code = await provider.getCode(contract.address);
        console.log('Contract bytecode:', code);
        
        if (code === '0x' || code === '0x0') {
            throw new Error(`No contract found at address ${contract.address}. Please make sure you're using the correct contract address and network.`);
        }

        // Essayer d'abord de récupérer la quote avec la fonction retrieveQuote
        console.log('Attempting to retrieve quote...');
        try {
            const quote = await contract.retrieveQuote(address);
            console.log('Retrieved quote:', quote);
            
            if (quote && quote !== '') {
                quoteDisplay.textContent = quote;
                quoteDisplay.style.display = 'block';
                showStatus('Quote retrieved successfully!', 'success');
                
                // Ajouter à l'historique
                addQuoteToHistory(quote, 'received');
            } else {
                showStatus('No quote found for your address. Try sending one first!', 'info');
                quoteDisplay.style.display = 'none';
            }
        } catch (retrieveError) {
            console.error('Error calling retrieveQuote:', retrieveError);
            
            // Si retrieveQuote échoue, essayons avec le mapping quotes directement
            console.log('Trying to access quotes mapping directly...');
            const quote = await contract.quotes(address);
            console.log('Quote from mapping:', quote);
            
            if (quote && quote !== '') {
                quoteDisplay.textContent = quote;
                quoteDisplay.style.display = 'block';
                showStatus('Quote retrieved successfully!', 'success');
                
                // Ajouter à l'historique
                addQuoteToHistory(quote, 'received');
            } else {
                showStatus('No quote found for your address. Try sending one first!', 'info');
                quoteDisplay.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error retrieving quote:', error);
        
        // Log plus de détails sur l'erreur
        console.log('Error details:', {
            name: error.name,
            code: error.code,
            message: error.message,
            stack: error.stack,
            data: error.data,
            transaction: error.transaction
        });
        
        if (error.message.includes('network')) {
            showStatus('Please switch to Sepolia network', 'error');
        } else if (error.message.includes('No contract found')) {
            showStatus(error.message, 'error');
        } else {
            showStatus('Error retrieving quote. Please check the console for details.', 'error');
        }
        quoteDisplay.style.display = 'none';
    }
}

function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

function clearForm() {
    quoteInput.value = '';
    recipientAddress.value = '';
}

function updateUIState() {
    const elements = [quoteInput, recipientAddress, sendQuoteBtn, retrieveQuoteBtn];
    elements.forEach(element => {
        element.disabled = !isConnected;
    });
    
    networkOptions.forEach(option => {
        option.style.opacity = isConnected ? '1' : '0.5';
        option.style.pointerEvents = isConnected ? 'auto' : 'none';
    });
}

// Initial UI state
updateUIState(); 

// Fonction pour ajouter une quote à l'historique
function addQuoteToHistory(quote, type, chain = '', timestamp = new Date()) {
    const quoteItem = document.createElement('div');
    quoteItem.className = `quote-item ${type}`;
    
    const formattedDate = new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'short'
    }).format(timestamp);

    quoteItem.innerHTML = `
        <div class="quote-header">
            <span>${type === 'sent' ? 'Sent' : 'Received'}</span>
            <span>${formattedDate}</span>
        </div>
        <div class="quote-content">${quote}</div>
        ${chain ? `<div class="quote-chain">Chain: ${chain}</div>` : ''}
    `;

    quoteList.insertBefore(quoteItem, quoteList.firstChild);
    saveQuoteHistory();
}

// Sauvegarder l'historique dans le localStorage
function saveQuoteHistory() {
    const quotes = Array.from(quoteList.children).map(item => ({
        content: item.querySelector('.quote-content').textContent,
        type: item.classList.contains('sent') ? 'sent' : 'received',
        chain: item.querySelector('.quote-chain')?.textContent.replace('Chain: ', '') || '',
        timestamp: new Date().toISOString()
    }));
    
    localStorage.setItem('quoteHistory', JSON.stringify(quotes));
}

// Charger l'historique depuis le localStorage
function loadQuoteHistory() {
    const history = localStorage.getItem('quoteHistory');
    if (history) {
        const quotes = JSON.parse(history);
        quoteList.innerHTML = ''; // Clear existing items
        quotes.reverse().forEach(quote => {
            addQuoteToHistory(quote.content, quote.type, quote.chain, new Date(quote.timestamp));
        });
    }
}

// Charger l'historique au démarrage
document.addEventListener('DOMContentLoaded', loadQuoteHistory); 