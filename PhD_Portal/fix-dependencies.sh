#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== PhD Portal Dependency Fix Script ===${NC}"
echo "This script will fix dependency issues in the PhD Portal project."
echo

# Step 1: Remove problematic packages
echo -e "${YELLOW}Step 1: Removing problematic packages...${NC}"
npm uninstall react-pdf @react-pdf-viewer/core @react-pdf-viewer/default-layout pdfjs-dist
echo -e "${GREEN}✓ Packages removed${NC}"
echo

# Step 2: Clean npm cache
echo -e "${YELLOW}Step 2: Cleaning npm cache...${NC}"
npm cache clean --force
echo -e "${GREEN}✓ Cache cleaned${NC}"
echo

# Step 3: Install simplified PDF alternatives
echo -e "${YELLOW}Step 3: Installing PDF alternatives...${NC}"
npm install react-pdf-js pdf-viewer-reactjs --legacy-peer-deps
echo -e "${GREEN}✓ Alternatives installed${NC}"
echo

# Step 4: Fix Radix UI components
echo -e "${YELLOW}Step 4: Fixing Radix UI components...${NC}"
npm install @radix-ui/react-select --legacy-peer-deps
echo -e "${GREEN}✓ Radix UI fixed${NC}"
echo

# Step 5: Update project dependencies
echo -e "${YELLOW}Step 5: Updating project dependencies...${NC}"
npm update --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies updated${NC}"
echo

echo -e "${GREEN}=== All fixes applied successfully ===${NC}"
echo "You can now restart your development server with: npm run dev"
echo
echo -e "${YELLOW}Note: If you still encounter issues, you might need to:${NC}"
echo "1. Restart your IDE"
echo "2. Delete node_modules and reinstall with npm install --legacy-peer-deps"
echo "3. Check for version conflicts in package.json"
