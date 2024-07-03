import Navigtion from "@/components/site/navigtion";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <Navigtion />
      {children}
    </ClerkProvider>
  );
}
