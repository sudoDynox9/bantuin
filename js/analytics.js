"use strict";

/*
 * Bantuin - Google Analytics 4
 * Measurement ID: G-8XQLJN1BW
 */

(function () {
    const MEASUREMENT_ID = "G-8XQLJN1BW";

    /*
     * Ubah menjadi true hanya saat melakukan pengujian
     * DebugView.
     *
     * Untuk website normal gunakan false.
     */
    const DEBUG_MODE = false;

    /*
     * --------------------------------------------------
     * 1. Siapkan dataLayer dan gtag resmi
     * --------------------------------------------------
     */

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        window.dataLayer.push(arguments);
    }

    window.gtag = gtag;


    /*
     * --------------------------------------------------
     * 2. Consent Mode
     * --------------------------------------------------
     *
     * Bantuin belum menggunakan consent banner/CMP.
     *
     * Analytics:
     *   granted
     *
     * Advertising:
     *   denied
     *
     * Jadi Analytics tetap dapat melakukan pengukuran,
     * tetapi storage untuk iklan tidak diberikan.
     */

    gtag("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
    });


    /*
     * --------------------------------------------------
     * 3. Inisialisasi Google tag
     * --------------------------------------------------
     */

    gtag("js", new Date());

    gtag("config", MEASUREMENT_ID, {
        send_page_view: true
    });


    /*
     * --------------------------------------------------
     * 4. Muat Google tag secara dinamis
     * --------------------------------------------------
     */

    if (
        !document.querySelector(
            'script[src*="googletagmanager.com/gtag/js"]'
        )
    ) {
        const script = document.createElement("script");

        script.async = true;

        script.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(MEASUREMENT_ID);

        document.head.appendChild(script);
    }


    /*
     * --------------------------------------------------
     * 5. Tool click tracking
     * --------------------------------------------------
     */

    function initializeToolTracking() {
        const toolLinks = document.querySelectorAll("[data-tool]");

        toolLinks.forEach((link) => {
            if (link.dataset.analyticsInitialized === "true") {
                return;
            }

            link.dataset.analyticsInitialized = "true";

            link.addEventListener("click", (event) => {
                const tool = link.dataset.tool;
                const destination = link.href;

                if (!tool || !destination) {
                    return;
                }

                event.preventDefault();

                let navigated = false;

                const navigate = () => {
                    if (navigated) {
                        return;
                    }

                    navigated = true;
                    window.location.href = destination;
                };

                const eventParameters = {
                    tool_name: tool,
                    transport_type: "beacon",
                    event_callback: navigate
                };

                if (DEBUG_MODE) {
                    eventParameters.debug_mode = true;
                }

                gtag(
                    "event",
                    "tool_click",
                    eventParameters
                );

                /*
                 * Jangan membuat pengguna menunggu jika
                 * Google Analytics tidak merespons.
                 */
                setTimeout(navigate, 1000);
            });
        });
    }


    /*
     * --------------------------------------------------
     * 6. Jalankan tracking setelah DOM siap
     * --------------------------------------------------
     */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeToolTracking,
            {
                once: true
            }
        );
    } else {
        initializeToolTracking();
    }
})();
