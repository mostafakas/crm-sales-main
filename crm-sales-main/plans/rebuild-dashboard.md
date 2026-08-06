# Rebuild HR Dashboard Page to Match Figma Design

## Issue
The EmployeeGrid component has its own padding wrapper (`p-[24px]`) which causes double padding when rendered inside the main content area that already has padding (`p-[24px]`).

## Changes Needed

### 1. Fix EmployeeGrid Layout
**File:** `components/hr-dashboard/employee-grid.tsx`
- Remove the outer `div` with `className="flex flex-col gap-[32px] p-[24px]"`
- Return a fragment containing just the sections without padding
- The parent container in page.tsx will handle all padding

### 2. Update Main Content Area
**File:** `app/page.tsx`
- The main content area should have consistent padding
- QuickActions and EmployeeGrid will both sit within this padded area

### 3. Verify Component Styling
- All colors match Figma color system
- Spacing and sizing match the design
- Status colors are consistent across components

## Files to Modify
1. `components/hr-dashboard/employee-grid.tsx` - Remove padding wrapper
2. `app/page.tsx` - Verify main content padding structure

## Expected Result
- Page layout matches Figma design exactly
- No double padding issues
- Clean, consistent spacing throughout the dashboard
