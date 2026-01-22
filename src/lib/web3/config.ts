import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, goerli } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const web3Config = createConfig({
  chains: [mainnet, sepolia, goerli],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [goerli.id]: http(),
  },
});

export const supportedChains = [mainnet, sepolia, goerli];

export const defaultChain = sepolia; // Default to testnet for learning

// Chain configuration for UI
export const chainConfig = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    color: '#627EEA',
    explorer: 'https://etherscan.io',
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    color: '#627EEA',
    explorer: 'https://sepolia.etherscan.io',
  },
  [goerli.id]: {
    name: 'Goerli Testnet',
    color: '#627EEA',
    explorer: 'https://goerli.etherscan.io',
  },
};
