(() => {
    "use strict";

    /*
     * Bantuin Analytics
     * Google Analytics 4
     * Measurement ID: G-8XQLJN1BW
     */

    const MEASUREMENT_ID = "G-8XQLJN1BW";
    const COLLECT_URL =
        "https://www.google-analytics.com/g/collect";

    /*
     * Google tag / dataLayer
     */
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        window.dataLayer.push(arguments);
    }

    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID);


    /*
     * Membuat client ID sederhana untuk pengukuran.
     *
     * Tidak menggunakan data pribadi.
     * Disimpan di sessionStorage sehingga tidak perlu
     * mengganggu cookie Google Analytics.
     */
    function getClientId() {
        const storageKey = "bantuin_ga_client_id";

        try {
            let clientId = sessionStorage.getItem(storageKey);

            if (!clientId) {
                clientId =
                    Date.now().toString(36) +
                    "." +
                    Math.random()
                        .toString(36)
                        .substring(2, 12);

                sessionStorage.setItem(
                    storageKey,
                    clientId
                );
            }

            return clientId;
        } catch (error) {
            /*
             * Jika storage tidak tersedia, tetap buat ID
             * sementara untuk request ini.
             */
            return (
                Date.now().toString(36) +
                "." +
                Math.random()
                    .toString(36)
                    .substring(2, 12)
            );
        }
    }


    /*
     * Mengirim event tool_click menggunakan sendBeacon.
     *
     * sendBeacon dirancang untuk pengiriman data kecil
     * ketika halaman akan berpindah atau ditutup.
     */
    function sendToolClick(toolName, destination) {
        if (!toolName || !destination) {
            return;
        }

        let url;

        try {
            url = new URL(destination, window.location.href);
        } catch (error) {
            return;
        }

        /*
         * Hanya catat navigasi ke domain Bantuin sendiri.
         */
        if (url.origin !== window.location.origin) {
            return;
        }

        const clientId = getClientId();

        const params = new URLSearchParams();

        params.set("v", "2");
        params.set("tid", MEASUREMENT_ID);
        params.set("cid", clientId);

        /*
         * Nama event GA4.
         */
        params.set("en", "tool_click");

        /*
         * Parameter event.
         */
        params.set(
            "ep.tool_name",
            String(toolName).substring(0, 100)
        );

        params.set(
            "ep.destination",
            url.href.substring(0, 500)
        );

        /*
         * Informasi halaman asal.
         */
        params.set(
            "dl",
            window.location.href.substring(0, 500)
        );

        params.set(
            "dt",
            document.title.substring(0, 200)
        );

        /*
         * ID halaman/request.
         */
        params.set(
            "_p",
            String(Date.now())
        );

        const payload = params.toString();


        /*
         * Prioritas utama:
         * navigator.sendBeacon()
         */
        if (
            typeof navigator.sendBeacon === "function"
        ) {
            try {
                const sent = navigator.sendBeacon(
                    COLLECT_URL,
                    new Blob(
                        [payload],
                        {
                            type:
                                "application/x-www-form-urlencoded;charset=UTF-8"
                        }
                    )
                );

                if (sent) {
                    return;
                }
            } catch (error) {
                /*
                 * Lanjut ke fallback.
                 */
            }
        }


        /*
         * Fallback jika sendBeacon tidak tersedia
         * atau browser menolak beacon.
         *
         * keepalive memungkinkan request tetap dikirim
         * ketika navigasi terjadi.
         */
        try {
            fetch(
                COLLECT_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    body: payload,
                    keepalive: true,
                    credentials: "omit"
                }
            ).catch(() => {
                /*
                 * Jangan mengganggu navigasi jika analytics gagal.
                 */
            });
        } catch (error) {
            /*
             * Analytics gagal tidak boleh mengganggu website.
             */
        }
    }


    /*
     * Event delegation.
     *
     * Tidak perlu memasang listener satu per satu.
     * Semua link yang mempunyai data-tool akan terdeteksi.
     */
    document.addEventListener(
        "click",
        (event) => {
            /*
             * Hanya klik utama dengan tombol kiri mouse.
             */
            if (event.button !== 0) {
                return;
            }

            /*
             * Abaikan modifier key karena biasanya pengguna
             * ingin membuka link di tab/window lain.
             */
            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const link =
                event.target.closest(
                    "a[data-tool]"
                );

            if (!link) {
                return;
            }

            const tool =
                link.dataset.tool;

            const destination =
                link.href;

            if (!tool || !destination) {
                return;
            }

            /*
             * Kirim analytics SEBELUM browser melakukan
             * navigasi normal.
             *
             * Tidak ada preventDefault().
             * Tidak ada event_callback().
             * Tidak ada setTimeout().
             */
            sendToolClick(
                tool,
                destination
            );
        },
        {
            capture: true,
            passive: true
        }
    );
})();
