# Design-to-Component Mapping

This document shows the exact mapping of HTML design elements to React components.

## Race Lobby (race_lobby/code.html → RaceLobby.tsx)

| Design Element | HTML Class/Style | React Implementation |
|---|---|---|
| Background | `.pool-bg` with pool image & gradient | `backgroundImage` inline style with linear-gradient |
| Top Bar | `.h-16 border-b border-outline-variant` | `header` with same classes |
| Menu Icon | `material-symbols-outlined` "menu" | `<span className="material-symbols-outlined">menu</span>` |
| Title | `.text-xl font-semibold` "SWIM26" | `<h1>SWIM26</h1>` |
| Account Icon | `material-symbols-outlined` "account_circle" | Matched icon element |
| Location Card | `.bg-surface/10 backdrop-blur-md border border-white/10 p-4` | Exact Tailwind classes replicated |
| Course Card | Same as location | Replicated with matching structure |
| Event Card | Same as location | Replicated with matching structure |
| Lane 1-3, 5-8 | `.bg-surface-container-lowest/5 border-l-4 border-transparent hover:bg-white/10 h-12` | Conditional rendering with same classes |
| Lane 4 (User) | `.bg-primary/20 border-l-4 border-primary h-16 shadow-[0_0_20px_rgba(15,98,254,0.3)]` | Special styling preserved exactly |
| Lane Number | `.w-12 flex justify-center text-white/50 font-bold` | Matching structure |
| Flag Icon | `.h-4 w-6 object-cover` image elements | Image elements with exact dimensions |
| Swimmer Name | `.text-white font-medium` | Text styling preserved |
| Time | `.text-white/40 text-sm` | Color opacity and size matched |
| Star Icon | `material-symbols-outlined` "star" with FILL=1 | Icon with `fontVariationSettings: 'FILL' 1'` |
| START RACE Button | `.bg-primary text-white font-semibold py-4 px-12 shadow-[0_0_30px_...]` | Button with exact shadow and padding |
| Bottom Nav | `.h-16 bg-surface border-t border-outline-variant flex justify-around` | Navigation structure and styling |
| Nav Icons | `material-symbols-outlined` (home, emoji_events, public, person_4) | All icons preserved with exact names |

## Race Gameplay HUD (race_gameplay_interface/code.html → RaceGameplayHUD.tsx)

| Design Element | HTML Class/Style | React Implementation |
|---|---|---|
| Background Image | 3D pool underwater image with overlay | `<img>` with exact URL and gradient overlay |
| Water Overlay | `.absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background/80` | Gradient div with same classes |
| HUD Layer | `.relative z-10 h-full w-full flex flex-col justify-between p-6` | Container with spacing preserved |
| Timer Panel | `.glass-panel p-4 flex flex-col gap-1 skew-12 border-l-4 border-primary` | Glass effect with custom `-skew-x-12` class |
| Timer Icon | `material-symbols-outlined` "timer" with FILL=1 | Icon element with font-variation-settings |
| Timer Display | `.font-headline italic text-2xl tracking-tighter` "00:24.82" | Typography classes matched exactly |
| Split Label | `.font-label text-[10px] tracking-widest text-on-surface-variant` | Label styling preserved |
| Rank Display | `.font-headline italic text-secondary text-xl` "2nd" | Secondary color for rank |
| Progress Bar | `.glass-panel h-14 skew-12 relative flex items-center px-6 overflow-hidden` | Glass panel with skew transform |
| Progress Track | `.w-full h-1.5 bg-surface-container-highest` | Track background color matched |
| Progress Fill | `.h-full bg-secondary shadow-[0_0_15px_rgba(195,244,0,0.5)]` | Secondary green with glow shadow at 48% |
| Competitor Markers | `.absolute h-4 w-1 bg-primary` and `.bg-on-surface-variant` | Positioned markers with exact colors |
| Distance Display | `.font-headline italic text-lg` "24" and `.font-label` "/ 50m" | Typography hierarchy preserved |
| User Status Panel | `.glass-panel px-6 py-2 skew-x-12 border-r-4 border-secondary` | Glass panel with right border |
| Status Label | `.font-label text-[10px] tracking-[0.2em] text-on-surface-variant` "STATUS" | Label styling exactly matched |
| Level Display | `.font-headline italic text-xl` "LVL 99" | Headline font with italic |
| Profile Icon Box | `.h-10 w-10 bg-primary-container flex items-center justify-center -skew-x-12` | Icon container with skew |
| Corner Brackets | `.absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/50` | Four corner bracket divs |
| Velocity Line | `.absolute left-1/2 bottom-0 h-16 w-[1px] bg-gradient-to-t from-secondary to-transparent` | Gradient line in center |
| Left Stroke Panel | `.h-full w-48 glass-panel border-t-4 border-primary/30 flex flex-col items-center justify-center` | Left control area with glass effect |
| Stroke Icon | `material-symbols-outlined` "touch_app" text-6xl text-primary | Large icon in background opacity-20 |
| Stroke Label | `.font-label text-[10px] tracking-[0.3em] text-primary mb-2` "LEFT STROKE" | Label with color and spacing |
| Stroke Gauge | `.w-12 h-1 bg-primary/20 overflow-hidden` with inner fill | Horizontal progress bar at 50% |
| Stamina Meter | SVG circle with `cx="64" cy="64" r="58" stroke-dasharray="364" stroke-dashoffset="100"` | SVG circle implemented with exact values |
| Stamina Fill Color | `.text-secondary shadow-[0_0_10px_#c3f400]` | Green color with glow effect on circle |
| Stamina Text | `.font-headline italic text-3xl` "72%" and `.font-label text-[8px]` "STAMINA" | Typography for percentage and label |
| Power Gauge | `.h-4 bg-surface-container-highest flex p-0.5 skew-12` | Horizontal bar with 85% fill |
| Power Fill | `.bg-primary w-[85%] shadow-[0_0_15px_rgba(0,212,236,0.3)]` | Cyan fill with glow shadow |
| Right Stroke Panel | `.h-full w-48 glass-panel border-t-4 border-secondary/30` | Mirror of left panel with secondary color |
| Right Stroke Label | `.font-label text-[10px] tracking-[0.3em] text-secondary mb-2` "RIGHT STROKE" | Secondary colored label |
| Right Gauge | `.w-12 h-1 bg-secondary/20 overflow-hidden` with inner 75% fill | Progress bar at 75% |
| Interaction Cue | `.font-headline italic text-secondary text-4xl uppercase tracking-tighter animate-pulse` | Pulsing "Perfect Timing!" message |
| Velocity Burst | `.font-label text-[10px] tracking-[0.5em] text-white/50` "+25% VELOCITY BURST" | Smaller subtext |
| Ticker Bar | `.fixed bottom-0 left-0 w-full bg-surface-container-lowest h-6 border-t border-outline-variant/15` | Fixed bottom ticker |
| Ticker Content | `.flex whitespace-nowrap gap-12 px-4` with multiple message divs | Scrolling messages with color dots |

## Social Club Screen (social_club/code.html → SocialClubScreen.tsx)

| Design Element | HTML Class/Style | React Implementation |
|---|---|---|
| Top Bar | `.h-16 flex items-center justify-between px-6 bg-surface-container border-b border-outline-variant/20 sticky top-0` | Header with position sticky |
| Waves Icon | `material-symbols-outlined` "waves" with FILL=1 text-primary text-3xl | Icon with styling preserved |
| Title | `.font-headline font-bold text-2xl tracking-tighter uppercase italic` with `.text-glow` | Title with custom glow effect |
| Currency Bar | `.bg-surface-container-highest px-4 py-1 flex items-center gap-4` | Currency display box |
| Club Crest Card | `.relative overflow-hidden bg-surface-container-high p-8 flex flex-col items-center justify-center text-center` | Card with background image overlay |
| Crest Background | `.absolute inset-0 opacity-20 pointer-events-none` with pool image | Background image at 20% opacity |
| Medal Icon Box | `.w-32 h-32 bg-primary flex items-center justify-center mb-4 transform -skew-x-12 border-4 border-on-primary` | Icon box with skew transform |
| Medal Icon | `material-symbols-outlined` "military_tech" with FILL=1 | Icon inside box |
| Team Name | `.font-headline text-4xl font-black italic uppercase -skew-x-6` "Team SWIM" | Skewed text element |
| Rank Label | `.font-label text-primary text-sm tracking-[0.2em] font-bold mt-2` "ELITE DIVISION..." | Small label text |
| Stats Grid | `.mt-8 grid grid-cols-2 gap-4 w-full` | Two-column grid for stats |
| Active Members Stat | `.bg-surface-container-lowest p-4 text-left border-l-2 border-primary` | Stat box with left border |
| Stat Label | `.text-[10px] uppercase font-bold text-on-surface-variant` | Small uppercase label |
| Stat Value | `.text-2xl font-headline font-bold italic` "142/150" | Large bold number |
| Active Members List | `.bg-surface-container p-6 flex flex-col flex-1 min-h-[400px]` | Container for member list |
| Members Header | `.flex items-center justify-between mb-6` | Header row |
| Online Count Badge | `.bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-bold tracking-tighter` "ONLINE: 48" | Badge with primary color |
| Member Row | `.flex items-center gap-4 bg-surface-container-low p-3 hover:bg-surface-container-high transition-colors group` | List item with hover state |
| Avatar Container | `.relative` with `.w-12 h-12 bg-outline-variant overflow-hidden` | Avatar box with online dot |
| Online Indicator | `.absolute -bottom-1 -right-1 w-3 h-3 bg-primary border-2 border-surface` | Green dot for online status |
| Member Name | `.font-headline font-bold text-sm tracking-tight italic` | Name in headline font |
| Member Info | `.text-[10px] text-on-surface-variant uppercase` | Level and specialty text |
| Send Icon | `material-symbols-outlined` "send" with opacity-0 group-hover:opacity-100 | Hidden until hover |
| View Roster Button | `.mt-auto w-full bg-surface-container-highest py-3 font-label text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-primary hover:text-on-primary transition-all` | Full-width button with hover state |
| Chat Panel | `.flex-1 glass-panel flex flex-col relative overflow-hidden min-h-[600px] border-t-4 border-primary` | Main chat container with glass effect |
| Chat Texture | `.absolute inset-0 opacity-5 pointer-events-none` with gradient | Background texture div |
| Chat Header | `.relative z-10 flex items-center justify-between p-6 border-b border-outline-variant/30` | Header section |
| Hub Icon | `material-symbols-outlined` "groups" text-primary | Icon for hub |
| Hub Title | `.font-headline text-xl font-bold italic uppercase tracking-tight` "Global Hub" | Title text |
| Active Count | `.text-[10px] text-on-surface-variant font-bold tracking-widest` | Subtitle with count |
| Filter Button | `.w-10 h-10 flex items-center justify-center bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-colors` | Small icon button |
| Settings Button | `.w-10 h-10 flex items-center justify-center bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-colors` | Small icon button |
| Messages Container | `.relative z-10 flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse` | Scrollable message area |
| Other User Message | `.flex gap-4 max-w-[80%]` | Message bubble container |
| Own Message | `.flex gap-4 flex-row-reverse self-end max-w-[80%] text-right` | Right-aligned own message |
| Avatar Image | `.w-10 h-10 bg-outline-variant` | Small avatar box |
| Message Bubble | `.bg-surface-container-high p-3 relative transform -skew-x-2` (others) or `.bg-primary/20 p-3 relative transform skew-x-2 border-r-2 border-primary` (own) | Skewed bubble with different colors |
| Badge | `.text-[8px] bg-secondary-container px-1 text-on-secondary-container font-black` (MVP) or `.text-[8px] bg-primary text-on-primary px-1 font-black` (CAPTAIN) | Color-coded role badges |
| Message Time | `.text-[9px] text-on-surface-variant font-bold` | Timestamp text |
| Input Area | `.relative z-10 p-6 bg-surface-container-highest/80 border-t border-outline-variant/30` | Input section |
| Input Box | `.flex items-center gap-4 bg-surface-container-lowest p-1` | Input container |
| Input Field | `.flex-1 bg-transparent border-none focus:ring-0 font-label text-sm uppercase placeholder:text-on-surface-variant/50 px-4` | Text input |
| Send Button | `.bg-primary text-on-primary w-12 h-12 flex items-center justify-center hover:bg-primary-container transition-all` | Send button |
| Slanted Card 1 | `.bg-surface-container-high slanted-right h-24 flex items-center px-8 group hover:bg-surface-container-highest transition-colors cursor-pointer border-r-4 border-primary/40` | Clipped card with custom CSS |
| League Rank Icon | `material-symbols-outlined` "emoji_events" with FILL=1 text-4xl text-primary-fixed | Icon with styling |
| League Rank Text | `.font-headline text-2xl font-black italic uppercase` "#142 GLOBAL" | Rank display |
| Slanted Card 2 | `.bg-surface-container-high h-24 flex items-center px-8 border-l-4 border-secondary` | Left-clipped card with secondary border |
| Social Feed Icon | `material-symbols-outlined` "notifications_active" with FILL=1 text-4xl text-secondary | Icon with styling |
| Notification Count | `.font-headline text-2xl font-black italic uppercase` "24 NEW NOTIFICATIONS" | Count display |
| Bottom Nav | `.h-20 bg-surface-container border-t border-outline-variant/20 flex items-center justify-around px-2 sticky bottom-0 z-50` | Navigation bar |
| Nav Links | `.flex flex-col items-center gap-1 w-full` | Navigation buttons |
| Active Nav Item | `.text-primary border-t-2 border-primary pt-1` | Social tab active state |

## Championship Screen (national_championships/code.html → ChampionshipScreen.tsx)

| Design Element | HTML Class/Style | React Implementation |
|---|---|---|
| Top Nav | `.fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 px-4 h-16` | Fixed navigation bar |
| Waves Icon | `material-symbols-outlined` "waves" with FILL=1 text-primary | Icon element |
| Title | `.font-headline font-bold text-xl tracking-tighter` "SWIM26" | Navigation title |
| Currency Box | `.bg-surface-container-highest px-4 py-1 -skew-x-12 border border-primary/30` | Skewed currency display |
| Currency Text | `.skew-x-12 flex items-center gap-4 text-xs font-label font-bold text-primary` | Inner text with counter-skew |
| Hero Section | `.relative h-[45vh] w-full overflow-hidden` | Hero container |
| Hero Background | `<img>` with `.absolute inset-0 w-full h-full object-cover opacity-60` | Background image at 60% opacity |
| Hero Gradient | `.absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent` | Gradient overlay |
| Hero Content | `.absolute inset-0 flex flex-col items-center justify-center text-center px-6` | Centered content |
| Medal Icon Glow | `.mb-4 relative` with `.absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full` | Yellow glow background |
| Medal Icon | `material-symbols-outlined` "military_tech" with FILL=1 text-8xl text-yellow-400 | Large gold icon with drop-shadow |
| Hero Title | `.font-headline text-5xl md:text-7xl font-bold italic uppercase tracking-tighter leading-none -skew-x-12` "National Championships" | Skewed title text |
| Title Accent | `<span class="text-primary">` "Championships" | Cyan colored word |
| Hero Subtitle | `.mt-4 font-label text-sm uppercase tracking-[0.3em] text-on-surface-variant` "Season 26..." | Small subtitle text |
| Action Bar | `.max-w-5xl mx-auto px-6 -mt-8 relative z-10` | Positioned container |
| Action Panel | `.flex flex-col md:flex-row gap-4 items-center justify-between p-6 glass-panel border-l-4 border-primary` | Glass panel with left border |
| Prize Pool Label | `.text-[10px] uppercase font-label text-on-surface-variant` "Prize Pool" | Label text |
| Prize Amount | `.text-2xl font-headline font-bold text-yellow-400` "50,000 GOLD" | Gold colored amount |
| Registration Label | `.text-[10px] uppercase font-label text-on-surface-variant` "Registration" | Label text |
| Registration Status | `.text-2xl font-headline font-bold` "CLOSING SOON" | Status text |
| Register Button | `.bg-primary hover:bg-primary-dim text-on-primary font-headline font-bold px-10 py-4 uppercase tracking-wider -skew-x-12 transition-all` | Skewed button with hover |
| Button Text | `<span class="inline-block skew-x-12">` "Register Now" | Counter-skewed text inside button |
| Competition Grid | `.max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8` | 12-column grid layout |
| Heats Column | `.lg:col-span-7` | Left side taking 7 cols |
| Heats Header | `.flex items-end justify-between mb-8 border-b border-outline-variant/30 pb-2` | Header row |
| Heats Title | `.font-headline text-3xl font-bold italic uppercase` "Top 8 Heats" | Section title |
| Live Badge | `.font-label text-xs text-primary font-bold` "LIVE UPDATES" | Badge text |
| Heat Card (Top) | `.group flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-colors relative overflow-hidden` | Highlighted heat |
| Yellow Border | `.absolute left-0 top-0 bottom-0 w-1 bg-yellow-400` | Left border indicator |
| Heat Rank | `.font-headline text-2xl font-bold italic text-on-surface-variant w-8` "01" | Rank number |
| Heat Avatar | `.h-12 w-12 bg-surface-variant relative` | Avatar container |
| Avatar Image | `.w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all` | Image with hover grayscale removal |
| Athlete Name | `.font-headline font-bold text-lg leading-none` "MARCUS REED" | Name text |
| Team/Lane | `.text-xs font-label text-on-surface-variant uppercase mt-1` "Titan Aquatics • Lane 4" | Team and lane info |
| Time Display | `.font-headline font-bold text-xl text-primary tracking-tight` "21.42s" | Cyan colored time |
| Record Badge | `.bg-yellow-400/10 text-yellow-400 text-[10px] px-2 py-0.5 inline-block font-bold` "RECORD PACE" | Gold badge |
| Other Heats | `.flex items-center justify-between p-4 bg-surface-container-low/60 relative overflow-hidden` | Grayscale heat cards |
| View Leaderboard | `.p-4 border border-dashed border-outline-variant/30 flex justify-center cursor-pointer hover:bg-surface-container-low transition-all` | Dashed border button |
| Bracket Column | `.lg:col-span-5` | Right side taking 5 cols |
| Bracket Title | `.font-headline text-xl font-bold italic uppercase mb-4 border-l-4 border-yellow-400 pl-4` "Quarter Finals" | Title with gold left border |
| Bracket Panel | `.glass-panel p-6 space-y-6` | Glass panel container |
| Matchup | `.space-y-1` | Matchup container |
| Winner Row | `.flex justify-between items-center bg-surface-container-highest p-2 border-r-4 border-primary` | Top participant in match |
| Winner Name | `.font-label text-xs font-bold` "M. REED" | Participant name |
| Winner Status | `.font-headline font-bold text-primary` "WIN" | Status in primary color |
| Loser Row | `.flex justify-between items-center bg-surface-container p-2 opacity-50` | Bottom participant in match |
| Milestone Card | `.relative group p-6 overflow-hidden bg-surface-container-highest` with kinetic border | Card with border-image gradient |
| Standing Label | `.font-label text-[10px] uppercase text-primary font-bold mb-1` "Your Standing" | Label text |
| Tier Display | `.font-headline text-3xl font-bold italic mb-4` "TIER: ELITE" | Tier text |
| Progress Bar | `.h-2 w-full bg-surface-container-low mb-4` | Progress bar background |
| Progress Fill | `.h-full bg-primary` at 75% | Progress fill at 75% |
| Standing Text | `.font-body text-xs text-on-surface-variant` | Description text |
| Trending Icon | `material-symbols-outlined` "trending_up" absolute at bottom-right | Background decorative icon |
| Bottom Nav | `.fixed bottom-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/20 px-2 h-20` | Fixed bottom navigation |
| Nav Item | `.flex flex-col items-center gap-1 cursor-pointer transition-all px-4 pt-2` | Navigation item |
| Active Nav | `.border-t-2 border-primary` | Active state indicator |
| Nav Text | `.font-label text-[10px] font-bold uppercase` | Nav label text |

---

## Color Mapping Summary

### RGB to Hex Conversion
- Primary: `#81ecff` (cyan)
- Secondary: `#bfcafd` (lavender)
- Tertiary: `#f9f9f9` (off-white)
- Error: `#ff716c` (red)
- Background: `#070e1b` (dark navy)
- Surface: `#070e1b` (dark navy)
- Yellow Accent: `#FFD700` (gold)

### Used in RaceLobby (Light Theme)
- Primary: `#0f62fe` (IBM blue)
- Primary Fixed: `#78a9ff`
- Background: `#ffffff` (white)
- Surface: `#ffffff` (white)
- On-surface: `#161616` (dark text)
- On-surface-variant: `#525252` (medium text)

All colors, spacing, typography, and effects have been exactly replicated in React components using Tailwind CSS classes and inline styles where necessary.
