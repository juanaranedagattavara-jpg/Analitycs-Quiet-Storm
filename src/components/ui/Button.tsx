import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsLink = Common & { href: string; type?: never; onClick?: never };
type AsButton = Common & {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lightning focus-visible:ring-offset-2 focus-visible:ring-offset-storm-midnight";

const variants: Record<Variant, string> = {
  primary:
    "btn-lightning hover:scale-[1.02]",
  secondary:
    "bg-storm-midnight text-white hover:bg-storm-deep",
  outline:
    "border border-storm-foam/40 text-white hover:bg-white/5 hover:border-lightning",
  ghost:
    "text-storm-midnight hover:bg-storm-foam",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-[15px]",
  lg: "h-14 px-9 text-base",
};

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
        <Arrow />
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={"disabled" in props ? props.disabled : false}
      className={cn(classes, "disabled:opacity-50 disabled:cursor-not-allowed")}
    >
      {children}
      <Arrow />
    </button>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="transition-transform duration-200 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path
        d="M2 7h10m0 0L7.5 2.5M12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
