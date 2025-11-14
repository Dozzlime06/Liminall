import { Book, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Liminal Dreams
            </h3>
            <p className="text-sm text-muted-foreground">
              A collection of 5,555 unique NFTs on HyperEVM
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <a
              href="https://liminal-dreams.gitbook.io/liminal-dreams/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover-elevate active-elevate-2 border border-primary/20 transition-all"
              data-testid="link-gitbook"
            >
              <Book className="w-5 h-5" />
              <span className="font-medium">Documentation</span>
            </a>
            
            <div className="flex gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover-elevate active-elevate-2 border border-border/40"
                data-testid="link-twitter"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover-elevate active-elevate-2 border border-border/40"
                data-testid="link-discord"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© 2024 Liminal Dreams. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
