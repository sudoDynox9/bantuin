(() => {
    "use strict";

    const MEASUREMENT_ID = "G-8XQLJN1BW";

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        window.dataLayer.push(arguments);
    }

    window.gtag = gtag;

    gtag("js", new Date());

    gtag("config", MEASUREMENT_ID);


    /*
     * Catat klik pada tool Bantuin.
     *
     * Tidak menggunakan:
     * - preventDefault()
     * - event_callback
     * - setTimeout()
     *
     * Navigasi browser tetap berjalan normal.
     */
    document.addEventListener(
        "click",
        (event) => {
            if (event.button !== 0) {
                return;
            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const link =
                event.target.closest("a[data-tool]");

            if (!link) {
                return;
            }

            const tool =
                link.dataset.tool;

            if (!tool) {
                return;
            }

            /*
             * Google tag menerima event dan menangani
             * transport-nya sendiri.
             */
            gtag(
                "event",
                "tool_click",
                {
                    tool_name: tool,
                    transport_type: "beacon"
                }
            );
        },
        {
            capture: true,
            passive: true
        }
    );
})();
