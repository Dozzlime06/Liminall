import { ThirdwebProvider } from "thirdweb/react";
import { client } from "./thirdweb-client";

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}
