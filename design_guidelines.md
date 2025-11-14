# Design Guidelines: Liminal Dreams NFT Minting DApp

## Design Approach
**Reference-Based Approach** drawing from premium NFT platforms (Art Blocks, Foundation, OpenSea) with a surreal, dreamlike aesthetic matching "Liminal Dreams." This is an experience-focused, visual-rich application where trust and aesthetic appeal drive engagement.

## Core Design Principles
1. **Ethereal Mystique**: Surreal, dreamlike atmosphere with subtle depth and layering
2. **Web3 Clarity**: Clear, trustworthy interface for financial transactions
3. **Premium Minimalism**: Sophisticated restraint with intentional visual moments

## Typography
- **Primary Font**: 'Space Grotesk' or 'Inter' for headers (geometric, modern)
- **Secondary Font**: 'Inter' or 'DM Sans' for body text (clean, readable)
- **Hierarchy**: 
  - H1 (Collection Name): 3rem (48px), font-weight 700, letter-spacing -0.02em
  - H2 (Section Headers): 2rem (32px), font-weight 600
  - Body: 1rem (16px), font-weight 400, line-height 1.6
  - Small text (addresses, numbers): 0.875rem (14px), font-weight 500, mono for addresses

## Layout System
**Tailwind Spacing Units**: 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, my-8, py-12, mt-16, py-24)
- Container: max-w-6xl mx-auto
- Page padding: px-4 md:px-8
- Component spacing: space-y-8 for vertical stacks
- Card padding: p-6 to p-8

## Component Library

### Header
- Full-width, fixed or sticky positioning
- Height: h-20 (80px)
- Flex layout: justify-between items-center
- Logo/Title on left, wallet connection on right
- Subtle border-bottom with gradient or glow effect
- Connected wallet shows truncated address with subtle badge/indicator

### Main Content Container
- Centered card-based layout: max-w-2xl mx-auto
- Main minting card: rounded-2xl with subtle border and backdrop blur effect
- Elevation through subtle shadows and layering

### Info Display Section
- Grid layout for stats: grid grid-cols-2 gap-4
- Each stat in its own card/box with label above value
- Use tabular numbers for supply counts
- Progress bar: h-3 rounded-full with gradient fill, animated transitions

### Minting Controls
- Large, prominent quantity input: h-14 text-center text-2xl
- Increment/decrement buttons flanking the input (± buttons)
- Total cost display: Large, bold number with $HYPE label
- Primary mint button: h-14 text-lg font-semibold, full-width, rounded-xl

### Status Messages
- Toast-style notifications or inline messages below button
- Success: subtle green glow
- Error: subtle red glow  
- Pending: pulsing animation

### Buttons
Primary (Mint):
- Height: h-12 to h-14
- Rounded: rounded-xl
- Font: font-semibold text-base
- Disabled state: reduced opacity with cursor-not-allowed
- Active state: transform scale-95, smooth transition
- Gradient background or solid with subtle glow on hover

Secondary (Connect Wallet):
- Height: h-10 to h-12
- Border style with hover fill
- Rounded: rounded-lg

### Progress Bar
- Container: h-2.5 to h-3, rounded-full, subtle inner shadow
- Fill: rounded-full, gradient from purple to pink/blue
- Smooth transition animation (transition-all duration-300)

## Visual Treatments

### Background
- Deep dark base (#0a0a0a to #0d0d0d)
- Subtle gradient overlay or radial gradient from center
- Optional: Animated grain texture or subtle particle effect (very understated)

### Cards/Containers
- Background: rgba(17, 17, 17, 0.8) with backdrop-blur
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Border radius: rounded-xl to rounded-2xl
- Subtle inner glow or shadow for depth

### Accents
- Primary: Purple (#6200ea, #7c3aed, #8b5cf6 range)
- Secondary: Cyan/blue for highlights (#06b6d4, #3b82f6)
- Success: Emerald (#10b981)
- Error: Red/pink (#ef4444, #ec4899)

### Glass Morphism Elements
- Use sparingly on main minting card or header
- backdrop-filter: blur(12px)
- Semi-transparent backgrounds

## Animations
**Use Minimally** - Only for:
- Button hover states (scale, glow)
- Progress bar fill (smooth transition)
- Number counter animations when supply updates
- Status message fade in/out
- Loading spinner on mint button

## Images
**Hero/Background**: Large atmospheric background image behind the main interface
- Surreal, dreamlike NFT artwork preview or abstract gradient mesh
- Positioned: fixed or absolute, full viewport
- Overlay: Dark gradient overlay (opacity 60-80%) to ensure text readability
- Optional: Subtle parallax effect on scroll

**Placement**: Background layer with main content card floating above

## Accessibility
- High contrast text on dark backgrounds (white/off-white #e5e5e5+)
- Focus states on all interactive elements with visible outline
- ARIA labels for wallet address truncation
- Loading states clearly communicated
- Error messages with icons and clear text

## Responsive Considerations
- Mobile: Stack all elements vertically, full-width cards with px-4 padding
- Tablet: Maintain card-based layout, max-w-lg to max-w-2xl
- Desktop: Centered card layout, max-w-2xl, generous py-24 spacing

## Key Visual Moments
1. **Header**: Sleek, minimal with wallet connection as primary action
2. **Supply Progress**: Visually prominent with animated fill
3. **Mint Button**: Hero moment - large, inviting, impossible to miss
4. **Transaction Feedback**: Clear, immediate status updates with appropriate emotional design (celebration for success, clarity for errors)