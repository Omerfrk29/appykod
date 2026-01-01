# New Design Implementation Plan

## Overview

Update the AppyKod website to match the new design while preserving existing functionality and sections.

## Design Decisions

| Decision | Choice |
|----------|--------|
| Existing sections (TechStack, Process, Testimonials) | Keep but update to new design language |
| Featured Products section | Add as new section alongside existing Projects |
| Gradient blobs | Canvas-based animated blobs |
| Language/Theme toggles | Keep in navbar, next to "Free estimate" button |
| Holiday theme | Temporarily disabled during update |

## Color Palette

```
Background Main: #0F1117
Background Cards: #14161F
Primary Accent: #FF6B4E (Orange)
Accent Gold: #FFB067
Accent Teal: #52C1B8
Text Primary: #FFFFFF
Text Secondary: #9CA3AF
```

## Components to Update

### 1. Navbar (`Navbar.tsx`)
- New layout: Logo | Menu Links | [Lang] [Theme] [Free estimate]
- Fixed position with blur backdrop on scroll
- Orange underline animation on hover
- "Free estimate" orange button with glow effect

### 2. Hero (`Hero.tsx`)
- Left side: Large title "Discover the Projects that We Are Proud Of"
- "Projects" word with gradient text
- Subtitle text and "Get in Touch" CTA button
- Bottom: Social icon + reference text
- Right side: Canvas animated gradient blobs
- Blobs: Orange→Yellow, Teal→Blue gradients with slow floating animation

### 3. Services → Our Approach (`Services.tsx`)
- Header: "Our Approach" label + "We Make Every Project Feel Personal because Our Clients Matter"
- 3 cards: Flawless UX/UI, Custom Graphics (orange highlight), Best Developers
- Middle card has orange background (#FF6B4E)
- Icon, title, description in each card
- Hover scale animation

### 4. Featured Products (`FeaturedProducts.tsx`) - NEW
- Section title with orange left border
- Alternating left-right layout for products
- AppyFlow: Workflow automation tool
- KodSecure: Security software
- Each: Icon, name, description, "View Product" button, illustration

### 5. CTA Section (in `Contact.tsx`)
- Dark background section before contact form
- "Ready to transform your business?" heading
- Subtitle text
- Orange "Start Your Project" button

### 6. Footer (`Footer.tsx`)
- Minimal single-row layout
- Left: Logo
- Center: Copyright text
- Right: Social media icons

### 7. Style Updates for Existing Sections
- **TechStack**: Dark background, new card styles
- **Projects**: Keep grid, add new hover effects
- **Process**: Step cards with new color palette
- **Testimonials**: Dark theme cards, orange accents
- **Contact**: Form style update, dark background

## New Components

### AnimatedBlobs (`AnimatedBlobs.tsx`)
- Canvas-based component
- 2-3 gradient blobs with Gaussian blur
- Slow floating animation using requestAnimationFrame
- Colors: Orange→Yellow, Teal→Blue gradients

## Files to Modify

1. `src/components/Navbar.tsx`
2. `src/components/Hero.tsx`
3. `src/components/Services.tsx`
4. `src/components/TechStack.tsx`
5. `src/components/Projects.tsx`
6. `src/components/Process.tsx`
7. `src/components/Testimonials.tsx`
8. `src/components/Contact.tsx`
9. `src/components/Footer.tsx`
10. `src/app/globals.css`
11. `src/app/page.tsx`

## New Files to Create

1. `src/components/AnimatedBlobs.tsx`
2. `src/components/FeaturedProducts.tsx`

## Implementation Order

1. Update `globals.css` with new color variables and animations
2. Create `AnimatedBlobs.tsx` component
3. Update `Navbar.tsx`
4. Update `Hero.tsx` with new layout and blobs
5. Update `Services.tsx` to "Our Approach" design
6. Create `FeaturedProducts.tsx`
7. Update `Footer.tsx`
8. Add CTA section to `Contact.tsx`
9. Update remaining sections (TechStack, Projects, Process, Testimonials)
10. Update `page.tsx` to include new components
11. Disable holiday theme temporarily
12. Test and fix any issues

## Technical Notes

- Preserve all existing functionality (i18n, theme toggle, API calls)
- Keep Framer Motion animations but update to match new design
- Maintain responsive design (mobile-first)
- Use `prefers-reduced-motion` for accessibility
- Canvas blobs should be performant (use `will-change`, limit repaints)
