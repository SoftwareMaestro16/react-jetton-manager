import { TonApiClient } from "@ton-api/client";
import { Address } from "@ton/core";

export interface Jetton {
    address: string;
    name: string;
    symbol: string;
    image: string;
    verification: string;
    score: number;
    balance: number; 
}
  
interface RawJettonItem {
    balance: string;
    jetton: {
        address: string;
        name: string;
        symbol: string;
        image: string;
        verification: string;
        score: number;
        decimals: number;
    };
}

export const tonapi = new TonApiClient({
  baseUrl: "https://testnet.tonapi.io",
  apiKey: "AGI2S5NMZM573CAAAAAA7H6N3CDNHKCHIKNBGJ3D2RSAJPHJCDZ2R3VZPGGMIAOSEEZ4CGI",
});

export async function waitForTx(msgHash: string, attempt = 0) {
  try {
    return await tonapi.blockchain.getBlockchainTransactionByMessageHash(msgHash);
  } catch (e) {
    if (attempt >= 10) {
      throw e;
    }
    await new Promise(res => setTimeout(res, 1500));
    return waitForTx(msgHash, attempt + 1);
  }
}

export async function getJettonWalletAddress(jettonMasterAddress: string, walletAddress: string) {
  const result = await tonapi.blockchain.execGetMethodForBlockchainAccount(
    Address.parse(jettonMasterAddress),
    "get_wallet_address",
    { args: [walletAddress] }
  );
  return result.decoded.jetton_wallet_address;
}
  
export async function fetchJettons(address: string): Promise<Jetton[] | null> {
    if (!address) return null;
  
    try {
      const res = await fetch(`https://testnet.tonapi.io/v2/accounts/${address}/jettons`);
  
      if (!res.ok) {
        console.error("Ошибка при запросе jettons:", res.statusText);
        return null;
      }
  
      const data = await res.json();
  
      if (!data.balances || !Array.isArray(data.balances)) return null;
  
      const jettons: Jetton[] = data.balances
        .filter((item: RawJettonItem) => {
          const rawBalance = BigInt(item.balance || "0");
          return rawBalance > 0n;
        })
        .map((item: RawJettonItem) => {
          const raw = BigInt(item.balance || "0");
          const decimals = item.jetton.decimals || 0;
          const balance = Number(raw) / 10 ** decimals;
  
          return {
            address: item.jetton.address,
            name: item.jetton.name,
            symbol: item.jetton.symbol,
            image: item.jetton.image,
            verification: item.jetton.verification,
            score: item.jetton.score,
            balance,
          };
        });
  
      return jettons;
    } catch (err) {
      console.error("Ошибка при загрузке jettons:", err);
      return null;
    }
}
  
