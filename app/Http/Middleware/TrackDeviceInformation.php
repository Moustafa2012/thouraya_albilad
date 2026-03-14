<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Jenssegers\Agent\Agent;

class TrackDeviceInformation
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only track device information for authenticated users
        if (auth()->check() && $request->hasSession()) {
            $sessionId = $request->session()->getId();

            // Get device information
            $agent = new Agent();
            $agent->setUserAgent($request->userAgent());

            // Parse device information
            $deviceType = $this->getDeviceType($agent);
            $browser = $agent->browser();
            $browserVersion = $agent->version($browser);
            $platform = $agent->platform();
            $platformVersion = $agent->version($platform);
            $deviceName = $agent->device();
            $isRobot = $agent->isRobot();

            // Update session with device information
            DB::table('sessions')
                ->where('id', $sessionId)
                ->update([
                    'device_type' => $deviceType,
                    'device_name' => $deviceName,
                    'browser' => $browser,
                    'browser_version' => $browserVersion,
                    'platform' => $platform,
                    'platform_version' => $platformVersion,
                    'is_robot' => $isRobot,
                    'last_used_at' => now(),
                ]);
        }

        return $response;
    }

    private function getDeviceType(Agent $agent): string
    {
        if ($agent->isMobile()) {
            return 'mobile';
        }

        if ($agent->isTablet()) {
            return 'tablet';
        }

        if ($agent->isDesktop()) {
            return 'desktop';
        }

        return 'unknown';
    }
}
