import { Link } from "react-router-dom";
import { BarChart3, Users, Zap, Globe, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import dashboardImg from "../assets/dashboard_mockup.png";
import { Button } from "../components/ui/Button.js";
import { Card } from "../components/ui/Card.js";

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 animate-fade-in">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400 backdrop-blur-xl">
              <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-white"></span>
              Secure & Verified Access
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tighter text-white sm:text-7xl lg:text-8xl">
              Empower Decisions with <span className="text-zinc-500">Real-Time</span> Insights.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-zinc-400 sm:text-xl">
              Create, share, and analyze polls with lightning speed. Designed for teams and creators who value clarity and efficiency.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button className="h-12 px-8 text-base">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="h-12 px-8 text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 opacity-20 [background:radial-gradient(circle,white_0%,transparent_70%)]"></div>
      </section>

      {/* Visual Insights Section */}
      <section className="py-24 sm:py-32 border-y border-white/5 bg-zinc-900/20 animate-fade-in [animation-delay:200ms]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Analytics that speak <span className="text-zinc-500">volumes.</span>
              </h2>
              <p className="mt-6 text-lg text-zinc-400">
                Don't just collect data, understand it. Our real-time dashboard provides deep insights into your audience's sentiment with beautiful, interactive visualizations.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span>Instant data aggregation and processing</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span>Beautifully animated bar and pie charts</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span>Exportable reports for team sharing</span>
                </li>
              </ul>
              <div className="mt-10">
                <Link to="/register">
                  <Button variant="link" className="px-0 text-white hover:text-zinc-400">
                    See how it works <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative animate-float">
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-white/20 to-transparent blur-2xl"></div>
                <img
                  src={dashboardImg}
                  alt="Analytics Dashboard Mockup"
                  className="relative rounded-2xl border border-white/10 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 sm:py-32 animate-fade-in [animation-delay:400ms]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to gather feedback.</h2>
            <p className="mt-4 text-zinc-400">Powerful features built for simplicity and scale.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Real-Time Updates"
              description="Watch responses roll in instantly with live dashboard updates and animated charts."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Flexible Access"
              description="Choose between anonymous links or secure, authenticated participation for your polls."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Advanced Analytics"
              description="Gain deep insights with Bar, Pie, and Timeline visualizations of your response data."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Global Sharing"
              description="Share your polls with a single link. Works perfectly on any device, anywhere in the world."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure by Design"
              description="Your data is encrypted and protected. You maintain full control over your poll settings."
            />
            <FeatureCard
              icon={<ArrowRight className="h-6 w-6" />}
              title="Custom Expiry"
              description="Set automatic deadlines for your polls to keep your feedback loops timely and relevant."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-24 px-4 py-16 text-center sm:py-24 animate-fade-in [animation-delay:600ms]">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-zinc-900/50 p-12 backdrop-blur-xl">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Ready to start polling?</h2>
          <p className="mx-auto mt-6 max-w-xl text-zinc-400">
            Join thousands of users making better decisions with PollingHeroes. No credit card required.
          </p>
          <Link to="/register" className="mt-10 inline-block">
            <Button className="h-12 px-10 text-base">Create Your First Poll</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} PollingHeroes. Built for the modern web.
            </p>
            <div className="flex items-center gap-5">
              <SocialLink href="https://x.com/Ved_PandeyOG" icon={<XIcon />} label="X (Twitter)" />
              <SocialLink href="https://www.linkedin.com/in/ved-pandey/" icon={<LinkedinIcon />} label="LinkedIn" />
              <SocialLink href="https://www.instagram.com/vedpandey_dev" icon={<InstagramIcon />} label="Instagram" />
              <SocialLink href="https://github.com/vpdevs001" icon={<GithubIcon />} label="GitHub" />
              <SocialLink href="https://www.youtube.com/@DevWithVed" icon={<YoutubeIcon />} label="YouTube" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 58.4 58.4 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 58.4 58.4 0 0 1-15 0 2 2 0 0 1-2-2z"/><path d="m10 15 5-3-5-3z"/>
    </svg>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-500 hover:text-white transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="group hover:border-white/20 transition-colors">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white ring-1 ring-white/10 group-hover:bg-white group-hover:text-black transition-all">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </Card>
  );
}
