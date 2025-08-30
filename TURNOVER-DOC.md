# 🚀 J and R Snow Landing Pages - Turnover Document

## Current Status (as of 2025-08-27)

### ✅ What's Complete
1. **Directory Structure** - All folders created
2. **Base CSS** - Mobile-first responsive design with J and R brand colors
3. **Snow-Cicero Page** - Complete but needs fixes (see below)
4. **Form Integration** - Quote form added but needs updates
5. **Equipment Section** - Added with 3 placeholders
6. **Local Server** - `server.py` ready for testing
7. **Image Placeholders** - Hero and equipment images in place

### 🔴 Critical Fixes Needed (Snow-Cicero)

1. **Hero Text Not Visible** - Text hidden by blue overlay
2. **Change "500+ Reviews"** → "200+ Reviews" 
3. **Fix ALL "J&R"** → "J and R" (especially in heading)
4. **Mobile Padding** - Content touching screen edges
5. **Form Changes:**
   - REMOVE: Driveway Type field
   - ADD: Town dropdown (Cicero, Clay, Liverpool only)
   - REMOVE: "New customer" checkbox
6. **Reviews Carousel** - Shows partial cards on mobile (need 1 full card)
7. **Service Areas** → "Neighborhoods We Service" (Cicero-specific)
8. **Footer:** Dynamic year (2025) + add Instagram link
9. **Update Giveaway** - New copy per final requirements

### 📁 File Locations

```
jnr-snow-lps/
├── snow-cicero/
│   ├── index.html      ← Main page needing fixes
│   ├── thanks.html     ← Thank you page
│   └── images/         ← Hero & equipment images
├── shared/
│   ├── css/base.css    ← Styles & mobile fixes
│   ├── partials/       ← Reusable components
│   │   ├── header.html (logo changed to .png)
│   │   ├── footer.html ← Needs year + Instagram
│   │   ├── giveaway-strip.html ← Update copy
│   │   ├── map-embed.html ← Change to neighborhoods
│   │   └── reviews.html (J&R already fixed to J and R)
│   └── images/         ← Logo & shared assets
├── premade-files/      ← Reference templates
├── server.py           ← Local testing server
├── LP-TODO.md          ← Full task tracker
└── IMAGE-GUIDE.md      ← Where to add images
```

### 🎯 Giveaway Requirements (FINAL)
- **Eligibility:** Anyone in service area (NOT new customers only)
- **Prize:** Season credit (up to $500)
- **Entry:** Via separate giveaway form only
- **Draws:** Sept 15, Oct 1, Oct 15 (1 winner per date, 3 total)
- **Strip Copy:** "We're giving back this winter. Enter our season credit giveaway. If you win, we apply a credit to your account (new or current customers). Must be in service area."

### 🖼️ Images Status
- **Logo:** Changed to .png in header
- **Hero:** `hero-bg-original.png` needs Squoosh optimization
- **Equipment:** 3 placeholders need real photos
- **Coffee/Peace:** Image copied, needs optimization

### 📝 Cicero Neighborhoods to List
- Bay Colony
- Cicero Center
- The Crossings
- The Pastures
- Muskrat Bay
- Eldan Meadows
- Laurelwood
- Henryk Woods

### 🔧 To Test Locally
```bash
cd "C:\Dev Projects\AGP\jandr-project\jnr-snow-lps"
python server.py
# Visit: http://localhost:8000/snow-cicero/
```

### ⚠️ DO NOT BUILD YET
- Snow-Clay pages
- Snow-Liverpool pages  
- Snow-Commercial pages
- Full giveaway pages

Wait until Cicero is approved!

---

## 🆕 NEW CONVERSATION PROMPT

Copy this to start a fresh conversation:

```
I need to fix and complete the Snow-Cicero landing page in the jnr-snow-lps folder. 

Current issues to fix:
1. Hero text not visible (hidden by blue overlay)
2. Change "500+ Reviews" to "200+ Reviews"
3. Fix all "J&R" to "J and R" 
4. Add mobile padding (content touching edges)
5. Update form: Remove driveway type, add town dropdown (Cicero/Clay/Liverpool), remove new customer checkbox
6. Fix reviews carousel to show 1 full card on mobile
7. Change "Service Areas" to "Neighborhoods We Service" with Cicero neighborhoods
8. Footer: Dynamic year + Instagram link
9. Update giveaway strip with new copy

Files are in: C:\Dev Projects\AGP\jandr-project\jnr-snow-lps\

The TURNOVER-DOC.md has all details. Focus ONLY on fixing the Cicero page - no other pages yet.

Do NOT use any MCP tools. Work only with basic file operations in the jnr-snow-lps folder.
```

---

## Key Files to Reference
1. **LP-TODO.md** - Complete task list
2. **IMAGE-GUIDE.md** - Where to add images
3. **Final giveaway details** - In your last message
4. **Cicero neighborhoods** - From business profile doc

---

*This turnover ensures continuity. Start fresh conversation with the prompt above for reduced memory usage.*