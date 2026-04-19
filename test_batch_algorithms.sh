#!/bin/bash

# Test different batch allocation algorithms

echo "Testing Batch Allocation Algorithms"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api/batches/auto-allocate"
ALGORITHMS=("kmeans" "hierarchical" "greedy" "dbscan" "spectral")

for algo in "${ALGORITHMS[@]}"; do
    echo -e "${BLUE}Testing Algorithm: $algo${NC}"
    echo "---"
    
    curl -X POST "$BASE_URL?algorithm=$algo" \
        -H "Content-Type: application/json" \
        -d '{}' 2>/dev/null | jq '.' | head -30
    
    echo ""
    echo "---"
    echo ""
done

echo -e "${GREEN}All algorithms tested!${NC}"
