# Multi-Year Draft System

## Overview
The wins draft application now supports multiple years of data. This allows you to view past draft results and easily extend the system for future years.

## Files Modified

### controller.js
- **Historical Data**: Added `historicalDrafts` object to store draft data for each year
- **Year Management**: Added `changeYear()` function to switch between years
- **API Updates**: Modified API calls to use the current year (`api.currentYear`)
- **Exports**: Added `changeYear`, `getAvailableYears`, and `historicalDrafts` to exports

### list.js
- **Year Selector**: Added dropdown and "Load" button in the header
- **State Management**: Added `selectedYear` and `availableYears` properties
- **Event Handling**: Added `handleYearChange()` method to handle year switching
- **Dynamic Title**: Header now shows the selected year

### picks.js
- **Year-Aware API**: Updated to use `api.currentYear` instead of hardcoded 2025
- **Previous Year Wins**: Modified to show wins from the previous year (e.g., 2024 wins when in 2025)

## How to Add New Years

### Step 1: Update Historical Data
In `controller.js`, add a new entry to the `historicalDrafts` object:

```javascript
const historicalDrafts = {
  2024: [...], // existing 2024 data
  2025: [...], // existing 2025 data
  2026: [     // new year data
    {
      name: 'Ethan',
      teams: ['SF', 'KC', 'GB', 'DAL', 'CHI'] // update with actual 2026 draft
    },
    // ... other players
  ]
}
```

### Step 2: Update Current Year
Change the default year in the initialization:
```javascript
await initializeApiData(2026) // Change to new current year
```

### Step 3: Test
- The year selector will automatically include the new year
- Historical data will be preserved
- API calls will use the correct year

## Current Year Structure (2025)

### Draft Assignments
- **Ethan**: SF, KC, GB, DAL, CHI
- **Mom**: HOU, MIA, CIN, PHI, JAX  
- **Dad**: BAL, DET, BUF, ATL, TB
- **Micah**: LAR, CLE, PIT, SEA, ARI
- **LEFTOVERS**: TEN, NYJ, IND, CAR, MIN, LV, LAC, NYG, NO, DEN, WSH, NE

**Note**: The 2025 teams are currently set to the same as 2024. Update these in `historicalDrafts[2025]` with the actual 2025 draft results.

## Features
- ✅ Preserved 2024 draft data
- ✅ Year selector dropdown in header
- ✅ Dynamic API calls based on selected year
- ✅ Easily extensible for future years
- ✅ Previous year wins shown in draft picks page
- ✅ Responsive design maintained
