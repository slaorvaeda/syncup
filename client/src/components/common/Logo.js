import Image from "next/image";

const SIZES = {
  sm: 32,
  md: 36,
  lg: 40,
};

export default function Logo({ size = "sm", className = "" }) {
  const px = typeof size === "number" ? size : SIZES[size] ?? SIZES.sm;

  return (
    <Image
      src="/logo.png"
      alt="SyncUp"
      width={px}
      height={px}
      className={`shrink-0 object-contain ${className}`}
      priority
    />
  );
}
