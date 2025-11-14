import { PrivyProviderWrapper } from '@/lib/privy-provider';
import Header from '../Header';

export default function HeaderExample() {
  return (
    <PrivyProviderWrapper>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-6 text-center text-muted-foreground">
          Header component with wallet connection
        </div>
      </div>
    </PrivyProviderWrapper>
  );
}
