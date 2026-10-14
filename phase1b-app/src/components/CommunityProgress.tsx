import { Button, ChevronRightIcon, ProgressIndicator } from '@walmart/ld-kit';
import type { ProgressState } from '../pages/CommunityHomePage';

type CommunityProgressProps = {
  progress: ProgressState;
  onOpen: () => void;
};

export function CommunityProgress({ progress, onOpen }: CommunityProgressProps) {
  return (
    <section className="progress-section" aria-labelledby="progress-heading">
      <div className="progress-section-heading">
        <div>
          <p className="eyebrow">Your Community progress</p>
          <h2 id="progress-heading">Keep shaping what comes next</h2>
        </div>
        <span className="progress-points" aria-hidden="true">
          {progress.label}
        </span>
      </div>

      <div className="progress-control" data-testid="community-progress">
        <div className="progress-visual" aria-hidden="true">
          <ProgressIndicator
            label={progress.label}
            max={100}
            value={progress.percent}
            valueLabel={progress.label}
            variant={progress.isComplete ? 'success' : 'info'}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          aria-label={`View Community progress: ${progress.label}`}
          onClick={onOpen}
          UNSAFE_className="progress-hit-target"
        >
          <span className="sr-only">View Community progress</span>
          <span className="progress-arrow" aria-hidden="true">
            <ChevronRightIcon />
          </span>
        </Button>
      </div>

      <p className="progress-helper">
        Tap to see what your next Community milestone unlocks.
      </p>
    </section>
  );
}
