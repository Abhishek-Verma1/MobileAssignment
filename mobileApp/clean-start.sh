#!/bin/bash

# Clean start script for the React Native app
# This script helps clean up build artifacts and cache, then start the app fresh

echo "🧹 Cleaning up Metro bundler cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null

echo "🧹 Cleaning up React Native cache..."
rm -rf $TMPDIR/react-* 2>/dev/null
rm -rf $TMPDIR/haste-* 2>/dev/null

echo "🧹 Cleaning up Watchman..."
watchman watch-del-all 2>/dev/null

echo "🧹 Cleaning up NPM cache..."
npm cache clean --force

echo "🧹 Removing node_modules..."
rm -rf node_modules/

echo "🧹 Removing yarn.lock/package-lock.json..."
rm -f yarn.lock package-lock.json

echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting the app with a clean slate..."
npm run debug

echo "✅ Done!" 