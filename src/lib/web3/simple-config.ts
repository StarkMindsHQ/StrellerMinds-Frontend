import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const web3Config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const supportedChains = [mainnet, sepolia];

export const defaultChain = sepolia;

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
};
