'use client';

import { useGasPrice } from 'wagmi';
import { formatUnits } from 'viem';

export function useGasEstimation() {
  const { data: gasPrice } = useGasPrice();

  const estimateGasFee = (gasLimit: number) => {
    if (!gasPrice) return null;

    const gasFeeWei = BigInt(gasLimit) * gasPrice;
    const gasFeeEth = parseFloat(formatUnits(gasFeeWei, 18));
    const gasFeeUsd = gasFeeEth * 2000; // Assuming ETH price of $2000

    return {
      gasPrice,
      gasLimit: BigInt(gasLimit),
      gasFeeWei,
      gasFeeEth,
      gasFeeUsd,
      gasPriceGwei: parseFloat(formatUnits(gasPrice, 9)),
    };
  };

  const formatGasPrice = (price: bigint) => {
    return `${parseFloat(formatUnits(price, 9)).toFixed(2)} Gwei`;
  };

  return {
    gasPrice,
    estimateGasFee,
    formatGasPrice,
  };
}

export function useTransactionEstimator() {
  const { estimateGasFee } = useGasEstimation();

  const estimateSimpleStorage = () => {
    return estimateGasFee(50000); // Typical gas limit for simple storage
  };

  const estimateERC20Transfer = () => {
    return estimateGasFee(65000); // Typical gas limit for ERC20 transfer
  };

  const estimateNFTMint = () => {
    return estimateGasFee(150000); // Typical gas limit for NFT mint
  };

  const estimateNFTTransfer = () => {
    return estimateGasFee(100000); // Typical gas limit for NFT transfer
  };

  return {
    estimateSimpleStorage,
    estimateERC20Transfer,
    estimateNFTMint,
    estimateNFTTransfer,
  };
}
