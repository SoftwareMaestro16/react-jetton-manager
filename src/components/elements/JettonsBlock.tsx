import { useEffect, useState } from "react";
import { fetchJettons, type Jetton } from "../../utils/tonapi";
import JettonItem from "../shared/JettonItem";
import { Loader2 } from "lucide-react";
import { shortAddress } from "../../utils/shortAddress";

interface Props {
  address: string;
}

export function JettonsBlock({ address }: Props) {
  const [jettons, setJettons] = useState<Jetton[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setLoading(true);
      fetchJettons(address)
        .then(setJettons)
        .finally(() => setLoading(false));
    } else {
      setJettons(null);
      setLoading(false);
    }
  }, [address]);

  return (
    <div className="max-w-[92vw] sm:max-w-[30vw] border border-amber-500 bg-black/65 backdrop-blur-md p-5 sm:p-8 rounded-3xl shadow-lg">
      <h1 className="text-white text-2xl font-semibold mb-4 break-all border-b-1 pb-2 sm:pb-4 border-amber-500">Jettons: {shortAddress(address)}</h1>

      {loading && (
        <div className="flex justify-center items-center text-white py-6">
          <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading jettons...
        </div>
      )}

      {!loading && jettons && jettons.length > 0 && (
        <div className="flex flex-col">
          {jettons.map((jetton) => (
            <JettonItem key={jetton.address} jetton={jetton} />
          ))}
        </div>
      )}

      {!loading && jettons && jettons.length === 0 && (
        <p className="text-white/60 text-center">No jettons found.</p>
      )}
    </div>
  );
}