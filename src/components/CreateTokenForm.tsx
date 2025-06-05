'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from '@solana/spl-token';

type TokenForm = {
  name: string;
  symbol: string;
  description: string;
  website: string;
  xLink: string;
  telegram: string;
};

export default function CreateTokenForm() {
  const [form, setForm] = useState<TokenForm>({
    name: '',
    symbol: '',
    description: '',
    website: '',
    xLink: '',
    telegram: '',
  });
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !sendTransaction) {
      alert('Connect your wallet first!');
      return;
    }

    try {
      // 1) Generate a new Keypair for the mint
      const mint = Keypair.generate();

      // 2) Calculate rent-exempt balance for a Mint account (82 bytes)
      const lamports = await connection.getMinimumBalanceForRentExemption(82);

      // 3) Create and initialize the Mint (decimals = 0, you as mint & freeze authority)
      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          space: 82,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mint.publicKey,
          0, // decimals
          publicKey, // mint authority
          publicKey  // freeze authority
        )
      );

      // 4) Derive your Associated Token Account (ATA) for this mint
      const ata = await getAssociatedTokenAddress(mint.publicKey, publicKey);

      // 5) Add instructions to create the ATA and mint initial supply
      tx.add(
        createAssociatedTokenAccountInstruction(
          publicKey,        // payer
          ata,              // ATA to create
          publicKey,        // ATA owner
          mint.publicKey    // the mint
        ),
        createMintToInstruction(
          mint.publicKey,   // mint
          ata,              // destination ATA
          publicKey,        // mint authority
          1_000_000_000     // amount to mint (since decimals = 0)
        )
      );

      // 6) Revoke mint authority (set to null)
      tx.add(
        createSetAuthorityInstruction(
          mint.publicKey,            // the mint
          publicKey,                 // current mint authority
          AuthorityType.MintTokens,  // revoke the "mint tokens" authority
          null                       // new authority = null
        )
      );

      // 7) Revoke freeze authority (set to null)
      tx.add(
        createSetAuthorityInstruction(
          mint.publicKey,               // the mint
          publicKey,                    // current freeze authority
          AuthorityType.FreezeAccount,  // revoke the "freeze account" authority
          null                          // new authority = null
        )
      );

      // 8) Send and confirm the transaction
      const signature = await sendTransaction(tx, connection, {
        signers: [mint],
      });
      await connection.confirmTransaction(signature, 'confirmed');
      setMintAddress(mint.publicKey.toBase58());
    } catch (err) {
      console.error('❌ Error minting token:', err);
      alert('Something went wrong. Check the console.');
    }

    // Reset form fields
    setForm({
      name: '',
      symbol: '',
      description: '',
      website: '',
      xLink: '',
      telegram: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mt-2 px-3 py-6 text-white"
    >
      {/* Heading */}
      <div className="sm:col-span-2">
        <h1
          className="text-center text-2xl font-bold"
          style={{ color: '#28a745' }}
        >
          [ Launch your own token on Rugoff.fun ]
        </h1>
      </div>

      {/* 1. Token Name / Ticker */}
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 text-sm font-medium">
          Token Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter token name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="symbol" className="mb-1 text-sm font-medium">
          Ticker Symbol
        </label>
        <input
          id="symbol"
          name="symbol"
          type="text"
          placeholder="Enter ticker"
          value={form.symbol}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
        />
      </div>

      {/* 2. Single Description */}
      <div className="sm:col-span-2 flex flex-col">
        <label htmlFor="description" className="mb-1 text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Enter description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
        />
      </div>

      {/* 3. Single Image Upload */}
      <div className="sm:col-span-2 flex flex-col">
        <label htmlFor="img" className="mb-1 text-sm font-medium">
          Upload Image
        </label>
        <label
          htmlFor="img"
          className="flex items-center justify-center border-2 border-dotted border-gray-600 rounded-md w-full h-24 cursor-pointer bg-transparent"
        >
          <img src="/upload.svg" alt="Upload" className="h-8 w-8" />
        </label>
        <input
          id="img"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={() => {
            /* optionally handle file preview */
          }}
        />
      </div>

      {/* 4. More Options Dropdown */}
      <div className="sm:col-span-2">
        <details className="pt-4">
          <summary className="cursor-pointer text-sm font-medium">
            More Options
          </summary>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="website" className="mb-1 text-sm font-medium">
                Website URL
              </label>
              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://"
                value={form.website}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="xLink" className="mb-1 text-sm font-medium">
                X (Twitter) URL
              </label>
              <input
                id="xLink"
                name="xLink"
                type="url"
                placeholder="https://x.com/yourhandle"
                value={form.xLink}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="telegram" className="mb-1 text-sm font-medium">
                Telegram URL
              </label>
              <input
                id="telegram"
                name="telegram"
                type="url"
                placeholder="https://t.me/yourchannel"
                value={form.telegram}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </details>
      </div>

      {/* Submit Button */}
      <div className="sm:col-span-2 flex justify-center">
        <button
          type="submit"
          className="bg-[#008f17] hover:bg-[#007a13] text-white w-full font-bold py-3 px-6 rounded-lg shadow transition-colors duration-200"
        >
          Create Token
        </button>
      </div>

      {/* Result */}
      {mintAddress && (
        <div className="sm:col-span-2 mt-6 p-4 bg-green-900 text-white rounded text-center">
          🎉 Token Created!<br />
          Mint Address: <code className="break-all text-sm">{mintAddress}</code>
        </div>
      )}
    </form>
  );
}
