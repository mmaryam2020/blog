import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Search({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full max-w-[520px] group", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <SearchIcon className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        className="w-full bg-card border border-border text-foreground text-sm rounded-[16px] focus:ring-4 focus:ring-accent-background focus:border-accent block pl-12 p-3.5 outline-none transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        placeholder="Search posts, notes, tags..."
      />
    </div>
  );
}
