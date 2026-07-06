using namespace System.Drawing
Add-Type -AssemblyName System.Drawing

$img_path = "C:\Users\BLACK HOUSE\.gemini\antigravity-ide\brain\6cbf85b5-6c32-49cc-892c-0dbf962cf06e\media__1782614786661.png"
$out_path = "c:\Users\BLACK HOUSE\Desktop\app de rafitox\assets\icon.png"

$bmp = [System.Drawing.Bitmap]::FromFile($img_path)

# First pass: find bounding box of non-checkerboard/non-dark background
$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $color = $bmp.GetPixel($x, $y)
        # Assuming the checkerboard is white/gray and the border is dark.
        # Let's just find the bounding box of pixels that are NOT the checkerboard pattern (white/gray)
        # And NOT black padding (some screenshots have black padding)
        # The icon has purple and silver
        $isBg = $false
        if ($color.A -lt 10) { $isBg = $true } # transparent
        if ($color.R -lt 20 -and $color.G -lt 20 -and $color.B -lt 20) { $isBg = $true } # black padding
        # checkerboard:
        if ($color.R -gt 190 -and $color.G -gt 190 -and $color.B -gt 190) { $isBg = $true }
        
        if (-not $isBg) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

if ($minX -ge $maxX -or $minY -ge $maxY) {
    Write-Output "Could not find bounds!"
    $minX = 0; $minY = 0; $maxX = $bmp.Width - 1; $maxY = $bmp.Height - 1
}

# Add a tiny bit of padding (5%) to bounds, keeping them within limits
$padding = 5
$minX = [math]::Max(0, $minX - $padding)
$minY = [math]::Max(0, $minY - $padding)
$maxX = [math]::Min($bmp.Width - 1, $maxX + $padding)
$maxY = [math]::Min($bmp.Height - 1, $maxY + $padding)

$w = $maxX - $minX + 1
$h = $maxY - $minY + 1

Write-Output "Cropping to X:$minX Y:$minY W:$w H:$h"

$newBmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.Clear([System.Drawing.Color]::Transparent)

for ($x = 0; $x -lt $w; $x++) {
    for ($y = 0; $y -lt $h; $y++) {
        $color = $bmp.GetPixel($x + $minX, $y + $minY)
        # Make checkerboard and black transparent inside the bounding box
        $isBg = $false
        if ($color.R -lt 20 -and $color.G -lt 20 -and $color.B -lt 20) { $isBg = $true }
        if ($color.R -gt 190 -and $color.G -gt 190 -and $color.B -gt 190) { $isBg = $true }
        
        if ($isBg) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $newBmp.SetPixel($x, $y, $color)
        }
    }
}

# Ensure directory exists
$dir = [System.IO.Path]::GetDirectoryName($out_path)
if (-not [System.IO.Directory]::Exists($dir)) {
    [System.IO.Directory]::CreateDirectory($dir)
}

$newBmp.Save($out_path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
$g.Dispose()

Write-Output "Saved to $out_path"
