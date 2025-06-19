
import type { Jetton } from "../../utils/tonapi";
import { Verified, AlertTriangle} from "lucide-react";

export default function JettonItem({ jetton }: { jetton: Jetton }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative w-[48px] h-[40px] sm:w-[53px] sm:h-[45px] rounded-full overflow-hidden">
        <img
          src={jetton.image}
          alt={jetton.symbol}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-md sm:text-lg font-medium">{jetton.name}</h2>
          <h2 className="text-white font-semibold text-md sm:text-lg">{jetton.balance}</h2>
        </div>
        <div className="flex flex-row justify-between">
            <h3 className="text-white/60 text-sm sm:text-md">{jetton.symbol}</h3>
            <h3 className="text-white/60 text-sm sm:text-md flex items-center gap-1">
                Score: {jetton.score}
                {jetton.verification === "whitelist" && (
                    <Verified className="w-4 h-4 text-gray-400" strokeWidth={2} />
                )}
                {jetton.verification === "blacklist" && (
                    <AlertTriangle className="w-4 h-4 text-gray-400" strokeWidth={2} />
                )}
            </h3>
        </div>
      </div>
    </div>
  );
}