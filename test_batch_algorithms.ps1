# PowerShell script to test batch allocation algorithms

Write-Host "Testing Batch Allocation Algorithms" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api/batches/auto-allocate"
$algorithms = @("kmeans", "hierarchical", "greedy", "dbscan", "spectral")

foreach ($algo in $algorithms) {
    Write-Host "Testing Algorithm: $algo" -ForegroundColor Blue
    Write-Host "---"
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl`?algorithm=$algo" `
            -Method POST `
            -ContentType "application/json" `
            -Body '{}' -ErrorAction Stop
        
        $jsonResponse = $response.Content | ConvertFrom-Json
        
        Write-Host "Status: $(if ($jsonResponse.success) { 'SUCCESS' } else { 'FAILED' })" -ForegroundColor Green
        Write-Host "Message: $($jsonResponse.message)"
        Write-Host "Algorithm Used: $($jsonResponse.data.algorithm)"
        Write-Host "Total Clusters: $($jsonResponse.data.totalClusters)"
        Write-Host "Total Batches: $($jsonResponse.data.totalBatches)"
        
        if ($jsonResponse.data.batches) {
            Write-Host "Batch Details:"
            foreach ($batch in $jsonResponse.data.batches | Select-Object -First 2) {
                Write-Host "  - Name: $($batch.name)"
                Write-Host "    Interests: $($batch.interests -join ', ')"
                Write-Host "    Members: $($batch.members.Count)"
                Write-Host "    Algorithm: $($batch.allocationAlgorithm)"
            }
        }
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "---"
    Write-Host ""
}

Write-Host "All algorithms tested!" -ForegroundColor Green
