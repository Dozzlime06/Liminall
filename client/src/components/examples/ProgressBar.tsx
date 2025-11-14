import ProgressBar from '../ProgressBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressBarExample() {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Progress Bar Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">25% Complete</p>
            <ProgressBar current={2500} max={10000} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">75% Complete</p>
            <ProgressBar current={7500} max={10000} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Nearly Sold Out</p>
            <ProgressBar current={9950} max={10000} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
