(() => {
    "use strict";

    const MEASUREMENT_ID = "G-8XQLJN1BW";

    // Inisialisasi Google Analytics tanpa inline script.
    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
        window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);

    // Tracking klik pada kartu tools.
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

        window.gtag("event", "tool_click", {
            tool_name: tool,
            transport_type: "beacon"
        });

        window.location.href = destination;
    });
})();
