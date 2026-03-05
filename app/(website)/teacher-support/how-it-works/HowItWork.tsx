import Image from "next/image"

export default function TeacherHowItWorksPage() {
  const steps = [
    {
      number: "01",
      gif: "/landing-page/gif/submit-application.gif",
      title: "Submit Your Application",
      description:
        "Complete a simple online application with basic details about yourself and your support needs. No complex paperwork required.",
      details: [
        "Personal and contact information",
        "School affiliation details",
        "Support amount needed",
        "Brief description of situation",
      ],
    },
    {
      number: "02",
      gif: "/landing-page/gif/school-verification.gif",
      title: "School Verification",
      description:
        "Your school confirms your employment. This is a simple verification, not a credit check or detailed financial review.",
      details: [
        "Employment confirmation only",
        "No credit scoring involved",
        "Confidential process",
        "Quick turnaround time",
      ],
    },
    {
      number: "03",
      gif: "/landing-page/gif/support-disbursement.gif",
      title: "Support Disbursement",
      description:
        "Once approved, funds are transferred directly to your account. Fast, secure, and hassle-free.",
      details: [
        "Direct bank transfer",
        "Typically within 48-72 hours",
        "Clear acknowledgment provided",
        "No hidden deductions",
      ],
    },
    {
      number: "04",
      gif: "/landing-page/gif/flexible-repayment.gif",
      title: "Flexible Repayment",
      description:
        "Repay in comfortable installments over 2-3 months. Interest-free, penalty-free, with hardship extensions available.",
      details: [
        "Fixed monthly installments",
        "Zero interest always",
        "No late payment penalties",
        "Extension option if needed",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              Teacher Support Program
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How Teacher Support Works
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A simple, dignified process designed to get you the support you
              need quickly and without unnecessary complexity.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="space-y-20">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="grid lg:grid-cols-2 gap-10 items-center"
                >
                  {/* Text Side */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-bold text-blue-100">
                        {step.number}
                      </span>
                      {/* <div className="w-14 h-14 rounded-xl overflow-hidden">
                        <Image
                          src={step.gif}
                          alt={step.title}
                          width={56}
                          height={56}
                          className="object-contain"
                        />
                      </div> */}    
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h2>

                    <p className="text-lg text-gray-600 mb-6">
                      {step.description}
                    </p>

                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-800"
                        >
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* GIF Side */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="bg-white rounded-xl p-0 flex items-center justify-center">
                      <Image
                        src={step.gif}
                        alt={step.title}
                        width={280}
                        height={280}
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Quick Timeline
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              From application to support — here is what to expect.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: "Application", time: "15 minutes" },
                { label: "Verification", time: "24-48 hours" },
                { label: "Disbursement", time: "48-72 hours" },
                { label: "Total Time", time: "3-5 days" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <p className="font-semibold text-gray-900 mb-2">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
              Common Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Will my school know about my application?",
                  a: "Only basic employment verification is required from your school. The details of your financial situation remain confidential between you and Schoolfee.",
                },
                {
                  q: "What if I cannot repay on time?",
                  a: "You can request a hardship extension. There are no penalties for genuine difficulties.",
                },
                {
                  q: "Is this a loan that will affect my credit score?",
                  a: "No. This is assistance, not a loan. We do not report to credit bureaus.",
                },
                {
                  q: "How much support can I receive?",
                  a: "Support amounts typically range up to ₹50,000 depending on available funds and your situation.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
