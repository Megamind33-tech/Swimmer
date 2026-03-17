#!/usr/bin/env bash
set -euo pipefail

if ! command -v git >/dev/null 2>&1; then
  echo "git is required but not installed." >&2
  exit 1
fi

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "git-lfs not found. Installing..."
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y git-lfs
  elif command -v brew >/dev/null 2>&1; then
    brew install git-lfs
  elif command -v choco >/dev/null 2>&1; then
    choco install git-lfs -y
  else
    echo "No supported package manager found. Install git-lfs manually:" >&2
    echo "https://git-lfs.com/" >&2
    exit 1
  fi
fi

echo "Initializing Git LFS in this repo..."
git lfs install --local

echo "Tracking image formats with Git LFS..."
git lfs track "*.png" "*.jpg" "*.jpeg" "*.gif" "*.webp"

echo "Done. Next steps:"
echo "  git add .gitattributes"
echo "  git add <your image files>"
echo "  git commit -m 'Track image assets with Git LFS'"
