## 2024-03-20 - Adding ARIA labels to currency badges
**Learning:** In a highly visual lobby UI (like TopUtilityBar), decorative or icon-based currency indicators need descriptive aria-labels. Screen readers would otherwise just read out the numbers (e.g. "100K 100K") without specifying what currency they represent.
**Action:** When adding or modifying compact stat indicators (like Coins and Gems badges), ensure the aria-label explicitly states the value and the type of stat being represented.
