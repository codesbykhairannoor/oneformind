#!/usr/bin/env bash
# ============================================================================
# Push Tranvas Go API backend to Hugging Face Spaces
# ============================================================================
set -e

SPACE_URL="$1"

if [ -z "$SPACE_URL" ]; then
    echo "=========================================================="
    echo " Tranvas API -> Hugging Face Spaces Deployment Sync"
    echo "=========================================================="
    echo -n "Masukkan URL Space Git Hugging Face Anda: "
    read -r SPACE_URL
fi

if [ -z "$SPACE_URL" ]; then
    echo "Error: Space Git URL tidak boleh kosong!"
    exit 1
fi

TEMP_DIR=$(mktemp -d -t tranvas-hf-XXXXXX)
echo "Menyiapkan file backend di: $TEMP_DIR"

cp deploy/huggingface/Dockerfile "$TEMP_DIR/Dockerfile"
cp deploy/huggingface/README.md "$TEMP_DIR/README.md"
cp go.mod "$TEMP_DIR/go.mod"
cp go.sum "$TEMP_DIR/go.sum"
cp main.go "$TEMP_DIR/main.go"
cp -r api "$TEMP_DIR/api"
cp -r backend "$TEMP_DIR/backend"

cd "$TEMP_DIR"
git init -b main
git config user.name "Tranvas Deployer"
git config user.email "deploy@tranvas.com"
git add .
git commit -m "deploy: update Tranvas Go API backend for Hugging Face Spaces"

echo "Pushing ke Hugging Face Space: $SPACE_URL ..."
git push "$SPACE_URL" main --force

cd - > /dev/null
rm -rf "$TEMP_DIR"

echo "=========================================================="
echo " BERHASIL DI-PUSH KE HUGGING FACE SPACES!"
echo " Silakan buka Space Anda untuk memantau proses build Docker."
echo "=========================================================="

