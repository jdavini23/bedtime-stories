import { Crown, Wand2, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-sm font-medium mb-4">
            <Crown className="h-4 w-4 mr-2" />
            <span>Flexible Plans</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pick the Perfect Plan for Your Family</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the magical adventure that fits your family's storytelling needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Try It Out"
            price="Free"
            description="Perfect for families just beginning their storytelling journey"
            features={["3 stories per month", "Basic themes", "Simple customization", "Web reading"]}
            buttonText="Start Free"
            color="bg-gradient-to-br from-slate-50 to-slate-100"
            icon={<BookOpen className="h-6 w-6 text-slate-600" />}
            accentColor="border-slate-200"
            buttonColor="bg-slate-900 hover:bg-slate-800"
          />

          <PricingCard
            title="Unlimited Adventures"
            price="$9.99"
            period="per month"
            description="Our most popular plan for endless storytelling fun"
            features={[
              "Unlimited stories",
              "All themes & settings",
              "Advanced character creation",
              "Download as PDF",
              "New themes monthly",
            ]}
            buttonText="Choose Plan"
            color="bg-gradient-to-br from-violet-50 to-violet-100"
            icon={<Wand2 className="h-6 w-6 text-violet-600" />}
            accentColor="border-violet-200"
            buttonColor="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            highlighted={true}
          />

          <PricingCard
            title="Storytime for Everyone"
            price="$14.99"
            period="per month"
            description="The ultimate family storytelling experience"
            features={[
              "Everything in Unlimited",
              "Up to 5 family profiles",
              "Audio narration",
              "Print-ready illustrations",
              "Priority new features",
              "Exclusive themes",
            ]}
            buttonText="Choose Family Plan"
            color="bg-gradient-to-br from-amber-50 to-amber-100"
            icon={<Crown className="h-6 w-6 text-amber-600" />}
            accentColor="border-amber-200"
            buttonColor="bg-amber-600 hover:bg-amber-700"
          />
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  color,
  icon,
  accentColor,
  buttonColor,
  highlighted = false,
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${highlighted ? "ring-2 ring-violet-500 shadow-2xl" : "shadow-xl"}`}
    >
      <div className={`${color} p-6 text-center border-b ${accentColor}`}>
        <div className="mx-auto bg-white rounded-full h-16 w-16 flex items-center justify-center mb-4 shadow-md">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-slate-900">{price}</span>
          {period && <span className="text-slate-600"> {period}</span>}
        </div>
        <p className="text-slate-600 mb-4">{description}</p>
      </div>
      <div className="bg-white p-6">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-slate-700">
              <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Star className="h-3 w-3 text-violet-600" fill="#7c3aed" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button className={`w-full ${buttonColor} text-white`}>{buttonText}</Button>
      </div>
    </div>
  )
}

