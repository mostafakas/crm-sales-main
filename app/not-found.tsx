import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-10 max-w-[480px] w-full text-center">
        {/* Logo */}
        <div className="bg-secondary p-3 rounded-[20px] shadow-sm">
          <Image
            src={`/bluelogo.svg`}
            alt="Almaster Logo"
            width={100}
            height={100}
            className="object-cover rounded-2xl"
          />
        </div>

        {/* 404 display */}
        <div className="flex flex-col items-center gap-4">
          <p
            className="font-bold font-janna leading-none"
            style={{ fontSize: "120px", color: "var(--primary)", lineHeight: 1 }}>
            404
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="font-bold text-2xl text-foreground leading-[28px] font-janna">
              Page Not Found
            </p>
            <p className="font-bold text-md text-muted-foreground leading-[20px] font-janna max-w-[320px]">
              The page you're looking for doesn't exist or has been moved to
              another location.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-secondary w-full" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="bg-secondary hover:bg-secondary/80 h-10 px-5 rounded-[12px] font-bold text-sm text-foreground font-janna transition-colors flex items-center justify-center whitespace-nowrap">
            Go Back
          </Link>
          <Link
            href="/"
            className="bg-primary hover:bg-primary/90 h-10 px-5 rounded-[12px] font-bold text-sm text-white font-janna transition-colors flex items-center justify-center whitespace-nowrap active:scale-[0.98]">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>

  );
}
