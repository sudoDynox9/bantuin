"use strict";

const diskonForm = document.getElementById("diskonForm");
const harga = document.getElementById("harga");
const diskon = document.getElementById("diskon");

const result = document.getElementById("result");
const amount = document.getElementById("amount");
const calculation = document.getElementById("calculation");
const error = document.getElementById("error");

const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const showError = (message) => {
    error.textContent = message;
    error.classList.add("show");
    result.classList.remove("show");
};

const hideError = () => {
    error.textContent = "";
    error.classList.remove("show");
};

diskonForm.addEventListener("submit", (event) => {
    event.preventDefault();

    hideError();

    const hargaAwal = Number(harga.value);
    const persentaseDiskon = Number(diskon.value);

    if (!Number.isFinite(hargaAwal) || hargaAwal <= 0) {
        showError("Masukkan harga awal yang valid.");
        harga.focus();
        return;
    }

    if (
        !Number.isFinite(persentaseDiskon) ||
        persentaseDiskon < 0 ||
        persentaseDiskon > 100
    ) {
        showError("Diskon harus berada antara 0% dan 100%.");
        diskon.focus();
        return;
    }

    const jumlahDiskon = hargaAwal * (persentaseDiskon / 100);
    const hargaAkhir = hargaAwal - jumlahDiskon;

    amount.textContent = formatRupiah(hargaAkhir);

    calculation.textContent =
        `Harga awal ${formatRupiah(hargaAwal)} - ` +
        `diskon ${formatRupiah(jumlahDiskon)} = ` +
        `harga akhir ${formatRupiah(hargaAkhir)}.`;

    result.classList.add("show");
});
