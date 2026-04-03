import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Navigation-Utilities — überall im Projekt statt next/navigation verwenden
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
