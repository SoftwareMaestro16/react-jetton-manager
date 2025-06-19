import { useEffect, useState } from "react";
import { fetchJettons, type Jetton } from "../../utils/tonapi";
import { useTonWallet } from "@tonconnect/ui-react";
import { SendJettons } from "../shared/SendJettons";
import { BurnJettons } from "../shared/BurnJettons";

interface Props {
  address: string;
}

export function Operations({ address }: Props) {
  const [activeTab, setActiveTab] = useState<"Send" | "Burn">("Send");
  const [jettons, setJettons] = useState<Jetton[]>([]);
  const [loading, setLoading] = useState(false);
  const wallet = useTonWallet();
//   const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const fetchData = async () => {
      if (!address) {
        setJettons([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchJettons(address);
        setJettons(data || []);
      } catch (error) {
        console.error("Failed to fetch jettons:", error);
        setJettons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [address]);

  return (
    <div className="max-w-[92vw] sm:max-w-[30vw] bg-black/65 border border-orange-500 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
      <h1 className="text-white text-2xl font-bold mb-6 border-b border-orange-500 pb-3 text-center">
        Operations
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        {["Send", "Burn"].map((tab) => (
          <button
            key={tab}
            className={`px-8 py-2 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                : "bg-black/90 border-amber-600 border text-gray-300 hover:border-amber-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab as "Send" | "Burn")}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Send" ? (
        <SendJettons jettons={jettons} loading={loading} wallet={wallet} />
      ) : (
        <BurnJettons jettons={jettons} loading={loading} />
      )}
    </div>
  );
}