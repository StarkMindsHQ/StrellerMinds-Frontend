# Web3 Environment Setup

This document explains how to set up the environment variables needed for Web3 functionality in StrellerMinds.

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# WalletConnect Project ID (Required)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Optional: Custom RPC URLs for better performance
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.alchemyapi.io/v2/your-api-key
NEXT_PUBLIC_GOERLI_RPC_URL=https://eth-goerli.alchemyapi.io/v2/your-api-key

# Optional: Infura Project ID (backup RPC provider)
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id_here
```

## Getting Required Credentials

### 1. WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID
5. Add it to your `.env.local` file

### 2. Alchemy API Keys (Optional but Recommended)

1. Go to [Alchemy](https://dashboard.alchemy.com/)
2. Sign up or log in
3. Create a new app
4. Select Ethereum Mainnet and Sepolia testnet
5. Copy the API key for each network
6. Add them to your `.env.local` file

### 3. Infura Project ID (Optional)

1. Go to [Infura](https://infura.io/)
2. Sign up or log in
3. Create a new project
4. Select Ethereum
5. Copy the Project ID
6. Add it to your `.env.local` file

## Network Configuration

The application supports the following networks:

- **Ethereum Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111) - Default for learning
- **Goerli Testnet** (Chain ID: 5)

## Smart Contract Deployment

For the interactive demos to work, you need to deploy the sample smart contracts:

### Simple Storage Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    function store(uint256 _newValue) public {
        storedData = _newValue;
    }

    function retrieve() public view returns (uint256) {
        return storedData;
    }
}
```

### ERC20 Token Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
```

### NFT Contract (ERC721)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
```

## Testing

1. Deploy contracts to Sepolia testnet
2. Update contract addresses in `/src/lib/web3/contracts.ts`
3. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
4. Connect your wallet and test the functionality

## Security Notes

- Never commit `.env.local` to version control
- Use different API keys for development and production
- Monitor your API usage and set appropriate limits
- Keep your private keys secure

## Troubleshooting

### Common Issues

1. **"WalletConnect project ID not found"**
   - Ensure your `.env.local` file contains the correct WalletConnect Project ID
   - Restart your development server after adding environment variables

2. **"Network not supported"**
   - Switch to one of the supported networks (Ethereum, Sepolia, Goerli)
   - Check that your wallet is configured for the correct network

3. **"Insufficient funds for gas"**
   - Ensure you have enough ETH in your wallet
   - For testnets, use a faucet to get test ETH

4. **"Transaction failed"**
   - Check the contract address is correct
   - Ensure you're on the correct network
   - Verify the function parameters are valid

## Support

For additional help:

- Check the [wagmi documentation](https://wagmi.sh/)
- Review the [viem documentation](https://viem.sh/)
- Join our Discord community
- Open an issue on GitHub
