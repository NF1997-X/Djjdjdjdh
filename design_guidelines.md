# Design Guidelines: Spotify-Style Multi-Page Image Gallery Manager

## Design Approach

**Selected Approach:** Reference-Based (Spotify-inspired)
**Justification:** User explicitly requested Spotify-style horizontal scrolling with enhanced functionality for a gallery management system.

**Key Design Principles:**
- Dark, immersive interface that puts content first
- Smooth, fluid transitions throughout the application
- Clean, minimalist controls that don't compete with visual content
- Touch-friendly interactions for cross-device compatibility

## Typography System

**Font Family:** 
- Primary: 'Inter' or 'Circular' (Spotify's actual font family)
- Fallback: system-ui, -apple-system, sans-serif

**Type Scale:**
- Page headers: text-3xl font-bold (30px)
- Section headlines: text-xl font-semibold (20px)
- Image titles: text-base font-medium (16px)
- Subtitles/metadata: text-sm (14px)
- UI controls/buttons: text-sm font-medium (14px)
- Helper text: text-xs (12px)

**Line Heights:**
- Headers: leading-tight (1.25)
- Body text: leading-normal (1.5)
- Compact UI: leading-none (1)

## Layout & Spacing System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (gaps, padding): p-2, p-4, gap-2
- Component spacing: p-6, p-8, m-4, m-6
- Section spacing: py-12, py-16, px-8
- Container max-width: max-w-7xl

**Grid System:**
- Desktop: 4-6 items per row in horizontal scroll
- Tablet: 3-4 items per row
- Mobile: 2-3 items per row

**Container Structure:**
- Outer wrapper: Full viewport width with centered content
- Content container: max-w-7xl with px-8 on desktop, px-4 on mobile
- Horizontal scroll containers: -mx-4 negative margins to break containment

## Component Library

### Navigation Components

**Top Navigation Bar:**
- Fixed position at top with backdrop blur
- Height: h-16 (64px)
- Contains: Logo/title (left), page navigation tabs (center), settings/user menu (right)
- Horizontal padding: px-8
- Navigation tabs: Use pill-style tabs with rounded-full borders, px-6 py-2
- Active state: Subtle underline or filled background

**Page Navigation:**
- Tab-based navigation for Page 1, Page 2, etc.
- Horizontal scrolling tabs on mobile if many pages
- Add page button: Circular icon button with plus symbol

### Horizontal Scroll Rows

**Row Container:**
- Section wrapper: py-8 border-b with subtle divider
- Header area: flex justify-between items-center mb-6
- Headline: text-xl font-semibold
- Controls: flex gap-4 (arrows, add button, row menu)

**Scroll Container:**
- Overflow-x: scroll with smooth scrolling
- Hide scrollbar: scrollbar-width-none
- Padding: pb-4 (for focus rings)
- Gap between items: gap-4 or gap-6

**Image Cards:**
- Aspect ratio: 1:1 (square) or 3:4 (portrait)
- Rounded corners: rounded-lg
- Card structure:
  - Image wrapper (relative container)
  - Image: object-cover w-full h-full
  - Hover overlay: Opacity transition with edit/delete buttons
  - Title: mt-3 text-base font-medium truncate
  - Subtitle: text-sm opacity-60

**Navigation Arrows:**
- Circular buttons: w-10 h-10 rounded-full
- Icon size: w-5 h-5
- Position: Absolute positioning on row header (desktop only)
- Disabled state: Reduced opacity (opacity-40)
- Smooth fade in/out based on scroll position

### CRUD Dialogs

**Modal Overlay:**
- Full viewport overlay with backdrop-blur-sm
- Center-aligned modal
- Modal width: max-w-2xl on desktop, full-width with px-4 on mobile
- Rounded corners: rounded-2xl
- Padding: p-8 on desktop, p-6 on mobile

**Upload Dialog:**
- Input field: Full-width text input with rounded-lg, h-12
- Preview area: Grid layout showing uploaded image
- Validation messages: text-sm below input with py-2
- Action buttons: flex gap-3 justify-end mt-8

**Edit Dialog:**
- Form fields vertically stacked with space-y-4
- Label: text-sm font-medium mb-2
- Input height: h-12 with px-4
- Image preview: Rounded thumbnail on left side

**Delete Confirmation:**
- Compact modal: max-w-md
- Warning icon at top
- Message: text-center with py-4
- Two-button layout: Cancel (secondary) and Delete (destructive)

**Row Management Dialog:**
- Add/Edit row name
- Input: h-12 rounded-lg with px-4
- Character counter: text-xs text-right mt-1

### Buttons & Controls

**Primary Action Button:**
- Height: h-12 with px-8
- Rounded: rounded-full
- Font: text-sm font-semibold
- Width: Auto-width with min-w-[120px] for primary actions

**Secondary Button:**
- Same dimensions as primary
- Outlined style with border-2

**Icon Buttons:**
- Square: w-10 h-10 for standard icon buttons
- Small: w-8 h-8 for compact contexts
- Rounded: rounded-full for circular, rounded-lg for square containers
- Icon size: w-5 h-5 standard, w-4 h-4 small

**Add Image Button:**
- Dashed border card matching image card dimensions
- Center-aligned plus icon: w-12 h-12
- Label below icon: "Add Image" text-sm

### Image Display

**LightGallery Integration:**
- Full viewport overlay
- Navigation: Arrow buttons on sides (w-12 h-12)
- Close button: Top-right, w-10 h-10
- Thumbnail strip: Bottom, h-20 with horizontal scroll
- Counter: Top-left showing "X of Y"
- Smooth zoom transitions

**Image Hover Effects:**
- Scale: hover:scale-105 with transition-transform duration-300
- Overlay: Fade in dark overlay (opacity-0 to opacity-60)
- Action buttons: Slide up from bottom or fade in
- Edit icon: Top-right corner, w-8 h-8
- Delete icon: Top-right adjacent to edit

## Transitions & Animations

**Global Transition Settings:**
- Standard duration: duration-300
- Easing: ease-in-out
- Apply to: transform, opacity, colors

**Specific Animations:**
- Horizontal scroll: scroll-behavior: smooth
- Modal entry: Scale from 95% to 100% with fade (duration-200)
- Button hovers: Scale 105% with duration-200
- Image card hover: Transform scale with duration-300
- Page transitions: Fade and slide with duration-400

**Restricted Animation Usage:**
- No auto-playing animations
- No continuous loop animations
- Scroll-triggered effects limited to subtle parallax or fade-ins
- Focus on micro-interactions only

## Responsive Breakpoints

**Mobile (< 640px):**
- Single column stacked layout
- 2 items per horizontal scroll row
- Navigation arrows hidden (swipe only)
- Full-width dialogs with bottom sheet treatment
- Touch targets: min 44x44px

**Tablet (640px - 1024px):**
- 3 items per row in horizontal scroll
- Side-by-side layout for some dialogs
- Navigation arrows appear
- Content max-width: max-w-4xl

**Desktop (> 1024px):**
- 4-6 items per row (configurable)
- All hover states active
- Mouse drag scrolling enabled
- Full modal dialogs centered
- Content max-width: max-w-7xl

## Special Features

**Drag & Drop Reordering:**
- Visual feedback: Slight elevation (shadow-xl) when dragging
- Drop zone indicators: Dashed outline
- Smooth position transitions during reorder

**Upload via URL:**
- Inline validation with visual feedback
- Preview thumbnail generation
- Error states with clear messaging

**Empty States:**
- Centered messaging with icon (w-16 h-16)
- Helpful text: "Add your first image" with text-lg
- Large add button below message

**Loading States:**
- Skeleton screens matching card dimensions
- Pulse animation for loading placeholders
- Spinner for async operations: w-6 h-6

## Images

This application is image-centric with user-uploaded content. No hero image needed - the gallery rows are the primary visual content. Use placeholder images (via Picsum or similar) for demonstration purposes in empty states and examples.