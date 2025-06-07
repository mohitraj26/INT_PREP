import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#api" },
    { name: "Documentation", href: "#docs" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  resources: [
    { name: "Help Center", href: "#help" },
    { name: "Community", href: "#community" },
    { name: "Tutorials", href: "#tutorials" },
    { name: "Status", href: "#status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "GDPR", href: "#gdpr" },
  ],
}

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/mohitraj26/Leetlab" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/MohitRaj1315?t=aA_XX_cVyn4P0ccVAzJ-HA&s=09" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/mohit-raj-82a017281/" },
  { name: "Email", icon: Mail, href: "mailto:mohitraj13158920@gmail.com" },
]

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">INT_PREP</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-sm">
              Empowering students to ace their technical interviews and build successful careers in tech.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-300 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-300 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-300 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-300 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2025 INT_PREP. All rights reserved.</p>
            <p className="text-slate-400 text-sm mt-4 md:mt-0">Made with ❤️ for aspiring developers</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
