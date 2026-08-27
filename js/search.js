(() => {
    "use strict";

    const searchInput = document.querySelector(".search");
    const toolCards = document.querySelectorAll(".tool-card");

    if (!searchInput || toolCards.length === 0) {
        return;
    }

    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    searchInput.addEventListener("input", () => {
        const query = normalizeText(
            searchInput.value.trim()
        );

        for (const card of toolCards) {
            const searchableText =
                normalizeText(card.textContent);

            const matches =
                query === "" ||
                searchableText.includes(query);

            card.hidden = !matches;
        }
    });
})();
