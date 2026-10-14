import { useEffect, useMemo, useState } from 'react';
import {
  BottomSheet,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  Icon,
  Page,
} from '@walmart/ld-kit';
import { CommunityProgress } from '../components/CommunityProgress';

const FIRST_MILESTONE = 250;
const BASIC_MILESTONE = 1_000;
const PREMIUM_MILESTONE = 3_000;

export type ProgressBand = 'first' | 'basic' | 'premium' | 'complete';

export type ProgressState = {
  points: number;
  percent: number;
  label: string;
  band: ProgressBand;
  isComplete: boolean;
  badge?: string;
  sheetCopy: string;
};

type HomeConfig = {
  arm: 1 | 2;
  points: number;
};

const numberFormatter = new Intl.NumberFormat('en-US');

function parseHomeConfig(): HomeConfig {
  const params = new URLSearchParams(window.location.search);
  const rawPoints = params.get('points');
  const parsedPoints = rawPoints === null ? 140 : Number(rawPoints);
  const points = Number.isFinite(parsedPoints) ? Math.max(0, Math.round(parsedPoints)) : 140;

  return {
    arm: params.get('arm') === '1' ? 1 : 2,
    points,
  };
}

function pointsLabel(points: number) {
  return numberFormatter.format(points);
}

function getProgressState(points: number): ProgressState {
  if (points >= PREMIUM_MILESTONE) {
    return {
      points,
      percent: 100,
      label: '3,000+ pts · All Foundation milestones reached',
      band: 'complete',
      isComplete: true,
      sheetCopy:
        "You've reached 3,000 points — our highest Foundation milestone! Premium in-home use test eligibility is being prepared — we'll let you know the moment it's ready.",
    };
  }

  if (points >= BASIC_MILESTONE) {
    return {
      points,
      percent: ((points - BASIC_MILESTONE) / (PREMIUM_MILESTONE - BASIC_MILESTONE)) * 100,
      label: `${pointsLabel(points)} / 3,000 pts`,
      band: 'premium',
      isComplete: false,
      sheetCopy:
        "You've reached 1,000 points! Basic in-home use test eligibility is being prepared — we'll let you know the moment it's ready.",
    };
  }

  if (points >= FIRST_MILESTONE) {
    return {
      points,
      percent: ((points - FIRST_MILESTONE) / (BASIC_MILESTONE - FIRST_MILESTONE)) * 100,
      label: `${pointsLabel(points)} / 1,000 pts`,
      band: 'basic',
      isComplete: false,
      badge: '250 Unlocked',
      sheetCopy:
        'Next up at 1,000 points: Basic in-home use test eligibility — coming soon.',
    };
  }

  return {
    points,
    percent: (points / FIRST_MILESTONE) * 100,
    label: `${pointsLabel(points)} / 250 pts`,
    band: 'first',
    isComplete: false,
    sheetCopy: "At 250 points, you'll unlock additional Community Home modules.",
  };
}

const scenarios = [
  { label: 'Below 250', href: '?arm=2&points=230' },
  { label: 'Above 250, below 1,000', href: '?arm=2&points=950' },
  { label: 'Above 1,000, below 3,000', href: '?arm=2&points=2000' },
  { label: 'Above 3,000', href: '?arm=2&points=3200' },
];

function CommunityLogo() {
  return (
    <div className="community-logo" aria-label="Member's Mark Community">
      <span className="community-logo-mark" aria-hidden="true">
        M
      </span>
      <span className="community-logo-copy">
        <strong>Member's Mark</strong>
        <span>Community</span>
      </span>
    </div>
  );
}

function FeedPlaceholder({
  title,
  description,
  accent,
  locked = false,
}: {
  title: string;
  description: string;
  accent: string;
  locked?: boolean;
}) {
  return (
    <article className={`feed-card ${accent} ${locked ? 'feed-card-is-locked' : ''}`}>
      {locked ? (
        <>
          <div className="feed-card-locked-art">
            <Icon name="Lock" a11yLabel="Locked" />
          </div>
          <div className="feed-card-copy feed-card-copy-locked">
            <h3>{title}</h3>
            <p>Unlock after 250 points to see what's new.</p>
          </div>
        </>
      ) : (
        <>
          <div className="feed-card-art" aria-hidden="true">
            <span className="art-orbit art-orbit-one" />
            <span className="art-orbit art-orbit-two" />
            <span className="art-spark" />
          </div>
          <div className="feed-card-copy">
            <p className="eyebrow">Member-powered</p>
            <h3>{title}</h3>
            <p>{description}</p>
            <Button variant="tertiary" size="small" trailing={<ChevronRightIcon />}>
              Learn more
            </Button>
          </div>
        </>
      )}
    </article>
  );
}

function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Primary navigation">
      <Button variant="ghost" type="button" aria-current="page" UNSAFE_className="bottom-nav-item is-active">
        <Icon name="Home" aria-hidden="true" />
        <span>Home</span>
      </Button>
      <Button variant="ghost" type="button" UNSAFE_className="bottom-nav-item">
        <Icon name="ShoppingBag" aria-hidden="true" />
        <span>Scan &amp; Go</span>
      </Button>
      <Button variant="ghost" type="button" UNSAFE_className="bottom-nav-item">
        <Icon name="Reorder" aria-hidden="true" />
        <span>Reorder</span>
      </Button>
      <Button variant="ghost" type="button" UNSAFE_className="bottom-nav-item">
        <Icon name="User" aria-hidden="true" />
        <span>Account</span>
      </Button>
      <Button variant="ghost" type="button" UNSAFE_className="bottom-nav-item">
        <Icon name="Grid" aria-hidden="true" />
        <span>Services</span>
      </Button>
    </nav>
  );
}

export default function CommunityHomePage() {
  const config = useMemo(parseHomeConfig, []);
  const progress = useMemo(() => getProgressState(config.points), [config.points]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <Page title="Community Home" titleVisuallyHidden>
      <div className="prototype-shell">
        <header className="top-header">
          <Button variant="ghost" type="button" aria-label="Go back" UNSAFE_className="header-back-button">
            <ChevronLeftIcon />
          </Button>
          <CommunityLogo />
          <Button variant="ghost" type="button" aria-label="Open member profile" UNSAFE_className="header-profile-button">
            <Icon name="UserCircle" aria-hidden="true" />
          </Button>
        </header>

        <div className="page-content">
          <section className="home-intro" aria-labelledby="home-heading">
            <div>
              <p className="eyebrow">Member's Mark Community</p>
              <h1 id="home-heading">Help shape what comes next.</h1>
              <p className="intro-copy">
                Share your perspective and see how your input helps make the member experience better.
              </p>
            </div>
            <div className="member-badge" aria-hidden="true">
              <span>MM</span>
            </div>
          </section>

          {config.arm === 2 && <CommunityProgress progress={progress} onOpen={() => setIsSheetOpen(true)} />}

          <section className="feed-section" aria-labelledby="feed-heading">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">From the community</p>
                <h2 id="feed-heading">What's new</h2>
              </div>
              <Button variant="tertiary" size="small" trailing={<ChevronRightIcon />}>
                See all
              </Button>
            </div>
            <div className="feed-grid">
              <FeedPlaceholder
                accent="feed-card-sage"
                title="Members are shaping the future"
                description="Your input helps guide what the Community explores next."
                locked={progress.points < FIRST_MILESTONE}
              />
              <FeedPlaceholder
                accent="feed-card-sand"
                title="A closer look at member ideas"
                description="See the latest stories inspired by feedback from the community."
                locked={progress.points < FIRST_MILESTONE}
              />
            </div>
          </section>

          <section className="community-note" aria-label="Community invitation">
            <div className="community-note-icon" aria-hidden="true">
              <Icon name="Users" />
            </div>
            <div>
              <h2>Your voice matters here.</h2>
              <p>Every contribution helps make Community more useful for members like you.</p>
            </div>
          </section>

          <section className="dev-panel" aria-labelledby="dev-panel-heading">
            <div className="dev-panel-header">
              <div>
                <p className="eyebrow">Prototype tools</p>
                <h2 id="dev-panel-heading">Quick-link scenarios</h2>
              </div>
              <span className="dev-pill">arm {config.arm} · {config.points} pts</span>
            </div>
            <div className="scenario-list">
              {scenarios.map((scenario) => (
                <Button key={scenario.href} href={scenario.href} variant="secondary" size="small">
                  {scenario.label}
                </Button>
              ))}
            </div>
          </section>
        </div>

        <BottomNavigation />

        <BottomSheet
          title="Your Community progress"
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          actions={
            <Button
              type="button"
              variant="primary"
              isFullWidth
              onClick={() => {
                console.log('Would open Community Pass page');
                setToast('Would open Community Pass page');
              }}
            >
              Learn more
            </Button>
          }
        >
          <div className={`sheet-content sheet-content-${progress.band}`}>
            <div className="sheet-progress-summary">
              <span className="sheet-summary-label">Current progress</span>
              <strong>{progress.label}</strong>
            </div>
            <div className="sheet-bar" aria-hidden="true">
              <span style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="sheet-copy">{progress.sheetCopy}</p>
            <p className="sheet-footnote">Your progress updates as you participate in Community activities.</p>
          </div>
        </BottomSheet>

        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    </Page>
  );
}
