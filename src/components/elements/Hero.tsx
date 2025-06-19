import { toUserFriendlyAddress, useTonWallet } from "@tonconnect/ui-react";
import { NotConnected } from "../shared/NotConnected";
import { JettonsBlock } from "./JettonsBlock";
import { Operations } from "./Operations";

export function Hero() {
    const wallet = useTonWallet();

    return (
        <>
            {!wallet ? <NotConnected /> : 
            <div className="mt-12 sm:mt-30 flex flex-col sm:flex-row justify-center items-start gap-6 mx-auto">
                <div>
                    <JettonsBlock address={toUserFriendlyAddress(wallet.account.address)} />
                </div>
                <div>
                    <Operations address={toUserFriendlyAddress(wallet.account.address)} />
                </div>
            </div>
            }
        </>
    );
}