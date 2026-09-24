import { fileURLToPath } from "url";
import { dirname } from "pathe";

const root = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  experimental: {
    asyncContext: false
  },

  ssr: false,
  spaLoadingTemplate: "spa-loading-template.html",

  css: [
    "leaflet/dist/leaflet.css",
    "~/assets/scss/main.scss",
    "viewerjs/dist/viewer.css",
    "boxicons/css/boxicons.min.css",
    "video.js/dist/video-js.css",
  ],

  runtimeConfig: {
    public: {
      recaptcha: process.env.NUXT_PUBLIC_RECAPTCHA,
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      assetUrl: process.env.NUXT_PUBLIC_ASSET_URL,
      gaId: process.env.NUXT_PUBLIC_GA_ID || "G-GXZVKBR803",
      cdnUrl: process.env.NUXT_PUBLIC_CDN_URL || "https://cdn.hibank.co.id",
    },
  },

  components: {
    dirs: [
      { global: true, path: "./components/Pages" },
      { global: true, path: "./components/shared", prefix: "App" },
      { path: "./components/Calculators", global: true },
      "./components",
    ],
  },

  app: {
    head: {
      titleTemplate: "hibank | %s",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "hibank" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
        },
      ],
      script: [
        {
          src: "https://in.bigidcmp.cloud/banner.js?siteId=5553a6fb-002e-417d-baf4-92a93ecd660b",
          async: true,
          defer: true,
        },
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${
            process.env.NUXT_PUBLIC_GA_ID || "G-GXZVKBR803"
          }`,
          async: true,
          defer: true,
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${
              process.env.NUXT_PUBLIC_GA_ID || "G-GXZVKBR803"
            }');
          `,
          type: "text/javascript",
        },
        {
          src: "https://www.google.com/recaptcha/enterprise.js",
          async: true,
          defer: true,
        },

        // {
        //   src: `https://www.google.com/recaptcha/enterprise.js?render=${process.env.NUXT_PUBLIC_RECAPTCHA}`,
        //   async: true,
        //   defer: true,
        // },
      ],
    },
  },

  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image-edge",
    "@nuxt/devtools",
    "@nuxtjs/device",
    "nuxt-swiper",
    "nuxt-typed-router",
    "@vee-validate/nuxt",
    "nuxt-gtag",
    "nuxt-security",
  ],

  gtag: {
    id: process.env.NUXT_PUBLIC_GA_ID || "G-GXZVKBR803",
    config: { send_page_view: false },
  },

  security: {
    
    nonce: false,
    sri: false,
    xssValidator: false,
    ssg: { meta: true, hashScripts: false, hashStyles: false },

    headers: {
      permissionsPolicy: { fullscreen: ["*"] },

      contentSecurityPolicy: {
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "'wasm-unsafe-eval'",
          "blob:",
          "https://www.youtube.com",
          "https://s.ytimg.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://in.bigidcmp.cloud",
          "https://www.google.com",
          "https://www.recaptcha.net",
          "https://www.gstatic.com",
          "https://www.gstatic.cn",
          "https://www.gstatic.com/recaptcha/",
          "https://cdn.jsdelivr.net",
          "https://cdn.jsdelivr.net/npm",
        ],

        "worker-src": [
          "'self'",
          "blob:",
          "https://www.gstatic.com/recaptcha/",
        ],

        "connect-src": [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://www.recaptcha.net",
          "https://www.gstatic.cn",
          "blob:",
          "data:",
          "https://cdn.jsdelivr.net",
          "https://cdn.jsdelivr.net/npm",
          "https://in.bigidcmp.cloud",
          "https://api.in.bigidcmp.cloud",
          "https://resources.in.bigidcmp.cloud",
          "https://*.bigidcmp.cloud",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://hibankwebdev.nonprod.hibank.co.id",
          "https://*.hibank.co.id",
          "https://hibank.co.id",
          "https://www.hibank.co.id",
          "https://www.youtube.com",
          "https://youtube.googleapis.com",
          "https://*.youtube.com",
          "https://googlevideo.com",
          "https://*.googlevideo.com"
        ],


        "frame-src": [
          "'self'",
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com",
          "https://www.google.com",
          "https://www.recaptcha.net",
          "https://www.gstatic.com/recaptcha/",
        ],

        "style-src": [
          "'self'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
          "https://in.bigidcmp.cloud",
          "'unsafe-inline'",
        ],

       "img-src": [
          "'self'",
          "data:",
          "https://*",
          "https://i.ytimg.com",
          "https://i9.ytimg.com"
        ],

        "font-src": [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://*.bigidcmp.cloud",
          "data:",
        ],

        "media-src": [
          "'self'",
          "blob:",
          "data:",
          "https://hibankwebdev.nonprod.hibank.co.id",
          "https://*.hibank.co.id",
          "https://cdn.jsdelivr.net",
          "*"
        ],

        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "upgrade-insecure-requests": true,
      },

      crossOriginResourcePolicy: "cross-origin",
      crossOriginOpenerPolicy: "same-origin",
      crossOriginEmbedderPolicy: "unsafe-none",
      originAgentCluster: "?1",
      referrerPolicy: "strict-origin-when-cross-origin",
      strictTransportSecurity: {
        maxAge: 16070400,
        includeSubdomains: true,
      },
      xContentTypeOptions: "nosniff",
      xDNSPrefetchControl: "off",
      xDownloadOptions: "noopen",
      xPermittedCrossDomainPolicies: "none",
      xXSSProtection: "1",
    },

    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000,
    },

    rateLimiter: { tokensPerInterval: 150, interval: "hour" },

    corsHandler: {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflight: { statusCode: 204 },
    },

    hidePoweredBy: true,
    basicAuth: false,

    enabled: process.env.NODE_ENV === "production",
    csrf: true,
  },

  i18n: {
    langDir: "locales",
    locales: [
      { code: "en", name: "English", file: "en.js" },
      { code: "id", name: "Indonesian", file: "id.js" },
    ],
    detectBrowserLanguage: false,
    defaultLocale: "id",
    strategy: "prefix_except_default",
    compilation: { strictMessage: false },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "~/assets/scss/colors.scss";
            @import "~/assets/scss/globals.scss";
            @import "~/assets/scss/form.scss";
            @import "~/assets/scss/swiper.scss";
            @import "~/assets/scss/tables.scss";
          `,
        },
      },
    },

    vue: {
      script: { defineModel: true },
    },

    optimizeDeps: {
      include: [
        "video.js",
        "videojs-contrib-quality-levels",
        "videojs-hls-quality-selector"
      ]
    },

    ssr: {
      noExternal: [
        "video.js",
        "videojs-contrib-quality-levels",
        "videojs-hls-quality-selector"
      ]
    }
  },

  swiper: {},
  device: { refreshOnResize: true },
  devtools: { enabled: process.env.NODE_ENV === "development" },
  compatibilityDate: "2024-08-29",
});
