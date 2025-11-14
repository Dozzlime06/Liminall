import Header from '@/components/Header';
import MintingInterface from '@/components/MintingInterface';
import NFTGallery from '@/components/NFTGallery';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <MintingInterface />
        <NFTGallery />
      </main>
      <Footer />
    </div>
  );
}
