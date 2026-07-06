using namespace System.Drawing
Add-Type -AssemblyName System.Drawing

$img_path = "C:\Users\BLACK HOUSE\.gemini\antigravity-ide\brain\6cbf85b5-6c32-49cc-892c-0dbf962cf06e\media__1782614016157.jpg"
$out_path = "c:\Users\BLACK HOUSE\Desktop\app de rafitox\icon_transparent.png"

$bmp = [System.Drawing.Bitmap]::FromFile($img_path)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $color = $bmp.GetPixel($x, $y)
        if ($color.R -gt 190 -and $color.G -gt 190 -and $color.B -gt 190) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $newBmp.SetPixel($x, $y, $color)
        }
    }
}

$newBmp.Save($out_path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Output "Done creating transparent icon."
