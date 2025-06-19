import { useTonConnectModal } from "@tonconnect/ui-react";
import { Wallet } from "lucide-react";

export function NotConnected() {
  const { open } = useTonConnectModal();

  return (
    <div className="max-w-[90vw] sm:max-w-lg mx-auto flex mt-30 flex-col border border-amber-500 items-center text-center bg-black/65 backdrop-blur-md p-8 rounded-3xl shadow-lg space-y-6">
      
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-full">
        <Wallet className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-white text-2xl font-bold">Welcome to Jetton Manager</h2>

      <h3 className="text-white/80 text-lg">
        Connect your wallet to start managing your Jettons.
        Send and burn tokens with ease.
      </h3>

      <button onClick={() => open()} className="bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold px-6 py-2 rounded-xl">
        Connect Wallet
      </button>
    </div>
  );
}