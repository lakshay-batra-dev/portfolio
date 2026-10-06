import { profile } from "@/data/profile";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function ContactSection() {
  const links = [
    { href: `mailto:${profile.email}`, label: "Email", value: profile.email, external: false },
    { href: profile.linkedin, label: "LinkedIn", value: "linkedin.com/in/lakshay-batra-dev", external: true },
    { href: profile.github, label: "GitHub", value: "github.com/DROP5136", external: true },
  ];

  return (
    <div>
      <h1 className="font-sans text-[1.75rem] font-medium tracking-tight">Contact</h1>
      <p className="mt-3 font-sans text-[16px] leading-7">Have something interesting to build?</p>
      <ul className="mt-8 max-w-md divide-y divide-boot-line border-y border-boot-line">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className={`flex items-baseline justify-between gap-4 py-3 font-mono text-[13px] ${focus}`}
            >
              <span className="tracking-[0.12em]">{link.label.toUpperCase()}</span>
              <span className="text-right text-boot-dim">{link.value}</span>
              {link.external ? <span className="sr-only">, opens in a new tab</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
