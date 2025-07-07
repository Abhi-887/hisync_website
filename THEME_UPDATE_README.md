# Theme Configuration Update

## Changes Made

To set the backend admin panel to use **light theme by default** instead of system theme:

### 1. Updated HandleAppearance Middleware
**File:** `app/Http/Middleware/HandleAppearance.php`
- Changed default from `'system'` to `'light'`

### 2. Updated App Layout View
**File:** `resources/views/app.blade.php`
- Changed default appearance fallback from `'system'` to `'light'`

### 3. Updated Appearance Hook
**File:** `resources/js/hooks/use-appearance.tsx`
- Changed default appearance state from `'system'` to `'light'`
- Updated initialization to default to `'light'`
- Updated localStorage fallback to `'light'`

## How It Works

1. **New users**: Will see light theme by default
2. **Existing users**: If they haven't manually set a theme preference, they'll see light theme
3. **Users with preferences**: If users have manually selected dark/light/system mode, their preference will be preserved

## Testing

After these changes:
- Clear browser cache and cookies
- Access the admin panel - it should load in light mode by default
- Theme toggle in Settings > Appearance should still work normally
- Users can still choose dark mode or system mode if they prefer

## Reset Script

If you need to reset all users to light mode:
- Run the JavaScript code in `reset-theme.js` in browser console
- Or clear the `appearance` cookie and localStorage manually

## Files Modified

1. `app/Http/Middleware/HandleAppearance.php`
2. `resources/views/app.blade.php`  
3. `resources/js/hooks/use-appearance.tsx`

The admin panel will now default to light theme instead of following the system theme preference.
