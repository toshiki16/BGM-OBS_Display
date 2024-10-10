# WMPのオブジェクトを作成
$wmp = New-Object -ComObject WMPlayer.OCX

# 再生中のメディア情報を取得
$media = $wmp.currentMedia

# CSVファイルのパスを指定
$csvFilePath = "C:\Users\google\OneDrive\デスクトップ\Myプログラミング\smash\media-info.csv"

# CSVファイルが存在しなければヘッダーを追加
if (-Not (Test-Path $csvFilePath)) {
    Add-Content -Path $csvFilePath -Value "Title,Artist,File Path"
}

# 再生中のメディアの情報を取得してCSVに追記
if ($media) {
    $title = $media.name
    $artist = $media.getItemInfo("Author")
    $filePath = $media.sourceURL

    # タイトル、アーティスト、ファイルパスの表示
    Write-Host "Title: " $title
    Write-Host "Artist: " $artist
    Write-Host "File Path: " $filePath

    # CSVに追記
    Add-Content -Path $csvFilePath -Value "`"$title`","`"$artist`","`"$filePath`""
    Write-Host "Media information appended to
