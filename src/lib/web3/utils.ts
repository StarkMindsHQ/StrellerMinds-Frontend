import { formatEther, parseEther, formatUnits, parseUnits } from 'viem';

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: bigint, decimals: number = 18): string {
  return parseFloat(formatUnits(balance, decimals)).toFixed(4);
}

export function parseBalance(balance: string, decimals: number = 18): bigint {
  return parseUnits(balance, decimals);
}

export function formatEtherBalance(balance: bigint): string {
  return `${parseFloat(formatEther(balance)).toFixed(4)} ETH`;
}

export function formatGasPrice(gasPrice: bigint): string {
  return `${formatUnits(gasPrice, 9)} Gwei`;
}

export function formatTransactionHash(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function getExplorerUrl(
  hash: string,
  type: 'tx' | 'address' | 'block',
  chainId: number,
): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    5: 'https://goerli.etherscan.io',
  };

  const baseUrl = explorers[chainId] || explorers[1];
  return `${baseUrl}/${type}/${hash}`;
}

export function waitForTransaction(
  hash: string,
  checkInterval: number = 1000,
  timeout: number = 60000,
): Promise<{ status: 'success' | 'failed'; receipt?: any }> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkTransaction = async () => {
      try {
        // This would be implemented with actual provider
        // const receipt = await provider.getTransactionReceipt(hash);
        // if (receipt) {
        //   resolve({
        //     status: receipt.status === 1 ? 'success' : 'failed',
        //     receipt
        //   });
        //   return;
        // }

        if (Date.now() - startTime > timeout) {
          reject(new Error('Transaction timeout'));
          return;
        }

        setTimeout(checkTransaction, checkInterval);
      } catch (error) {
        reject(error);
      }
    };

    checkTransaction();
  });
}

export function calculateGasFee(gasLimit: bigint, gasPrice: bigint): string {
  const gasFee = gasLimit * gasPrice;
  return formatEther(gasFee);
}
