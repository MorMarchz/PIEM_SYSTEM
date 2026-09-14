---
name: Precision Dark Utility
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  mono-metric:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  micro-code:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-density, professional financial instrument tailored for high-focus personal wealth tracking and cashflow analysis. Drawing heavy influence from developer-centric tools like Linear, Raycast, and the Vercel Dashboard, the system prioritizes clarity, extreme information density, low latency visuals, and deliberate visual hierarchy over ornamental decoration.

The design movement combines **Utility-Driven Minimalism** with subtle **Precision Glassmorphism**. The visual plane sits in deep space, letting vibrant semantic colors (emerald for inflows, rose for outflows, indigo for focal execution) act as immediate cognitive beacons. 

### Core Design Principles
- **Command-Center Density:** Compact margins, tight row paddings, and precise tabular micro-typography allow complex financial narratives to unfold on a single viewport without cognitive overload.
- **Atmospheric Luminance:** Depth is not generated via harsh physical shadows, but through stacked surface luminescences, delicate linear edge borders (`rgba(255, 255, 255, 0.07)`), and localized radial glows.
- **Dual-Script Equilibrium:** English typography alongside Thai characters must share optical weight, vertical baseline alignment, and rhythmic tracking without glyph clipping.

## Colors

The palette is engineered specifically for prolonged, low-fatigue financial management. Black is avoided in favor of deep space midnight slate, which prevents contrast clipping while preserving stark semantic delineation.

### Palette Architecture
- **Base Canvas (`#080C14`):** The foundational viewport floor. Pure absorbing deep blue-black.
- **Surface Elevation 1 (`#0F172A`):** Navigational rails, macro layout sidebars, and structural backdrops.
- **Surface Elevation 2 / Card (`#131C2E`):** Analytical containers, transaction panels, and KPI modules.
- **Glass Overlays:** Translucent surfaces use `rgba(19, 28, 46, 0.75)` combined with `backdrop-filter: blur(12px)`.
- **Structural Lines:** Delimiting borders use hairline `rgba(255, 255, 255, 0.07)` across all container boundaries. Sub-element divider lines sit at `rgba(255, 255, 255, 0.04)`.

### Semantic Accents
- **Primary / Focus (`#6366F1` - Indigo):** Primary calls to action, focus outlines, selected navigation states, active time-series trackers.
- **Income / Surplus (`#10B981` - Emerald):** Positive yields, earned income streams, positive delta indicators.
- **Expense / Outflow (`#F43F5E` - Rose):** Expenditures, debts, negative delta metrics, destructive actions.
- **Warning / Pending (`#F59E0B` - Amber):** Uncategorized transactions, budget threshold alerts, scheduled outflows.
- **Secondary Analytics (`#8B5CF6` - Purple):** Investment allocations, recurring amortizations, long-term savings goals.

### Text Contrast Tiers
- **Primary Text (`#F1F5F9`):** Key metrics, transaction titles, ledger balances. Contrast ratio > 14:1 against base.
- **Secondary Text (`#64748B`):** Category tags, metadata, timestamps, secondary navigation.
- **Muted / Placeholder (`#334155`):** Deactivated states, empty table fields, input hint text.

## Typography

Typography relies on **Inter** with OpenType features actively enforced (`tnum` for tabular lining numbers, `cv05`, and `cv11` for technical legibility). Financial figures must never shift or oscillate layout widths during live calculations; `font-variant-numeric: tabular-nums` is mandatory for all monetary data cells.

### Bilingual Typesetting Rules (Thai & English)
- **Thai Font Fallback:** Inter pairs seamlessly with system-native fonts (`SF Pro TH`, `Sukhumvit Set`, or Google Font `Noto Sans Thai`) as secondary fallbacks.
- **Line-Height Safety:** Thai diacritics (e.g., ไม้เอก, ไม้โท, สระบน/สระล่าง) demand vertical clearance. Body typography line-heights are locked to a minimum of 1.38x to prevent truncation of ascenders and descenders.
- **Optical Weight Matching:** When rendering Thai strings adjacent to English currencies (e.g., `฿14,250.00 / เดือน`), Thai glyphs are set at one grade higher or matching weight (`500 Medium`) to counteract their lower optical density compared to Latin letterforms.

## Layout & Spacing

The layout is built on an adaptive fluid grid model rooted in a rigid 4px base increment. It mirrors desktop workstation tools, balancing ultra-efficient screen real estate usage with structural breathing room.

### Form Factor Behavior
- **Desktop (>= 1280px):** 12-column grid. Left fixed navigational panel (240px or icon-collapsed 64px). Analytical split screens (6/6 or 8/4 layout for ledger feeds alongside real-time expense charts). Margins set to `2rem`, gutters to `1.5rem`.
- **Tablet (768px - 1279px):** 8-column layout. Sidebar transitions into an elevated sheet or compact rail. Margins scale to `1.5rem`, gutters maintain `1rem`.
- **Mobile (< 768px):** Single-column stacked stream. Pinned top navigation bar with secondary tab navigation pinned bottom-safe. Edge margins compress to `1rem` (`16px`) to prioritize tabular data legibility.

### Spacing Application
- `space-xs` (4px): Metric icon-to-label gaps, tag internal paddings.
- `space-sm` (8px): Form input inner paddings, list row gaps, button vertical bounds.
- `space-md` (12px): Standard button horizontal padding, dense list cell paddings.
- `space-lg` (20px): Inner perimeter padding for analytic cards and modular panels.
- `space-xl` (32px): Inter-section spacing, ledger block separation.

## Elevation & Depth

Visual layers are defined through stacked slate luminances, semi-transparent frosted backdrops, and subtle top-lit inner highlights.

### Elevation Hierarchy
1. **Level 0 (Floor `#080C14`):** Canvas backdrop. Flat, non-reflective.
2. **Level 1 (Sub-Panel `#0F172A`):** Grouped regions, nested tables, inactive sidebars. Sealed with hairline border `rgba(255, 255, 255, 0.05)`.
3. **Level 2 (Active Cards `#131C2E`):** Core interactive cards, KPI panels. Features an internal top highlight: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`. Outer edge: `1px solid rgba(255, 255, 255, 0.07)`.
4. **Level 3 (Floating Menus / Raycast Overlays):** Command palettes, transaction filters, popovers. Background: `rgba(19, 28, 46, 0.85)` with `backdrop-filter: blur(16px)`. Shadow: `0 16px 36px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.1)`.

### Accent Edge Glows
Interactive active states (such as active search queries or hovered KPI cards) utilize a localized accent border glow:
- Card hover: `box-shadow: 0 0 20px -4px rgba(99, 102, 241, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)`.
- Input focus: `outline: none`, `border-color: #6366F1`, `box-shadow: 0 0 0 1px #6366F1, 0 0 14px 0 rgba(99, 102, 241, 0.25)`.

## Shapes

The geometric identity relies on distinct roundedness tiers: compact inner controls maintain tight geometry, while structural boundaries provide modern softness.

- **Primary Interactive Controls (Buttons, Inputs, Selectors):** Fixed at `8px` (`rounded-md` equivalent). This retains a sharp, tool-like edge suitable for rapid desktop interaction.
- **Containers & Dashboard Panels (Cards, Modal Sheets):** Fixed at `14px` (`border-radius: 14px`). This softens macro analytical blocks without descending into casual consumer roundness.
- **Status Pills, Shortcut Badges, Micro-Chips:** Fully rounded (`9999px`) or `6px` for square keyboard indicators (`kbd`).

## Components

### Buttons
- **Primary:** Background `#6366F1`, color `#F1F5F9`, border-radius `8px`, height `36px`, padding `0 14px`. Subtly lit top border: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`. Hover: `#4F46E5`.
- **Secondary / Ghost:** Background `rgba(255, 255, 255, 0.03)`, border `1px solid rgba(255, 255, 255, 0.07)`, color `#F1F5F9`. Hover: background `rgba(255, 255, 255, 0.07)`, border-color `rgba(255, 255, 255, 0.12)`.
- **Danger (Expense Deletion):** Background `rgba(244, 63, 94, 0.1)`, border `1px solid rgba(244, 63, 94, 0.25)`, color `#F43F5E`. Hover: Background `rgba(244, 63, 94, 0.2)`.

### Input Fields & Selects
- Height `36px`, border radius `8px`. Background `#080C14`, border `1px solid rgba(255, 255, 255, 0.08)`. Text `#F1F5F9`, placeholder `#334155`.
- Active focus triggers indigo border `#6366F1` and a soft `2px` ambient halo `rgba(99, 102, 241, 0.2)`.
- Numeric amount inputs must right-align and display currency prefixes (`THB ฿`, `$`) in `#64748B`.

### Cards & Analytic Panels
- Background `#131C2E`, border `1px solid rgba(255, 255, 255, 0.07)`, border radius `14px`, padding `20px`.
- Contains top highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`.
- KPI delta tags use pill containers:
  - Positive (Income/Gain): Text `#10B981`, background `rgba(16, 185, 129, 0.1)`.
  - Negative (Expense/Loss): Text `#F43F5E`, background `rgba(244, 63, 94, 0.1)`.

### Lists & Transaction Ledgers
- Table headers: Height `32px`, font-size `11px`, weight `600`, color `#64748B`, text-transform uppercase, letter-spacing `0.05em`.
- Rows: Height `44px`, horizontal border-bottom `1px solid rgba(255, 255, 255, 0.04)`.
- Hover state: Background `rgba(255, 255, 255, 0.02)`. Selected state: Background `rgba(99, 102, 241, 0.06)`.
- Amount column: Strictly right-aligned, monospaced tabular numbers (`font-variant-numeric: tabular-nums`). Outflows prefixed with `-`, inflows prefixed with `+`.

### Checkboxes & Segmented Toggles
- Checkboxes: `16px x 16px`, radius `4px`, border `1px solid rgba(255, 255, 255, 0.2)`, background `#080C14`. Checked: background `#6366F1`, border-color `#6366F1` with white SVG checkmark.
- Segmented Control (Income / Expense / Transfer Switch): Pill container `#080C14` with padding `3px`. Active segment: `#1E293B` background, `#F1F5F9` label, `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4)`.

### Raycast-Style Command Palette (Quick Add Modal)
- Overlay backdrop `rgba(8, 12, 20, 0.8)` with `backdrop-filter: blur(8px)`.
- Palette window: Width `640px`, radius `14px`, background `#0F172A`, border `1px solid rgba(255, 255, 255, 0.12)`, shadow `0 24px 48px rgba(0,0,0,0.8)`.
- Search & quick input: Single-line large field `48px`, font size `16px`, transparent background, zero border. Bottom shortcut keys rendered via `kbd` tokens (`#1E293B` background, `#64748B` text, `4px` radius).