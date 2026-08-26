(() => {
    "use strict";

    const form = document.getElementById("gajiForm");

    if (!form) {
        return;
    }

    if (form.dataset.gajiInitialized === "true") {
        return;
    }

    form.dataset.gajiInitialized = "true";

    const gajiPokokInput =
        document.getElementById("gajiPokok");

    const tunjanganInput =
        document.getElementById("tunjangan");

    const bpjsInput =
        document.getElementById("bpjs");

    const potonganLainInput =
        document.getElementById("potonganLain");

    const result =
        document.getElementById("result");

    const amount =
        document.getElementById("amount");

    const calculation =
        document.getElementById("calculation");

    const error =
        document.getElementById("error");

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(value);
    }

    function showError(message) {
        error.textContent = message;
        error.classList.add("show");
        result.classList.remove("show");
    }

    function clearError() {
        error.textContent = "";
        error.classList.remove("show");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        clearError();

        const gajiPokok = Number(gajiPokokInput.value);
        const tunjangan = Number(tunjanganInput.value);
        const bpjs = Number(bpjsInput.value);
        const potonganLain = Number(
            potonganLainInput.value
        );

        const values = [
            gajiPokok,
            tunjangan,
            bpjs,
            potonganLain
        ];

        if (!values.every(Number.isFinite)) {
            showError(
                "Masukkan semua angka dengan benar."
            );
            return;
        }

        if (gajiPokok <= 0) {
            showError(
                "Gaji pokok harus lebih dari Rp0."
            );
            return;
        }

        if (tunjangan < 0) {
            showError(
                "Tunjangan tidak boleh bernilai negatif."
            );
            return;
        }

        if (bpjs < 0) {
            showError(
                "Potongan BPJS tidak boleh bernilai negatif."
            );
            return;
        }

        if (potonganLain < 0) {
            showError(
                "Potongan lain tidak boleh bernilai negatif."
            );
            return;
        }

        const gajiKotor =
            gajiPokok + tunjangan;

        const totalPotongan =
            bpjs + potonganLain;

        const gajiBersih =
            gajiKotor - totalPotongan;

        if (gajiBersih < 0) {
            showError(
                "Total potongan tidak boleh melebihi gaji kotor."
            );
            return;
        }

        amount.textContent =
            formatRupiah(gajiBersih);

        calculation.textContent =
            formatRupiah(gajiPokok) +
            " + " +
            formatRupiah(tunjangan) +
            " - " +
            formatRupiah(bpjs) +
            " - " +
            formatRupiah(potonganLain) +
            " = " +
            formatRupiah(gajiBersih);

        result.classList.add("show");
    });
})();
