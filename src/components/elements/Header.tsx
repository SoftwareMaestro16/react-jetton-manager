import { TonConnectButton } from "@tonconnect/ui-react";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-orange-900/20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-4">
        
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="hidden sm:inline text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent truncate">
            Jetton Manager
          </h1>
        </div>

        <div className="flex-shrink-0">
          <TonConnectButton />
        </div>

      </div>
    </header>
  );
}