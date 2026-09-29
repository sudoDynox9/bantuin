(() => {
    "use strict";

    document.addEventListener("click", (event) => {
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

        gtag("event", "tool_click", {
            tool_name: tool,
            transport_type: "beacon"
        });

        window.location.href = destination;
    });
})();
