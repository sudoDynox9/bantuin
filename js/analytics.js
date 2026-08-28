"use strict";

window.dataLayer = window.dataLayer || [];

function gtag() {
    window.dataLayer.push(arguments);
}

window.gtag = gtag;

gtag("js", new Date());
gtag("config", "G-8XQLJN1BW", {
    debug_mode: true
});

function initToolTracking() {
    const toolLinks = document.querySelectorAll("[data-tool]");

    toolLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const tool = link.dataset.tool;

            if (!tool) {
                return;
            }

            gtag("event", "tool_click", {
                tool_name: tool,
                debug_mode: true,
                event_callback: navigate,
                event_timeout: 1000
            });
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToolTracking);
} else {
    initToolTracking();
}
