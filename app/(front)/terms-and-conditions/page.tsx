"use client"
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Scale,
  ChevronRight,
  Clock,
  Globe,
} from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          Welcome to Touchline. These Terms and Conditions govern your access
          to and use of the Touchline website, applications and associated
          services (collectively referred to as the "Platform").
        </p>
        <p>
          Touchline operates as an online platform connecting clients with
          independent service providers in Zimbabwe and South Africa.
        </p>
        <p>
          By browsing, registering or using our Platform, you acknowledge
          that you have read, understood and agreed to these Terms and
          Conditions, together with our Privacy Policy.
        </p>
        <p>
          If you do not agree with these Terms, you must discontinue using
          the Platform.
        </p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "Definitions and References",
    content: (
      <>
        <p>For purposes of these Terms:</p>
        <ul>
          <li><strong>Touchline:</strong> Refers to the business operating the platform.</li>
          <li><strong>Platform:</strong> Refers to the Touchline website and associated digital services.</li>
          <li><strong>User:</strong> Any individual accessing or using Touchline.</li>
          <li><strong>Client:</strong> An individual using Touchline to discover or access services.</li>
          <li><strong>Service Provider:</strong> An independent individual or business advertising services on Touchline.</li>
          <li><strong>Account:</strong> A registered user profile.</li>
          <li><strong>Content:</strong> Photographs, descriptions, reviews, advertisements and other submitted material.</li>
          <li><strong>Subscription:</strong> A paid membership, advertising package or premium feature.</li>
        </ul>
      </>
    ),
  },
  {
    id: "general",
    title: "General Terms and Conditions",
    content: (
      <>
        <h4>Acceptance of Terms</h4>
        <p>
          By accessing or using Touchline, you are deemed to have accepted
          these Terms and Conditions. Registration may require you to
          expressly confirm acceptance.
        </p>
        <h4>Age Restrictions</h4>
        <p>
          You must be at least 18 years old to register for, access or use
          Touchline. We reserve the right to request age verification and
          suspend accounts where there is reasonable suspicion of underage
          use.
        </p>
        <h4>Account Registration</h4>
        <p>
          You agree to provide accurate, current and complete information
          when creating your account. You are responsible for maintaining
          the confidentiality of your login credentials and notifying us
          of suspected unauthorised access.
        </p>
        <h4>Right to Refuse or Terminate Accounts</h4>
        <p>
          Touchline may refuse registrations, suspend accounts, remove
          listings or restrict access where users violate these Terms,
          provide false information, engage in fraudulent activity or
          compromise the security of the Platform.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "Description of Services",
    content: (
      <>
        <p>
          Touchline operates as an online advertising and service-discovery
          platform connecting clients with independent service providers.
        </p>
        <p>The Platform may offer:</p>
        <ul>
          <li>Service provider registration and profile creation.</li>
          <li>Service listings and advertisements.</li>
          <li>Profile photographs and image galleries.</li>
          <li>Search and filtering functionality.</li>
          <li>Client enquiries and communication facilities.</li>
          <li>Reviews, ratings and feedback.</li>
          <li>Premium memberships and promotional listings.</li>
        </ul>
        <h4>Independent Service Providers</h4>
        <p>
          Service providers operate independently and are not automatically
          employees, agents, partners or representatives of Touchline.
          Agreements for services are entered into directly between clients
          and providers.
        </p>
        <h4>No Guarantee of Service Quality</h4>
        <p>
          Touchline does not guarantee the quality, suitability, availability
          or accuracy of services advertised. Users should conduct their own
          checks before engaging any provider.
        </p>
        <h4>Verification</h4>
        <p>
          Where verification is offered, it indicates only that certain
          checks have been completed. It does not constitute a guarantee,
          certification or professional endorsement.
        </p>
      </>
    ),
  },
  {
    id: "providers",
    title: "Service Provider Responsibilities",
    content: (
      <>
        <p>Service providers using Touchline agree to:</p>
        <ul>
          <li>Be legally entitled to advertise and provide their services.</li>
          <li>Provide accurate profile and business information.</li>
          <li>Use genuine photographs and truthful descriptions.</li>
          <li>Maintain any legally required qualifications or licences.</li>
          <li>Treat clients respectfully and professionally.</li>
          <li>Respect client privacy and personal information.</li>
          <li>Comply with applicable laws in their operating jurisdiction.</li>
          <li>Honour commitments made directly to clients.</li>
        </ul>
        <p>
          Providers remain responsible for their services, pricing,
          customer interactions, applicable taxes and independent
          business obligations.
        </p>
      </>
    ),
  },
  {
    id: "clients",
    title: "Client Responsibilities",
    content: (
      <>
        <p>Clients agree to:</p>
        <ul>
          <li>Provide accurate information when registering or enquiring.</li>
          <li>Communicate respectfully with service providers.</li>
          <li>Respect the privacy and personal boundaries of others.</li>
          <li>Not harass, threaten, intimidate or exploit other users.</li>
          <li>Not misuse contact information obtained through Touchline.</li>
          <li>Conduct appropriate checks before engaging a provider.</li>
          <li>Comply with agreements entered into directly with providers.</li>
        </ul>
      </>
    ),
  },
  {
    id: "subscriptions",
    title: "Subscriptions and Premium Features",
    content: (
      <>
        <p>
          Touchline may offer free and paid account options. Certain
          functionality may only be available through paid subscriptions
          or advertising packages.
        </p>
        <p>Premium features may include:</p>
        <ul>
          <li>Enhanced profile visibility.</li>
          <li>Featured and promoted listings.</li>
          <li>Additional photographs and gallery capacity.</li>
          <li>Priority placement in search results.</li>
          <li>Extended profile customisation.</li>
          <li>Additional advertising tools.</li>
        </ul>
        <h4>Activation</h4>
        <p>
          Subscriptions purchased through automated payment gateways may
          be activated following successful payment confirmation. Manual
          payments may require verification and will generally be processed
          within one business day after funds reflect.
        </p>
        <h4>Changes to Features</h4>
        <p>
          Touchline may introduce, modify or discontinue features where
          reasonably necessary. Material changes affecting active paid
          subscriptions will be handled in accordance with applicable law.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payment Policy",
    content: (
      <>
        <p>
          Payments for subscriptions, advertising packages and other paid
          features may be made through payment methods supported by
          Touchline, including:
        </p>
        <ul>
          <li>Bank transfers and EFT.</li>
          <li>Debit and credit cards.</li>
          <li>Mobile money services.</li>
          <li>Approved third-party payment gateways.</li>
        </ul>
        <h4>Payment Confirmation</h4>
        <p>
          Payment is considered received once confirmed by the relevant
          payment provider or reflected in Touchline's designated account.
        </p>
        <h4>Currency</h4>
        <p>
          Touchline may display and accept payments in supported currencies,
          including USD and South African Rand (ZAR). Users are responsible
          for applicable bank charges and conversion fees.
        </p>
        <h4>Incorrect Payments</h4>
        <p>
          Users are responsible for ensuring that the correct payment
          amount and account reference are used. Overpayments will be
          investigated and resolved through an appropriate refund or
          account credit, subject to applicable law.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds and Cancellation Policy",
    content: (
      <>
        <p>
          Subscription and advertising purchases are subject to the
          conditions displayed at the time of purchase and applicable
          consumer protection legislation.
        </p>
        <p>
          Because subscriptions and premium advertising involve digital
          services and immediate access to features, refunds may be
          restricted once services have been activated or delivered.
        </p>
        <p>Refunds or other remedies may be considered where:</p>
        <ul>
          <li>A payment was duplicated.</li>
          <li>A payment was made in error and not processed.</li>
          <li>Touchline cannot provide a purchased service.</li>
          <li>A technical issue prevents delivery of a paid feature.</li>
          <li>A payment was unauthorised or fraudulent.</li>
          <li>A refund is required by applicable law.</li>
        </ul>
        <p>
          Nothing in this policy excludes any statutory cancellation,
          refund or consumer right that cannot legally be excluded.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery and Availability of Services",
    content: (
      <>
        <p>
          Digital subscriptions and premium features are generally
          activated electronically following successful payment
          confirmation.
        </p>
        <p>
          Touchline will make reasonable efforts to resolve activation
          issues within one business day. Users should contact support
          if a purchased feature is unavailable.
        </p>
        <p>
          Uninterrupted access cannot be guaranteed. Maintenance, technical
          interruptions and third-party outages may occasionally occur.
        </p>
      </>
    ),
  },
  {
    id: "provision",
    title: "Provision and Modification of Services",
    content: (
      <p>
        Touchline may introduce new features, modify existing services,
        remove outdated functionality, temporarily suspend access for
        maintenance or discontinue parts of the Platform where reasonably
        necessary. Where practicable, we will provide notice of significant
        changes. Active subscription obligations and statutory user rights
        will remain protected.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy and Protection of Personal Information",
    content: (
      <>
        <p>
          Touchline takes the protection of personal information seriously
          and will implement reasonable measures to protect information
          collected, stored or processed through the Platform.
        </p>
        <p>This information may include:</p>
        <ul>
          <li>Names and contact details.</li>
          <li>Account and profile information.</li>
          <li>Profile photographs and location information.</li>
          <li>Payment transaction references.</li>
          <li>Messages, enquiries and user submissions.</li>
        </ul>
        <p>Information may be processed to:</p>
        <ul>
          <li>Create and manage accounts.</li>
          <li>Facilitate communication between users.</li>
          <li>Process subscriptions and payments.</li>
          <li>Prevent fraud and platform misuse.</li>
          <li>Improve our services.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p>
          We aim to comply with Zimbabwe's Cyber and Data Protection Act
          [Chapter 12:07] and South Africa's Protection of Personal
          Information Act 4 of 2013 (POPIA), including applicable
          cross-border data transfer requirements.
        </p>
        <p>
          Please refer to our Privacy Policy for further details about
          how personal information is handled.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Websites and Services",
    content: (
      <p>
        Touchline may contain links to external websites, payment gateways
        and social media platforms. These services operate independently.
        Touchline does not control or accept responsibility for their
        content, availability, security or privacy practices. Users should
        review the applicable third-party terms and policies.
      </p>
    ),
  },
  {
    id: "submissions",
    title: "User-Generated Content and Public Submissions",
    content: (
      <>
        <p>
          Users may submit profile photographs, service advertisements,
          business descriptions, reviews, ratings, comments and other
          permitted content.
        </p>
        <p>
          You remain responsible for everything you upload and confirm
          that you own the content or have permission to use it, and that
          it does not violate applicable laws or third-party rights.
        </p>
        <p>
          By submitting content, you grant Touchline a non-exclusive,
          worldwide, royalty-free licence to host, store, display and
          reproduce that content as reasonably necessary to operate and
          promote the Platform.
        </p>
        <p>
          Touchline reserves the right to remove content that violates
          these Terms or applicable law.
        </p>
      </>
    ),
  },
  {
    id: "prohibited",
    title: "Prohibited Content and Conduct",
    content: (
      <>
        <p>Users may not upload, publish or distribute content that:</p>
        <ul>
          <li>Is unlawful, fraudulent or misleading.</li>
          <li>Contains threats, harassment or intimidation.</li>
          <li>Is defamatory, abusive or discriminatory.</li>
          <li>Violates another person's privacy.</li>
          <li>Contains unauthorised photographs or personal information.</li>
          <li>Infringes copyright, trademarks or intellectual property rights.</li>
          <li>Contains malware or harmful code.</li>
          <li>Promotes criminal activity or exploitation.</li>
          <li>Misrepresents qualifications or professional experience.</li>
          <li>Contains spam or unauthorised advertising.</li>
        </ul>
        <p>
          Violations may result in content removal, account suspension
          or permanent termination.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Restrictions on Multiple Accounts",
    content: (
      <p>
        Touchline may limit the number of accounts an individual or
        business can register. Multiple accounts must not be used to
        manipulate ratings, avoid suspensions, mislead users, circumvent
        subscription restrictions or engage in fraudulent activities.
      </p>
    ),
  },
  {
    id: "specific-use",
    title: "Specific Use of the Platform",
    content: (
      <>
        <p>You agree not to use Touchline to:</p>
        <ul>
          <li>Harass, threaten or intimidate another person.</li>
          <li>Send unsolicited or abusive communications.</li>
          <li>Impersonate another person or business.</li>
          <li>Collect personal information without authorisation.</li>
          <li>Circumvent security or account restrictions.</li>
          <li>Manipulate ratings, reviews or search results.</li>
          <li>Engage in fraud or deceptive commercial practices.</li>
          <li>Interfere with another user's access to the Platform.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property Rights",
    content: (
      <p>
        All intellectual property relating to the Touchline name, branding,
        logos, website design, software and original Platform content
        remains the property of Touchline or its respective licensors.
        Users may not reproduce, distribute or commercially exploit
        proprietary materials without prior written permission.
        This does not transfer ownership of content belonging to users
        or independent service providers.
      </p>
    ),
  },
  {
    id: "security",
    title: "Platform Security and Access",
    content: (
      <>
        <p>Users agree not to:</p>
        <ul>
          <li>Attempt unauthorised access to the Platform.</li>
          <li>Hack, damage or interfere with the Platform.</li>
          <li>Circumvent security systems.</li>
          <li>Introduce malware or malicious code.</li>
          <li>Scrape or extract information using unauthorised automated systems.</li>
        </ul>
        <p>
          Touchline will take reasonable steps to protect the Platform,
          but no online service can guarantee complete security.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "Warranties and Representations",
    content: (
      <p>
        To the maximum extent permitted by applicable law, Touchline
        provides the Platform on an "as available" basis. We do not
        guarantee uninterrupted availability, complete accuracy of
        user profiles or advertisements, error-free operation or
        compatibility with every device. Nothing in this section
        excludes warranties or consumer rights that cannot legally
        be excluded.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: (
      <p>
        To the maximum extent permitted by applicable law, Touchline
        shall not be liable for indirect or consequential losses arising
        from the use of the Platform. Touchline is not responsible for
        independent agreements between clients and providers, the
        conduct of users, independently supplied services or third-party
        service interruptions. Nothing in this section excludes liability
        for fraud or any other liability that cannot lawfully be excluded.
      </p>
    ),
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <p>
        To the extent permitted by applicable law, you agree to be
        responsible for losses, claims and reasonable expenses arising
        directly from your unlawful use of the Platform, infringement
        of third-party rights or material breach of these Terms.
        This does not extend to losses caused by Touchline's own
        unlawful conduct or negligence where such liability cannot
        legally be excluded.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and Termination",
    content: (
      <p>
        Touchline may suspend, restrict or terminate accounts where
        users breach these Terms, engage in fraudulent or abusive
        conduct, create security risks or violate applicable law.
        Where reasonably practicable, affected users will be notified.
        Outstanding paid subscription obligations and statutory rights
        will be handled in accordance with applicable law.
      </p>
    ),
  },
  {
    id: "force-majeure",
    title: "Force Majeure",
    content: (
      <p>
        Touchline shall not be responsible for delays or failures caused
        by circumstances beyond its reasonable control, including
        natural disasters, government restrictions, power outages,
        telecommunications failures, cyberattacks, civil unrest or
        third-party service failures. We will make reasonable efforts
        to restore affected services when circumstances permit.
      </p>
    ),
  },
  {
    id: "regional",
    title: "Regional Operation and Applicable Laws",
    content: (
      <>
        <p>
          Touchline operates in Zimbabwe and South Africa. Users must
          comply with applicable laws in the jurisdiction where they
          access or use the Platform.
        </p>
        <h4>Zimbabwe</h4>
        <ul>
          <li>Cyber and Data Protection Act [Chapter 12:07].</li>
          <li>Consumer Protection Act [Chapter 14:44].</li>
          <li>Other applicable commercial and electronic communications legislation.</li>
        </ul>
        <h4>South Africa</h4>
        <ul>
          <li>Protection of Personal Information Act 4 of 2013.</li>
          <li>Consumer Protection Act 68 of 2008.</li>
          <li>Electronic Communications and Transactions Act 25 of 2002.</li>
        </ul>
        <p>
          Nothing in these Terms is intended to deprive users of mandatory
          rights available under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "disputes",
    title: "Dispute Resolution",
    content: (
      <p>
        If a dispute arises, the parties should first attempt to resolve
        it through good-faith communication. Users should contact
        Touchline through its official support channels. Where a dispute
        cannot be resolved informally, either party may pursue remedies
        through competent courts, regulatory authorities or applicable
        alternative dispute resolution procedures.
      </p>
    ),
  },
  {
    id: "amendments",
    title: "Amendments to These Terms",
    content: (
      <p>
        Touchline may update these Terms from time to time. Updated
        versions will be published on the Platform with a revised
        effective date. Where reasonably practicable, we will provide
        notice of material changes. Continued use of the Platform
        after an amendment takes effect constitutes acceptance to
        the extent permitted by law.
      </p>
    ),
  },
  {
    id: "severability",
    title: "Severability",
    content: (
      <p>
        If any provision is found to be invalid, unlawful or
        unenforceable, it shall be severed to the extent necessary.
        The remaining provisions will continue in full force and effect.
      </p>
    ),
  },
  {
    id: "agreement",
    title: "Entire Agreement",
    content: (
      <p>
        These Terms and Conditions, together with the Touchline Privacy
        Policy and applicable subscription or service-specific policies,
        constitute the agreement governing your use of the Platform
        and supersede previous agreements concerning its use, to the
        extent permitted by applicable law.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    content: (
      <>
        <p>
          For questions, complaints, payment disputes or account
          enquiries relating to these Terms, please contact our team.
        </p>
        <div className="mt-5 rounded-xl border border-[#b8924a]/20 bg-[#b8924a]/[0.04] p-5">
          <p><strong>Business Name:</strong> Touchline</p>
          <p><strong>Country of Registration:</strong>South Africa</p>
          <p><strong>Email:</strong> locallistzim@gmail.com</p>
        </div>
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#050403] text-[#f0ebe0]">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#050403]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#b8924a]/40 bg-[#b8924a]/10">
              <span className="text-xl font-serif font-bold text-[#b8924a]">
                T.
              </span>
            </div>
            <div>
              <span className="block text-lg font-semibold tracking-[0.22em]">
                TOUCHLINE
              </span>
              <span className="block text-[9px] tracking-[0.3em] text-[#b8924a]">
                DISCOVER MORE
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#f0ebe0]/60 transition hover:text-[#b8924a]"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b8924a]/[0.07] blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-[#b8924a]/[0.04] blur-[100px]" />

        <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
      

          <h1 className="max-w-4xl font-serif text-xl leading-[1.08] tracking-tight md:text-7xl">
            Terms &{" "}
            <span className="italic text-[#b8924a]">Conditions.</span>
          </h1>

        

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-xs text-[#f0ebe0]/50">
              <Clock size={15} className="text-[#b8924a]" />
              Last updated: 16 November 2026
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2 text-xs text-[#f0ebe0]/50">
              <Globe size={15} className="text-[#b8924a]" />
              Zimbabwe & South Africa
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2 text-xs text-[#f0ebe0]/50">
              <ShieldCheck size={15} className="text-[#b8924a]" />
              Official Legal Document
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-16 md:px-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20 lg:py-24">

        {/* Sidebar */}
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="mb-5 flex items-center gap-2">
            <FileText size={16} className="text-[#b8924a]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b8924a]">
              On this page
            </span>
          </div>

          <div className="custom-scrollbar flex max-h-[65vh] flex-col gap-1 overflow-y-auto pr-3">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-start gap-3 rounded-lg px-3 py-2.5 text-xs text-[#f0ebe0]/45 transition hover:bg-[#b8924a]/[0.07] hover:text-[#b8924a]"
              >
                <span className="mt-0.5 font-mono text-[10px] text-[#b8924a]/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="leading-5">{section.title}</span>
                <ChevronRight
                  size={13}
                  className="ml-auto mt-0.5 shrink-0 opacity-0 transition group-hover:opacity-100"
                />
              </a>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[#b8924a]/20 bg-[#b8924a]/[0.04] p-5">
            <Scale size={20} className="mb-4 text-[#b8924a]" />
            <p className="text-sm font-medium">Need assistance?</p>
            <p className="mt-2 text-xs leading-6 text-[#f0ebe0]/45">
              Our team is available to assist with questions about
              our policies and terms.
            </p>
            <a
              href="mailto:support@touchline.com"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#b8924a] hover:text-[#d3b477]"
            >
              Contact Support <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>

        {/* Legal Document */}
        <div className="min-w-0">
          <div className="mb-12 flex items-center justify-between border-b border-white/[0.08] pb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b8924a]">
                Touchline Legal
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                Website Terms of Use
              </h2>
            </div>
            <div className="hidden h-14 w-14 items-center justify-center rounded-full border border-[#b8924a]/30 bg-[#b8924a]/[0.05] sm:flex">
              <FileText size={23} className="text-[#b8924a]" />
            </div>
          </div>

          <div className="space-y-14">
            {sections.map((section, index) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-32"
              >
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-mono text-xs tracking-wider text-[#b8924a]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#b8924a]/30 to-transparent" />
                </div>

                <h3 className="mb-5 font-serif text-xl leading-snug text-[#f0ebe0] md:text-2xl">
                  {section.title}
                </h3>

                <div className="legal-content space-y-4 text-[13px] leading-[2] text-[#f0ebe0]/55 md:text-sm">
                  {section.content}
                </div>
              </article>
            ))}
          </div>

          {/* Closing */}
          <div className="mt-20 border-t border-[#b8924a]/20 pt-10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#b8924a]/30 bg-[#b8924a]/[0.06]">
                <ShieldCheck size={25} className="text-[#b8924a]" />
              </div>

              <h3 className="font-serif text-2xl">
                Thank you for choosing{" "}
                <span className="italic text-[#b8924a]">Touchline.</span>
              </h3>

              <p className="mt-3 max-w-md text-xs leading-7 text-[#f0ebe0]/40">
                We are committed to creating a trusted, transparent
                and professional platform for everyone in our community.
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#b8924a] px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#050403] transition hover:bg-[#d3b477]"
              >
                Return to Touchline
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] bg-[#080705]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-5 px-5 py-8 text-center md:flex-row md:px-10 md:text-left">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em]">
              TOUCHLINE<span className="text-[#b8924a]">.</span>
            </p>
            <p className="mt-1 text-[10px] text-[#f0ebe0]/30">
              © {new Date().getFullYear()} Touchline. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] text-[#f0ebe0]/40">
            <Link href="/privacy-policy" className="transition hover:text-[#b8924a]">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-[#b8924a]">
              Terms & Conditions
            </Link>
            <a href="mailto:support@touchline.com" className="transition hover:text-[#b8924a]">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Global legal typography */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .legal-content p {
          margin-bottom: 14px;
        }

        .legal-content strong {
          color: #f0ebe0;
          font-weight: 600;
        }

        .legal-content h4 {
          color: #b8924a;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-top: 26px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .legal-content ul {
          list-style: none;
          padding-left: 0;
          margin: 14px 0;
        }

        .legal-content li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 9px;
        }

        .legal-content li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 11px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #b8924a;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #b8924a55;
          border-radius: 10px;
        }

        ::selection {
          background: #b8924a;
          color: #050403;
        }
      `}</style>
    </main>
  );
}
