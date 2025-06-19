import type { Jetton } from "../../utils/tonapi";
import { useState } from "react";
import { X } from "lucide-react";
import { useTonConnectUI, useTonWallet, type SendTransactionRequest } from "@tonconnect/ui-react";
import { getJettonWalletAddress, waitForTx } from "../../utils/tonapi";
import { Address, beginCell, Cell } from "@ton/core";

interface Props {
  jettons: Jetton[];
  loading: boolean;
  wallet: any;
}

export function SendJettons({ jettons, loading }: Props) {
  const [transactions, setTransactions] = useState([{ token: "", recipient: "", amount: "" }]);
  const [txInProgress, setTxInProgress] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const addTransaction = () => {
    if (transactions.length < 3) {
      setTransactions([...transactions, { token: "", recipient: "", amount: "" }]);
    }
  };

  const updateTransaction = (index: number, key: string, value: string) => {
    const newTxs = [...transactions];
    (newTxs[index] as any)[key] = value;
    setTransactions(newTxs);
  };

  const removeTransaction = (index: number) => {
    if (transactions.length === 1) return;
    setTransactions((txs) => txs.filter((_, i) => i !== index));
  };

  const closeModal = () => setTxHash(null);

  const onSendTx = async () => {
    if (!wallet || !wallet.account.address) return;

    try {
      setTxInProgress(true);
      const messages: SendTransactionRequest["messages"] = [];

      for (const tx of transactions) {
        if (!tx.token || !tx.recipient || !tx.amount) continue;

        const jwAddress = await getJettonWalletAddress(tx.token, wallet.account.address);
        const amountNano = BigInt(Math.floor(parseFloat(tx.amount) * 1e9));

        const payload = beginCell()
          .storeUint(0x0f8a7ea5, 32)
          .storeUint(0, 64)
          .storeCoins(amountNano)
          .storeAddress(Address.parse(tx.recipient))
          .storeAddress(null)
          .storeMaybeRef()
          .storeCoins(0)
          .storeMaybeRef()
          .endCell()
          .toBoc()
          .toString("base64");

        messages.push({
          address: jwAddress,
          amount: "55000000",
          payload,
        });
      }

      if (messages.length === 0) {
        console.warn("No valid transactions to send");
        setTxInProgress(false);
        return;
      }

      const tx: SendTransactionRequest = {
        validUntil: Math.round(Date.now() / 1000) + 60 * 5,
        messages,
      };

      const result = await tonConnectUI.sendTransaction(tx, {
        modals: "all",
        notifications: ["error"],
      });

      const imMsgCell = Cell.fromBase64(result.boc);
      const inMsgHash = imMsgCell.hash().toString("hex");

      try {
        const tx = await waitForTx(inMsgHash);
        console.log("Transaction result:", tx);
        setTxHash(tx.hash); 
      } catch (e) {
        console.error("Transaction failed to confirm:", e);
      }
    } catch (error) {
      console.error("Error during transaction:", error);
    } finally {
      setTxInProgress(false);
    }
  };

  return loading ? (
    <div className="flex justify-center items-center text-white py-4">Loading...</div>
  ) : (
    <>
      <div className="p-4 bg-[#0e0e0e] border border-amber-600 rounded-lg flex flex-col max-h-[55vh]">
        <h3 className="text-white text-lg font-semibold mb-3">Send Jettons</h3>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {transactions.map((tx, i) => (
            <div
              key={i}
              className="relative border border-amber-300 rounded-lg p-4 bg-[#101010] space-y-3"
            >
              {transactions.length > 1 && (
                <button
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 transition"
                  onClick={() => removeTransaction(i)}
                  aria-label="Remove"
                >
                  <X size={20} className="text-red-400" />
                </button>
              )}

              <select
                className="w-full p-3 bg-[#2a2a2a] text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                value={tx.token}
                onChange={(e) => updateTransaction(i, "token", e.target.value)}
              >
                <option value="">Select token...</option>
                {jettons.map((j) => (
                  <option key={j.address} value={j.address}>
                    {j.name} ({j.symbol}) - {j.balance}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Recipient address"
                className="w-full p-3 bg-[#2a2a2a] text-white rounded-lg"
                value={tx.recipient}
                onChange={(e) => updateTransaction(i, "recipient", e.target.value)}
              />

              <input
                type="number"
                placeholder="Amount"
                className="w-full p-3 bg-[#2a2a2a] text-white rounded-lg"
                value={tx.amount}
                onChange={(e) => updateTransaction(i, "amount", e.target.value)}
              />
            </div>
          ))}
        </div>

        {transactions.length < 3 && (
          <button
            onClick={addTransaction}
            className="w-full mt-4 px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-400 text-black rounded font-semibold transition"
          >
            + Add another
          </button>
        )}

        <button
          onClick={onSendTx}
          className={`mt-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-md ${
            txInProgress
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-400"
          }`}
          disabled={txInProgress || !wallet}
        >
          {txInProgress ? "Sending..." : "Send Jettons"}
        </button>
      </div>

      {txHash && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-orange-500 rounded-xl p-6 max-w-sm w-full text-center relative"
          >
            <button
              className="absolute top-2 right-2 text-white hover:text-red-400 transition"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-white text-xl font-semibold mb-4">Transaction Successful</h2>
            <a
              href={`https://testnet.tonviewer.com/transaction/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 border border-orange-500 bg-black text-white rounded-lg hover:bg-orange-600 transition"
            >
              View in TonViewer
            </a>
          </div>
        </div>
      )}
    </>
  );
}