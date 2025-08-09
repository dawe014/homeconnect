import { Link } from "react-router-dom";
import {
  BuildingLibraryIcon,
  GlobeAltIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";

const team = [
  {
    name: "Jane Cooper",
    role: "Founder & CEO",
    imageUrl: "/team1.png",
  },
  {
    name: "Michael Foster",
    role: "Lead Real Estate Agent",
    imageUrl: "/team2.png",
  },
  {
    name: "Dries Vincent",
    role: "Head of Technology",
    imageUrl: "/team3.png",
  },
];

const stats = [
  { label: "Properties Sold", value: "10,000+" },
  { label: "Happy Clients", value: "5,000+" },
  { label: "Awards Won", value: "25" },
];

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            />
          </svg>
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#808afc] to-[#4f46e5] opacity-30" />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Connecting People with Places They Love.
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    At HomeConnect, we're more than just a real estate platform.
                    We are a community of passionate professionals dedicated to
                    simplifying your journey to finding the perfect home. We
                    combine cutting-edge technology with personalized service to
                    make your dream a reality.
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        src="/about1.png"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        src="/about2.png"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="/about3.png"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        src="/about4.png"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="/about5.png"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The principles that guide our work every day.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="relative pl-16">
              <dt className="inline font-semibold text-gray-900">
                <BuildingLibraryIcon
                  className="absolute left-1 top-1 h-10 w-10 text-indigo-600"
                  aria-hidden="true"
                />
                Integrity.
              </dt>
              <dd className="inline text-gray-600">
                {" "}
                We believe in honest, transparent, and ethical practices in
                every transaction.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="inline font-semibold text-gray-900">
                <ScaleIcon
                  className="absolute left-1 top-1 h-10 w-10 text-indigo-600"
                  aria-hidden="true"
                />
                Client-Centric.
              </dt>
              <dd className="inline text-gray-600">
                {" "}
                Your goals are our priority. We listen, we understand, and we
                deliver results tailored to you.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="inline font-semibold text-gray-900">
                <GlobeAltIcon
                  className="absolute left-1 top-1 h-10 w-10 text-indigo-600"
                  aria-hidden="true"
                />
                Innovation.
              </dt>
              <dd className="inline text-gray-600">
                {" "}
                We constantly adapt and innovate, using the best technology to
                provide a seamless experience.
              </dd>
            </div>
          </dl>
        </div>

        {/* Team section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet our team
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The dedicated professionals making it all happen.
            </p>
          </div>
          <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-3">
            {team.map((person) => (
              <li key={person.name}>
                <img
                  className="aspect-[14/13] w-full rounded-2xl object-cover"
                  src={person.imageUrl}
                  alt=""
                />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-gray-600">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats section */}
        <div className="mt-32 sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                By the Numbers
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our track record speaks for itself. We're proud of the community
                we've helped build.
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-black sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse gap-y-3 border-l border-indigo-600 pl-6"
                >
                  <dt className="text-base leading-7 text-gray-600">
                    {stat.label}
                  </dt>
                  <dd className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* CTA section */}
        <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to find your home?
              <br />
              Start your search today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Browse thousands of listings or connect with an agent to begin
              your journey. Your dream home is just a few clicks away.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/for-sale"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Explore Listings
              </Link>
              <Link
                to="/agents"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Contact an agent <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
