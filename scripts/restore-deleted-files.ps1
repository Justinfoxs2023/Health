# 获取Git状态中标记为D的文件
$deletedFiles = git status -s | Where-Object { $_ -match '^\s*D' } | ForEach-Object { $_.Substring(3) }

# 如果没有删除的文件,输出提示并退出
if (-not $deletedFiles) {
    Write-Host "没有发现被删除的文件。" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n发现以下被删除的文件:" -ForegroundColor Cyan
$deletedFiles | ForEach-Object { Write-Host "  - $_" }

# 确认是否恢复
$confirmation = Read-Host "`n是否要恢复这些文件? (Y/N)"
if ($confirmation -ne 'Y') {
    Write-Host "`n取消恢复操作。" -ForegroundColor Yellow
    exit 0
}

# 恢复每个删除的文件
$successCount = 0
$errorCount = 0

foreach ($file in $deletedFiles) {
    try {
        # 从Git中检出文件
        git checkout HEAD -- $file
        Write-Host "✓ 成功恢复: $file" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "✗ 恢复失败: $file" -ForegroundColor Red
        Write-Host "  错误: $_" -ForegroundColor Red
        $errorCount++
    }
}

# 输出恢复结果统计
Write-Host "`n恢复操作完成!" -ForegroundColor Cyan
Write-Host "成功恢复: $successCount 个文件" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "恢复失败: $errorCount 个文件" -ForegroundColor Red
}

# 显示当前Git状态
Write-Host "`n当前Git状态:" -ForegroundColor Cyan
git status -s 