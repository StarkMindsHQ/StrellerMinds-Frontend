'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { Abi } from 'viem';
import { toast } from 'sonner';
import { SIMPLE_STORAGE_ABI, ERC20_ABI, NFT_ABI } from './contracts';
import { SAMPLE_CONTRACTS } from './contracts';
import { useChainId } from 'wagmi';

// Simple Storage Contract Hook
export function useSimpleStorage() {
  const { writeContract, isPending, data: hash } = useWriteContract();
  const chainId = useChainId();
  
  const contractAddress = SAMPLE_CONTRACTS.sepolia.simpleStorage; // Default to Sepolia

  const storeValue = async (value: number) => {
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: SIMPLE_STORAGE_ABI as Abi,
        functionName: 'store',
        args: [BigInt(value)],
      });
      toast.success('Transaction submitted!');
    } catch (error) {
      toast.error('Failed to store value');
      console.error('Store value error:', error);
    }
  };

  const { data: storedValue, isLoading: isReading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SIMPLE_STORAGE_ABI as Abi,
    functionName: 'retrieve',
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    storeValue,
    storedValue,
    isPending,
    isReading,
    isConfirming,
    isConfirmed,
    hash,
  };
}

// ERC20 Token Contract Hook
export function useERC20Token(contractAddress: `0x${string}`) {
  const { writeContract, isPending, data: hash } = useWriteContract();

  const transfer = async (to: `0x${string}`, amount: string) => {
    try {
      writeContract({
        address: contractAddress,
        abi: ERC20_ABI as Abi,
        functionName: 'transfer',
        args: [to, BigInt(amount)],
      });
      toast.success('Transfer submitted!');
    } catch (error) {
      toast.error('Failed to transfer tokens');
      console.error('Transfer error:', error);
    }
  };

  const approve = async (spender: `0x${string}`, amount: string) => {
    try {
      writeContract({
        address: contractAddress,
        abi: ERC20_ABI as Abi,
        functionName: 'approve',
        args: [spender, BigInt(amount)],
      });
      toast.success('Approval submitted!');
    } catch (error) {
      toast.error('Failed to approve tokens');
      console.error('Approve error:', error);
    }
  };

  const { data: balance, isLoading: isReadingBalance } = useReadContract({
    address: contractAddress,
    abi: ERC20_ABI as Abi,
    functionName: 'balanceOf',
    args: ['0x0000000000000000000000000000000000000000'], // Replace with actual address
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    transfer,
    approve,
    balance,
    isPending,
    isReadingBalance,
    isConfirming,
    isConfirmed,
    hash,
  };
}

// NFT Contract Hook
export function useNFTContract(contractAddress: `0x${string}`) {
  const { writeContract, isPending, data: hash } = useWriteContract();

  const mintNFT = async (tokenURI: string) => {
    try {
      writeContract({
        address: contractAddress,
        abi: NFT_ABI as Abi,
        functionName: 'mintNFT',
        args: [tokenURI],
      });
      toast.success('NFT mint submitted!');
    } catch (error) {
      toast.error('Failed to mint NFT');
      console.error('Mint NFT error:', error);
    }
  };

  const transferNFT = async (to: `0x${string}`, tokenId: number) => {
    try {
      writeContract({
        address: contractAddress,
        abi: NFT_ABI as Abi,
        functionName: 'safeTransferFrom',
        args: ['0x0000000000000000000000000000000000000000', to, BigInt(tokenId)], // Replace with actual from address
      });
      toast.success('NFT transfer submitted!');
    } catch (error) {
      toast.error('Failed to transfer NFT');
      console.error('Transfer NFT error:', error);
    }
  };

  const { data: tokenURI, isLoading: isReading } = useReadContract({
    address: contractAddress,
    abi: NFT_ABI as Abi,
    functionName: 'tokenURI',
    args: [BigInt(1)], // Replace with actual token ID
  });

  const { data: balance, isLoading: isReadingBalance } = useReadContract({
    address: contractAddress,
    abi: NFT_ABI as Abi,
    functionName: 'balanceOf',
    args: ['0x0000000000000000000000000000000000000000'], // Replace with actual address
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    mintNFT,
    transferNFT,
    tokenURI,
    balance,
    isPending,
    isReading,
    isReadingBalance,
    isConfirming,
    isConfirmed,
    hash,
  };
}
