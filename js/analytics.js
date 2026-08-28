(() => {
    "use strict";

    const GA_ID = "G-8XQLJN1BW";

    // ==========================================
    // Google Analytics dataLayer + gtag
    // ==========================================

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        window.dataLayer.push(arguments);
    }

    window.gtag = gtag;

    // ==========================================
    // Load Google Analytics
    // ==========================================

    if (!document.querySelector('script[data-google-analytics]')) {
        const script = document.createElement("script");

        script.async = true;
        script.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(GA_ID);

        script.dataset.googleAnalytics = "true";

        document.head.appendChild(script);
    }

    // ==========================================
    // Initialize Google Analytics
    // ==========================================

    gtag("js", new Date());

    gtag("config", GA_ID, {
        send_page_view: true
    });

    // ==========================================
    // Tool click tracking
    // ==========================================

    document.addEventListener("DOMContentLoaded", () => {
        const toolLinks = document.querySelectorAll("[data-tool]");

        toolLinks.forEach((link) => {
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

                gtag("event", "tool_click", {
                    tool_name: tool,
                    event_callback: navigate,
                    event_timeout: 1000
                });

                setTimeout(navigate, 1200);
            });
        });
    });
})();
