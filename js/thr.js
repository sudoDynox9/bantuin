"use strict";

const form = document.getElementById("thrForm");
const upahInput = document.getElementById("upah");
const masaKerjaInput = document.getElementById("masaKerja");

const result = document.getElementById("result");
const amount = document.getElementById("amount");
const calculation = document.getElementById("calculation");
const error = document.getElementById("error");

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

    const upah = Number(upahInput.value);
    const masaKerja = Number(masaKerjaInput.value);

    if (!Number.isFinite(upah) || upah <= 0) {
        showError("Masukkan jumlah upah yang valid.");
        return;
    }

    if (!Number.isFinite(masaKerja) || masaKerja < 1) {
        showError("Masa kerja minimal 1 bulan.");
        return;
    }

    if (masaKerja > 600) {
        showError("Masa kerja yang dimasukkan terlalu besar.");
        return;
    }

    let thr;

    if (masaKerja >= 12) {
        thr = upah;
    } else {
        thr = (masaKerja / 12) * upah;
    }

    amount.textContent = formatRupiah(thr);

    if (masaKerja >= 12) {
        calculation.textContent =
            "Masa kerja 12 bulan atau lebih → 1 bulan upah (" +
            formatRupiah(upah) +
            ").";
    } else {
        calculation.textContent =
            masaKerja +
            "/12 × " +
            formatRupiah(upah) +
            " = " +
            formatRupiah(thr);
    }

    result.classList.add("show");
});
