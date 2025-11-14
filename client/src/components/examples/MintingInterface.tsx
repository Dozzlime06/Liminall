import { PrivyProviderWrapper } from '@/lib/privy-provider';
import MintingInterface from '../MintingInterface';

export default function MintingInterfaceExample() {
  return (
    <PrivyProviderWrapper>
      <div className="min-h-screen bg-background">
        <MintingInterface />
      </div>
    </PrivyProviderWrapper>
  );
}
