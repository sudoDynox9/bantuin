"use strict";

window.dataLayer = window.dataLayer || [];

function gtag() {
    window.dataLayer.push(arguments);
}

window.gtag = gtag;

gtag("js", new Date());
gtag("config", "G-8XQLJN1BW");

document.addEventListener("click", function (event) {
    const link = event.target.closest("[data-tool]");

    if (!link) {
        return;
    }

    const tool = link.dataset.tool;
    const destination = link.href;

    if (!tool || !destination) {
        return;
    }

    event.preventDefault();

    let navigated = false;

    function navigate() {
        if (navigated) {
            return;
        }

        navigated = true;
        window.location.href = destination;
    }

    gtag("event", "tool_click", {
        tool_name: tool,
        event_callback: navigate,
        event_timeout: 1000
    });

    setTimeout(navigate, 1200);
});
