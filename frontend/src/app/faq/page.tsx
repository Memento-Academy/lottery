"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-8 text-center">
        Frequently Asked <span className="text-cyan-400">Questions</span>
      </h1>

      <div className="space-y-8">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem
            value="item-1"
            className="border border-white/10 rounded-lg bg-slate-900/50 px-4"
          >
            <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline">
              <span>Is it really free?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              <p>
                <strong>Yes, currently!</strong> The initial ticket price is set
                to <span className="text-white font-mono">0 ETH</span>.
              </p>
              <p className="mt-2">
                However, the contract is designed to allow price adjustments in
                future rounds. If the community decides to increase the jackpot
                pool, a small ticket price (e.g., 0.001 ETH) might be
                introduced. For now, enjoy the free entry!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border border-white/10 rounded-lg bg-slate-900/50 px-4"
          >
            <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline">
              <span>Do I need to pay for Gas?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              <p>
                <strong>No!</strong> Gas fees are fully sponsored.
              </p>
              <p className="mt-2">
                We use <span className="text-white">Account Abstraction</span>{" "}
                (powered by ZeroDev) to pay the gas fees for you. This means you
                can enter the lottery without having any ETH in your wallet for
                transaction fees (though you might need ETH if the ticket price
                is ever &gt; 0).
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border border-white/10 rounded-lg bg-slate-900/50 px-4"
          >
            <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline">
              <span>Is it fair/random?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              Absolutely. The lottery runs on the{" "}
              <strong>Sepolia Testnet</strong>. The winner is selected using an
              on-chain pseudo-random mechanism (based on block timestamp and
              difficulty). While not as robust as Chainlink VRF (yet), it is
              fully transparent and verifiable on the blockchain.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="border border-white/10 rounded-lg bg-slate-900/50 px-4"
          >
            <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline">
              <span>When are winners selected?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              <p>
                The lottery is designed to run{" "}
                <strong>fully automatically</strong>.
              </p>
              <p className="mt-2">
                We use <span className="text-white">Chainlink Automation</span>{" "}
                to trigger the draw every 72 hours (by default during weekends).
                The smart contract independently selects a winner without any
                manual intervention.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="border border-white/10 rounded-lg bg-slate-900/50 px-4"
          >
            <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline">
              <span>How do I claim my prize?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              <p>
                <strong>You don&apos;t have to!</strong>
              </p>
              <p className="mt-2">
                Unlike other platforms that require a manual &quot;Claim&quot;
                transaction (and more gas), our contract{" "}
                <strong>automatically transfers</strong> the prize directly to
                the winner&apos;s wallet the moment the draw is completed.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-6"
            className="border border-white/10 rounded-lg bg-slate-900/50 px-4"
          >
            <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline">
              <span>Can I verify the contract code?</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              Yes! The entire project is open source. You can view the smart
              contract code on our GitHub repository or inspect the verified
              contract on Etherscan (Sepolia) to see exactly how it works.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
