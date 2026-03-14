<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        
        {{-- Security headers --}}
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        {{-- SEO meta tags --}}
        <meta name="description" content="{{ config('app.description', 'Your application description') }}">
        <meta name="author" content="{{ config('app.author', 'Your Company') }}">
        
        {{-- Open Graph meta tags for social sharing --}}
        <meta property="og:title" content="{{ config('app.name') }}">
        <meta property="og:description" content="{{ config('app.description', 'Your application description') }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('images/og-image.jpg') }}">
        
        {{-- Twitter Card meta tags --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name') }}">
        <meta name="twitter:description" content="{{ config('app.description', 'Your application description') }}">
        <meta name="twitter:image" content="{{ asset('images/og-image.jpg') }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                    
                    // Listen for system preference changes
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                        if (appearance === 'system') {
                            document.documentElement.classList.toggle('dark', e.matches);
                        }
                    });
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
                color-scheme: light;
            }

            html.dark {
                background-color: oklch(0.145 0 0);
                color-scheme: dark;
            }
            
            /* Prevent flash of unstyled content */
            body {
                opacity: 0;
                transition: opacity 0.2s ease-in;
            }
            
            body.loaded {
                opacity: 1;
            }
            
            /* Loading spinner (optional) */
            .app-loading {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: none;
            }
            
            body:not(.loaded) .app-loading {
                display: block;
            }
        </style>

        <title inertia>{{ config('app.name') }}</title>

        {{-- Favicon with multiple formats for better browser support --}}
        <link rel="icon" href="/favicon.ico" sizes="32x32">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="manifest" href="/manifest.json">
        
        {{-- Theme color for mobile browsers --}}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)">

        {{-- Preconnect to external domains for faster loading --}}
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        
        {{-- DNS prefetch for additional performance --}}
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link rel="dns-prefetch" href="https://fonts.googleapis.com">
        
        {{-- Fonts with display=swap to prevent text flash --}}
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Changa:wght@400;500;600;700&display=swap" rel="stylesheet">

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
        
        {{-- Preload critical resources (add your critical assets) --}}
        {{-- <link rel="preload" href="/path-to-critical-font.woff2" as="font" type="font/woff2" crossorigin> --}}
    </head>
    <body class="font-sans antialiased">
        {{-- Optional loading indicator --}}
        <div class="app-loading" role="status" aria-live="polite">
            <span class="sr-only">Loading...</span>
            {{-- Add your loading spinner here if desired --}}
        </div>
        
        @inertia
        
        {{-- Script to remove loading state --}}
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.body.classList.add('loaded');
            });
        </script>
        
        {{-- Noscript fallback --}}
        <noscript>
            <div style="text-align: center; padding: 2rem;">
                <p>This application requires JavaScript to be enabled. Please enable JavaScript in your browser settings.</p>
            </div>
        </noscript>
    </body>
</html>