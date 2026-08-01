import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";

const Landing = () => {
  const [longUrl, setLongUrl] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/signup?createNew=${encodeURIComponent(longUrl)}`);
    }
  };

  const faqs = [
    {
      q: "Why are my links so embarrassingly long?",
      a: "Because the internet wasn't built with aesthetics in mind. That's where we come in — paste your monster URL and we'll hand you back something clean, short, and actually shareable.",
    },
    {
      q: "Do I need an account?",
      a: "Yep. But it takes 10 seconds, and in return you get a full dashboard, click analytics, custom slugs, and the satisfaction of knowing your links don't look like a keyboard smash.",
    },
    {
      q: "Can I customize my short URL?",
      a: "Absolutely. Instead of a random string, you can pick your own slug — like snip.ly/launch or snip.ly/myportfolio. Make it memorable, make it yours.",
    },
    {
      q: "What kind of analytics do I get?",
      a: "Every click tracked. You'll see total clicks, where in the world people are clicking from, and whether they're on mobile or desktop. Real data, zero guesswork.",
    },
    {
      q: "Is there a limit on how many links I can create?",
      a: "Go wild. Create as many links as you need — there's no artificial cap holding you back.",
    },
  ];

  return (
    <div className="w-full bg-canvas text-white font-sans overflow-x-hidden min-h-screen flex flex-col items-center px-4 py-8">
      <h2 className="my-10 sm:my-16 text-3.5xl sm:text-5xl lg:text-7xl text-white text-center font-extrabold tracking-tighter leading-tight max-w-4xl">
        Your links were ugly. <br /> We fixed that. You&rsquo;re welcome. 🔥
      </h2>

      <form
        onSubmit={handleShorten}
        className="flex flex-col sm:flex-row w-full md:w-2/4 gap-2 bg-surface-card p-2 rounded-xl border border-hairline focus-within:border-primary transition-all shadow-2xl"
      >
        <input
          type="url"
          placeholder="Enter your loooong URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none"
          required
        />
        <button
          type="submit"
          className="rounded bg-primary hover:bg-primary-active px-8 py-3.5 font-bold text-black transition-colors cursor-pointer text-sm whitespace-nowrap"
        >
          Shorten!
        </button>
      </form>

      <div className="w-full md:w-3/4 max-w-5xl my-11 md:px-11 flex justify-center h-[500px]">
        <img
          src="/banner.png"
          alt="Developer Shortener Dashboard Mockup"
          className="w-full rounded-2xl border border-hairline shadow-2xl opacity-90 object-cover"
        />
      </div>

      {/* ─── Custom FAQ Accordion Section (No Shadcn UI) ─── */}
      <div className="w-full md:w-2/4 max-w-4xl my-12 md:px-11 space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div
              key={index}
              className="rounded-lg border border-hairline bg-surface-card overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp size={18} className="text-primary" />
                ) : (
                  <ChevronDown size={18} className="text-zinc-400" />
                )}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-40 border-t border-hairline p-6 bg-surface-soft/40"
                    : "max-h-0 overflow-hidden"
                }`}
              >
                <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Landing;
