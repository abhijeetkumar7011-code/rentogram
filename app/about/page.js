import {
  Target,
  Users,
  Leaf,
  Sparkles,
  Rocket,
  HeartHandshake,
  TrendingUp,
  Award,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

const values = [
  { icon: Target, title: "Our Mission", desc: "Make quality tech accessible to everyone, without the burden of ownership.", from: "from-indigo-400", to: "to-indigo-600" },
  { icon: Users, title: "Who We Serve", desc: "Students, freelancers, startups & businesses needing flexible tech access.", from: "from-cyan-400", to: "to-cyan-600" },
  { icon: Leaf, title: "Sustainability", desc: "Renting extends device lifespan and reduces e-waste — good for you and the planet.", from: "from-pink-400", to: "to-pink-600" },
];

const stats = [
  { value: "500+", label: "Devices Rented" },
  { value: "6", label: "Cities Covered" },
  { value: "300+", label: "Happy Clients" },
  { value: "4.8★", label: "Average Rating" },
];

const story = [
  { year: "2022", title: "The Idea", desc: "Started with a simple frustration — buying laptops for short-term needs felt wasteful.", from: "from-indigo-500", to: "to-violet-500" },
  { year: "2023", title: "First 100 Rentals", desc: "Launched in Delhi with a small inventory and a big promise: reliability.", from: "from-cyan-500", to: "to-blue-500" },
  { year: "2024", title: "NCR Expansion", desc: "Expanded delivery & servicing across Faridabad, Noida, Gurugram and beyond.", from: "from-pink-500", to: "to-rose-500" },
  { year: "Today", title: "Growing Strong", desc: "Trusted by students, freelancers and businesses across Delhi-NCR.", from: "from-amber-500", to: "to-orange-500" },
];

const whyUs = [
  { icon: ShieldCheck, title: "Quality Checked", desc: "Every device inspected before it reaches you." },
  { icon: Clock, title: "Fast Delivery", desc: "Doorstep delivery, often same-day." },
  { icon: HeartHandshake, title: "Honest Pricing", desc: "No hidden costs, transparent terms." },
  { icon: TrendingUp, title: "Flexible Plans", desc: "Daily, weekly or monthly rentals." },
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-9 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-3">
          <Sparkles size={13} /> About Us
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 text-gray-900">
          About <span className="text-primary">Rentogram</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Rentogram started with a simple idea — why buy expensive tech for short-term needs,
          when you can rent quality-checked devices, fully serviced and ready to use?
        </p>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-12 sm:mb-20">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 sm:p-6 text-center shadow-sm border border-gray-100">
            <p className="font-bold text-lg sm:text-3xl text-gray-900">{s.value}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mission / Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-12 sm:mb-20">
        {values.map((v) => (
          <div
            key={v.title}
            className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center shadow-sm border border-gray-100 transition-soft hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${v.from} ${v.to} flex items-center justify-center mb-3 sm:mb-4 shadow-sm transition-soft group-hover:scale-110`}>
              <v.icon className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 text-gray-900">{v.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Our story timeline */}
      <div className="mb-12 sm:mb-20">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary font-semibold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full mb-3">
            <Rocket size={13} /> Our Journey
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900">How We Got Here</h2>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
          <div className="hidden sm:block absolute top-7 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 z-0" />
          {story.map((s) => (
            <div key={s.year} className="relative z-10 text-center">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shadow-lg mb-3 text-white font-bold text-xs sm:text-sm`}>
                {s.year}
              </div>
              <h3 className="font-semibold text-xs sm:text-sm mb-1 text-gray-900">{s.title}</h3>
              <p className="text-[10px] sm:text-xs text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why choose us - detailed */}
      <div className="bg-white rounded-2xl p-5 sm:p-10 shadow-md border border-gray-100 mb-12 sm:mb-20">
        <h2 className="text-lg sm:text-2xl font-semibold mb-2.5 sm:mb-3 text-gray-900 text-center">Why Choose Us?</h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto text-center mb-7 sm:mb-10">
          Every device on Rentogram goes through a quality check before it reaches you, and our
          in-house servicing team ensures it stays in top shape. No hidden costs, flexible rental
          durations, and doorstep delivery — tech rental made simple.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {whyUs.map((w) => (
            <div key={w.title} className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2.5 sm:mb-3">
                <w.icon className="text-primary" size={18} />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm mb-1 text-gray-900">{w.title}</h3>
              <p className="text-[10px] sm:text-xs text-gray-600">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 rounded-3xl p-7 sm:p-12 text-center shadow-xl">
        <div className="absolute -top-14 -left-14 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-14 -right-14 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <Award className="text-white/80 mx-auto mb-3" size={26} />
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2.5">Want to Work With Us?</h2>
        <p className="text-white/85 text-xs sm:text-sm mb-5 sm:mb-6 max-w-md mx-auto">
          Whether you're renting for the first time or looking for a bulk corporate deal, we'd love to help.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-white text-primary px-7 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-soft hover:-translate-y-0.5 shadow-lg text-sm sm:text-base"
        >
          Get In Touch <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}