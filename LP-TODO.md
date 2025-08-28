# LP-TODO: Snow Landing Pages Progress Tracker

## 🎯 Current Focus: CICERO PAGE ONLY
**Goal**: Perfect one page before replicating to other towns

---

## ✅ COMPLETED
- [x] Directory structure created
- [x] Base CSS with mobile-first design + J and R brand colors
- [x] HTML partials (header, footer, giveaway strip, map, reviews)
- [x] Snow-Cicero index.html with all sections
- [x] Snow-Cicero thanks.html page
- [x] Company name corrected from "J&R" to "J and R"
- [x] Image directory structure created
- [x] Campaign images moved to proper locations
- [x] Better form integrated from premade template
- [x] Equipment showcase section with 3 image placeholders
- [x] server.py created for local testing
- [x] Paths updated for local development

---

## 🔥 READY FOR TESTING

### 🚀 **START LOCAL SERVER**
```bash
cd "C:\Dev Projects\AGP\jandr-project\jnr-snow-lps"
python server.py
```
Then visit: **http://localhost:8000/snow-cicero/**

---

## 📋 IMMEDIATE NEXT STEPS

### Test & Review Cicero Page
- [ ] Start local server and view page
- [ ] Test mobile responsiveness (DevTools > Toggle device)
- [ ] Check all animations work smoothly
- [ ] Review form layout and validation
- [ ] Test FAQ accordion functionality
- [ ] Review reviews carousel auto-play
- [ ] Check all sections for proper spacing

### Form Integration - ✅ COMPLETED
- [x] Extract form HTML from `premade-files/jandr_lead_index_template_v2.html`
- [x] Replace current form placeholder in Cicero index.html
- [x] Add proper form validation
- [x] Include honeypot field for spam protection
- [x] Style form to match brand design

### Image Integration - ⚠️ PARTIALLY COMPLETE
- [x] Images moved to proper directories:
  - [x] `snow_perfect_clear_driveway_ranch.png` → `/snow-cicero/images/hero-bg-original.png` 
  - [x] `coffee_peace_elderly_man_v1.png` → `/snow-cicero/images/coffee-peace-original.png`
  - [x] `snow_equipment_action_blowing.png` → `/shared/images/equipment/snow-blower-action-original.png`
- [x] Equipment image placeholders created (3 images)
- [x] CSS background-image path added to hero
- [ ] **OPTIMIZE IMAGES**: Run through Squoosh (https://squoosh.app/)
  - [ ] `hero-bg-original.png` → optimize → `hero-bg.jpg`
  - [ ] `coffee-peace-original.png` → optimize → `coffee-peace.jpg`
  - [ ] `snow-blower-action-original.png` → optimize → `equipment-1.jpg`

### Local Testing Setup - ✅ COMPLETED
- [x] Create `server.py` in jnr-snow-lps folder
- [x] Update all paths for local development
- [x] Hero background image integrated
- [ ] Test all partial includes work locally
- [ ] Verify mobile-first responsive design
- [ ] Test animations and interactions
- [ ] Check form validation (without backend)

---

## 📦 CLIENT TO PROVIDE

### Logo Files
- [ ] **URGENT**: J and R logo SVG or PNG files
  - Location: `/jnr-snow-lps/shared/images/logo.svg`
  - Suggested: White version for dark backgrounds, colored version for light

### Equipment Photos
- [ ] Snow blower in action (close-up)
- [ ] Snow removal tractor (side view)
- [ ] Equipment fleet shot (multiple vehicles)
- [ ] Before/after snow removal comparison

### Form Integration
- [ ] **Apps Script URL** for lead form submission
  - File: `premade-files/jandr_leads_apps_script_resend_v2.gs`
  - Need deployed URL to replace `YOUR_LEADS_APPS_SCRIPT_URL`

### Map Integration
- [ ] **Google My Maps** embed code
  - File: `premade-files/map_embed_placeholder.html`
  - Replace placeholder in `/shared/partials/map-embed.html`

### Optional Enhancements
- [ ] JotForm embed code (secondary form option)
- [ ] Facebook Pixel ID (for tracking)
- [ ] Google Analytics ID
- [ ] Favicon files

---

## 🚫 WAITING FOR APPROVAL

### Other Town Pages (HOLD)
- [ ] Snow-Clay index.html + thanks.html
- [ ] Snow-Liverpool index.html + thanks.html  
- [ ] Snow-Commercial index.html + thanks.html
- [ ] Snow-Giveaway complete pages (use premade files)

**Note**: These will be created AFTER Cicero page is reviewed and approved for style/layout.

---

## 📱 TESTING CHECKLIST

### Mobile Experience (375px - iPhone)
- [ ] Hero section fills screen on mobile
- [ ] All text is readable without zooming
- [ ] Buttons are minimum 48px touch targets
- [ ] Form fields are easy to tap and fill
- [ ] Smooth scroll animations work
- [ ] Reviews carousel swipes properly

### Tablet Experience (768px)
- [ ] Two-column layouts work properly
- [ ] Images scale appropriately
- [ ] Navigation is accessible
- [ ] Form maintains good proportions

### Desktop Experience (1024px+)
- [ ] Three-column layouts look balanced
- [ ] Hero section has good visual hierarchy
- [ ] All animations are smooth
- [ ] Content doesn't feel stretched

### Cross-Browser
- [ ] Chrome (primary)
- [ ] Safari (iOS)
- [ ] Firefox
- [ ] Edge

---

## 📊 PERFORMANCE TARGETS

- [ ] Page loads in under 3 seconds on mobile
- [ ] Images are optimized and properly sized
- [ ] CSS is minified for production
- [ ] No JavaScript errors in console
- [ ] All animations are 60fps smooth

---

## 🔧 TECH STACK USED

- **Framework**: Vanilla HTML/CSS/JS (no heavy frameworks)
- **CSS**: Custom properties, mobile-first responsive
- **JS**: Intersection Observer, vanilla DOM manipulation
- **Images**: Optimized PNGs from campaign generation
- **Server**: Python SimpleHTTPServer for local testing

---

## 📝 NOTES & DECISIONS

### Design Choices Made
- **Brand colors**: Used actual J and R colors from style guide (#009933 green, #5ce188 light green, #595959 gray)
- **Typography**: Poppins for headings, system fonts for body
- **Layout**: Single-column mobile, progressive enhancement for larger screens
- **Animations**: Subtle, performant, intersection-observer based

### Form Strategy
- **Primary**: Integrated lead form (from premade template)
- **Secondary**: JotForm embed option (placeholder)
- **Validation**: Client-side + honeypot spam protection
- **Submission**: Apps Script backend (URL to be provided)

### Image Strategy
- **Hero**: Campaign-generated snow removal images
- **Equipment**: Placeholder sections for client photos
- **Social**: Coffee/peace images for testimonial sections
- **Optimization**: All images must be optimized using Squoosh before integration

---

## 🎯 SUCCESS CRITERIA

✅ **Cicero page is approved when**:
- Mobile-first design looks professional
- Brand colors and fonts are correct
- All sections have proper content
- Form integration points are clear
- Image placeholders are obvious
- Local testing works smoothly
- Animations enhance (don't distract from) UX

**Then and only then** → Replicate to other town pages.

---

*Last Updated: 2025-08-27*
*Developer: Claude Code*