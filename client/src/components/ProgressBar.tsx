import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  max: number;
}

export default function ProgressBar({ current, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  return (
    <div className="space-y-2">
      <Progress value={percent} className="h-3" data-testid="progress-minting" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span data-testid="text-supply-current">{current.toLocaleString()}</span>
        <span data-testid="text-supply-max">{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
