# Fix all /app/masters/ paths to /masters/
cd /Users/anjana/hardware-shop

echo "Fixing all master page links..."
echo ""

# Use sed to replace all occurrences
find app/masters -name "*.tsx" -type f -exec sed -i 's|/app/masters/|/masters/|g' {} \;

echo "✅ Fixed all /app/masters/ paths to /masters/"
echo ""

# Verify the fixes
echo "Checking if fixes were applied:"
grep -r "/app/masters" app/masters --include="*.tsx" 2>/dev/null | wc -l
echo "Lines still with /app/masters: (should be 0)"
echo ""

grep -r "/masters/" app/masters --include="*.tsx" 2>/dev/null | wc -l
echo "Lines with /masters/: (should be > 0)"
Output

Fixing all master page links...

✅ Fixed all /app/masters/ paths to /masters/

Checking if fixes were applied:
0
Lines still with /app/masters: (should be 0)

15
Lines with /masters/: (should be > 0)