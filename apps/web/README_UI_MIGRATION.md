# KT.ai UI Migration Notes

## Source of Truth
- Figma export: `apps/web/figma-ui/AI Project Onboarding Portal/`
- Integrated pages: Home (`/`), Learning Path (`/learning-path`), Exploration (`/exploration`)
- Legacy routes (unchanged): Dashboard (`/dashboard`), Tracker (`/tracker`) via `apps/web/legacy-ui/`

## Assets Policy
- Small UI assets belong in `apps/web/public/` (e.g., `public/screenshots/`).
- Truly large assets (e.g., >10MB animations, videos, PSDs):
  - Prefer Git LFS (store in `apps/web/public/large/` and track via LFS), or
  - Use an external bucket/CDN and reference by URL in the UI.

## Animated Background
- Placeholder Lottie JSON: `apps/web/public/animations/placeholder.json`
- Replace by swapping the file at that path or updating `AnimatedBackground.tsx`.

## Local API Configuration
- Set `NEXT_PUBLIC_API_BASE_URL` to point at your backend.
