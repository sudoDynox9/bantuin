(function () {
    "use strict";

    const MEASUREMENT_ID = "G-8XQLJN1BW";

    /*
     * =========================================================
     * DATA LAYER
     * =========================================================
     */

    window.dataLayer = window.dataLayer || [];

    /*
     * =========================================================
     * GTAG
     * =========================================================
     */

    function gtag() {
        window.dataLayer.push(arguments);
    }

    window.gtag = window.gtag || gtag;

    /*
     * =========================================================
     * LOAD GOOGLE TAG
     * =========================================================
     */

    if (!document.querySelector(
        'script[src*="googletagmanager.com/gtag/js"]'
    )) {
        const script = document.createElement("script");

        script.async = true;
        script.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(MEASUREMENT_ID);

        document.head.appendChild(script);
    }

    /*
     * =========================================================
     * INITIALIZE GOOGLE ANALYTICS
     * =========================================================
     */

    gtag("js", new Date());

    gtag("config", MEASUREMENT_ID, {
        send_page_view: true,

        /*
         * Aktifkan sementara untuk testing DebugView.
         */
        debug_mode: true
    });

    /*
     * =========================================================
     * TOOL CLICK TRACKING
     * =========================================================
     */

    function setupToolTracking() {
        const toolLinks = document.querySelectorAll("[data-tool]");

        toolLinks.forEach(function (link) {
            /*
             * Jangan memasang listener berkali-kali
             * jika script dijalankan ulang.
             */
            if (link.dataset.analyticsBound === "true") {
                return;
            }

            link.dataset.analyticsBound = "true";

            link.addEventListener("click", function (event) {
                const tool = link.dataset.tool;
                const destination = link.href;

                if (!tool || !destination) {
                    return;
                }

                /*
                 * Hentikan navigasi sementara.
                 */
                event.preventDefault();

                /*
                 * Kirim event ke Google Analytics.
                 */
                gtag("event", "tool_click", {
                    tool_name: tool,
                    debug_mode: true
                });

                /*
                 * Beri waktu bagi request Analytics
                 * untuk dikirim sebelum pindah halaman.
                 */
                setTimeout(function () {
                    window.location.href = destination;
                }, 1000);
            });
        });
    }

    /*
     * =========================================================
     * DOM READY
     * =========================================================
     */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            setupToolTracking
        );
    } else {
        setupToolTracking();
    }

})();
