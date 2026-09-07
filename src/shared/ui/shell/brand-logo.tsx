import Image from "next/image";

interface BrandLogoProps {
  compact?: boolean;
  subtle?: boolean;
  priority?: boolean;
  className?: string;
}

export function BrandLogo({
  compact = false,
  subtle = false,
  priority = false,
  className = "",
}: BrandLogoProps) {
  if (compact) {
    return (
      <Image
        src="/brand/bewise-symbol.png"
        alt="Bewise"
        width={384}
        height={466}
        priority={priority}
        className={`h-9 w-auto object-contain ${subtle ? "opacity-80" : ""} ${className}`}
      />
    );
  }

  return (
    <Image
      src="/brand/bewise-logo.png"
      alt="Bewise"
      width={900}
      height={234}
      priority={priority}
      className={`h-9 w-auto object-contain ${subtle ? "opacity-80" : ""} ${className}`}
    />
  );
}
