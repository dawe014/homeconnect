import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const SocialIcon = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors duration-300"
  >
    {children}
  </a>
);

export default function Footer() {
  const navigation = {
    properties: [
      { name: "For Sale", href: "/for-sale" },
      { name: "For Rent", href: "/for-rent" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Agents", href: "/agents" },
      { name: "Contact Us", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Branding Section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">HomeConnect</span>
            </Link>
            <p className="text-sm leading-6 text-gray-300">
              Your journey home starts here. Discover properties, connect with
              agents, and find a place you'll love to live.
            </p>
            <div className="flex space-x-6">
              {/* --- 2. USE THE IMPORTED REACT-ICONS COMPONENTS --- */}
              <SocialIcon href="#">
                <FaFacebook size={24} />
              </SocialIcon>
              <SocialIcon href="#">
                <FaInstagram size={24} />
              </SocialIcon>
              <SocialIcon href="#">
                <FaTwitter size={24} />
              </SocialIcon>
            </div>
          </div>

          {/* Links Section */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Properties
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.properties.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Company
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Legal
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t  text-center border-white/10 pt-8 sm:mt-20 lg:mt-16">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} HomeConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
