
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  MessageCircle,
  Send,
  MapPin,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mailto = `mailto:support@touchline.com?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;

    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#050403] text-[#f0ebe0]">
      {/* Navigation */}
      <nav className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#f0ebe0]/50 transition hover:text-[#b8924a]"
          >
            <ArrowLeft size={16} />
            Back home
          </Link>

          <Link href="/" className="text-xl font-semibold tracking-[0.2em]">
            TOUCH<span className="text-[#b8924a]">LINE</span>
          </Link>

          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-[#b8924a] sm:block">
            Get in touch
          </span>
        </div>
      </nav>

      {/* Content */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left */}
          <div>
            <span className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#b8924a]">
              <span className="h-px w-8 bg-[#b8924a]" />
              Contact us
            </span>

            <h1 className="mt-7 font-serif text-5xl leading-tight sm:text-6xl">
              Let's start a
              <br />
              <span className="italic text-[#b8924a]">conversation.</span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-[#f0ebe0]/50">
              Have a question, need assistance or want to learn more about
              Touchline? We would love to hear from you.
            </p>

            <div className="mt-14 space-y-8">
              <a
                href="mailto:support@touchline.com"
                className="group flex items-start gap-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#b8924a]/30 text-[#b8924a] transition group-hover:bg-[#b8924a] group-hover:text-[#050403]">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#f0ebe0]/35">
                    Email us
                  </p>
                  <p className="mt-2 text-sm transition group-hover:text-[#b8924a]">
                    support@touchline.com
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#b8924a]/30 text-[#b8924a]">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#f0ebe0]/35">
                    Our location
                  </p>
                  <p className="mt-2 text-sm">Zimbabwe & South Africa</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#b8924a]/30 text-[#b8924a]">
                  <MessageCircle size={19} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#f0ebe0]/35">
                    Support
                  </p>
                  <p className="mt-2 text-sm">
                    We're here to help with your enquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="border border-white/10 bg-[#0b0906] p-7 sm:p-10">
            <div className="mb-9">
              <h2 className="font-serif text-2xl">Send us a message</h2>
              <p className="mt-2 text-xs text-[#f0ebe0]/40">
                Fill in the details below and we'll be in touch.
              </p>
            </div>

            {submitted ? (
              <div className="border border-[#b8924a]/30 bg-[#b8924a]/[0.06] p-6">
                <h3 className="font-serif text-xl text-[#b8924a]">
                  Your email is ready
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#f0ebe0]/60">
                  Your email application should have opened with your message.
                  Send it there to complete your enquiry.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-xs uppercase tracking-widest text-[#b8924a] hover:text-[#f0ebe0]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#f0ebe0]/50">
                      Your name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Full name"
                      className="w-full border border-white/10 bg-[#050403] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#b8924a]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#f0ebe0]/50">
                      Email address
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full border border-white/10 bg-[#050403] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#b8924a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#f0ebe0]/50">
                    Subject
                  </label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    className="w-full border border-white/10 bg-[#050403] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#b8924a]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#f0ebe0]/50">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Write your message here..."
                    className="w-full resize-none border border-white/10 bg-[#050403] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-[#b8924a]"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 bg-[#b8924a] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#050403] transition hover:bg-[#d0ad68]"
                >
                  Send message
                  <Send size={15} />
                </button>

                <p className="text-center text-[10px] leading-5 text-[#f0ebe0]/30">
                  Submitting opens your email application. Your message is
                  not sent directly through this website.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      
    </main>
  );
}
