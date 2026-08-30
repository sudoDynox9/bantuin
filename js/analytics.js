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

    document.addEventListener("click", (event) => {
        if (event.button !== 0) {
            return;
        }

        // Jangan mengganggu Ctrl+klik, Cmd+klik,
        // Shift+klik, atau Alt+klik.
        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        const link = event.target.closest("a[data-tool]");

        if (!link) {
            return;
        }

        const tool = link.dataset.tool;

        if (!tool) {
            return;
        }

        const destination = link.href;

        if (!destination) {
            return;
        }

        // Kirim event menggunakan Beacon transport.
        // Tidak menggunakan event_callback.
        // Tidak menggunakan setTimeout.
        gtag("event", "tool_click", {
            tool_name: tool,
            transport_type: "beacon"
        });

        // Navigasi langsung.
        window.location.href = destination;
    });
})();
