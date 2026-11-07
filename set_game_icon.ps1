param(
    [int]$ProcessId = 0,
    [string]$IconPath = ""
)

if (-not $IconPath -or -not (Test-Path $IconPath)) {
    Write-Host "Icon file not found: $IconPath"
    exit 1
}

$csharp = @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class GameWindowIcon {
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern IntPtr LoadImage(IntPtr hinst, string lpszName, uint uType, int cxDesired, int cyDesired, uint fuLoad);

    public const uint WM_SETICON = 0x0080;
    public const uint IMAGE_ICON = 1;
    public const uint LR_LOADFROMFILE = 0x00000010;
}
"@

Add-Type -TypeDefinition $csharp -ErrorAction SilentlyContinue

# Load 32x32 and 16x16 icon handles
$hIconBig = [GameWindowIcon]::LoadImage([IntPtr]::Zero, $IconPath, [GameWindowIcon]::IMAGE_ICON, 32, 32, [GameWindowIcon]::LR_LOADFROMFILE)
$hIconSmall = [GameWindowIcon]::LoadImage([IntPtr]::Zero, $IconPath, [GameWindowIcon]::IMAGE_ICON, 16, 16, [GameWindowIcon]::LR_LOADFROMFILE)

Write-Host "Loaded icon handles: Big=$hIconBig, Small=$hIconSmall"

# Retry for up to 15 seconds waiting for the window to appear
$foundHwnd = [IntPtr]::Zero
$startTime = Get-Date

while (((Get-Date) - $startTime).TotalSeconds -lt 15 -and $foundHwnd -eq [IntPtr]::Zero) {
    [GameWindowIcon]::EnumWindows({
        param($hWnd, $lParam)
        $pidOut = 0
        [GameWindowIcon]::GetWindowThreadProcessId($hWnd, [ref]$pidOut) | Out-Null
        
        $sb = New-Object System.Text.StringBuilder 256
        [GameWindowIcon]::GetWindowText($hWnd, $sb, 256) | Out-Null
        $title = $sb.ToString()

        if (($ProcessId -gt 0 -and $pidOut -eq $ProcessId) -or ($title -match "Horizon" -or $title -match "Minecraft")) {
            if ([GameWindowIcon]::IsWindowVisible($hWnd) -and $title.Length -gt 0) {
                $script:foundHwnd = $hWnd
                return $false
            }
        }
        return $true
    }, [IntPtr]::Zero) | Out-Null

    if ($foundHwnd -ne [IntPtr]::Zero) {
        break
    }
    Start-Sleep -Milliseconds 400
}

if ($foundHwnd -ne [IntPtr]::Zero) {
    # Send WM_SETICON for small (0) and big (1)
    [GameWindowIcon]::SendMessage($foundHwnd, [GameWindowIcon]::WM_SETICON, [IntPtr]0, $hIconSmall) | Out-Null
    [GameWindowIcon]::SendMessage($foundHwnd, [GameWindowIcon]::WM_SETICON, [IntPtr]1, $hIconBig) | Out-Null
    Write-Host "Successfully set game window icon on HWND $foundHwnd"
    exit 0
} else {
    Write-Host "Window not found within timeout"
    exit 2
}
