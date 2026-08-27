(() => {
    "use strict";

    const MAX_ITEMS = 50;
    const MAX_QUANTITY = 1000000;
    const MAX_PRICE = 1000000000000;
    const MAX_SAFE_AMOUNT = Number.MAX_SAFE_INTEGER;

    const form = document.getElementById("invoiceForm");

    if (!form) {
        return;
    }

    if (form.dataset.invoiceInitialized === "true") {
        return;
    }

    form.dataset.invoiceInitialized = "true";

    const businessName =
        document.getElementById("businessName");

    const businessInfo =
        document.getElementById("businessInfo");

    const customerName =
        document.getElementById("customerName");

    const invoiceNumber =
        document.getElementById("invoiceNumber");

    const invoiceDate =
        document.getElementById("invoiceDate");

    const itemsContainer =
        document.getElementById("items");

    const addItemButton =
        document.getElementById("addItem");

    const discount =
        document.getElementById("discount");

    const tax =
        document.getElementById("tax");

    const error =
        document.getElementById("error");

    const previewBusinessName =
        document.getElementById("previewBusinessName");

    const previewBusinessInfo =
        document.getElementById("previewBusinessInfo");

    const previewCustomerName =
        document.getElementById("previewCustomerName");

    const previewInvoiceNumber =
        document.getElementById("previewInvoiceNumber");

    const previewInvoiceDate =
        document.getElementById("previewInvoiceDate");

    const previewItems =
        document.getElementById("previewItems");

    const previewSubtotal =
        document.getElementById("previewSubtotal");

    const previewDiscount =
        document.getElementById("previewDiscount");

    const previewTax =
        document.getElementById("previewTax");

    const previewTotal =
        document.getElementById("previewTotal");

    const invoicePreview =
        document.getElementById("invoicePreview");

    const printInvoice =
        document.getElementById("printInvoice");

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
    }

    function clearError() {
        error.textContent = "";
        error.classList.remove("show");
    }

    function getItemCount() {
        return itemsContainer.querySelectorAll(
            ".invoice-item"
        ).length;
    }

    function createItem() {
        clearError();

        if (getItemCount() >= MAX_ITEMS) {
            showError(
                "Maksimal 50 item per invoice."
            );
            return;
        }

        const item = document.createElement("div");
        item.className = "invoice-item";

        const nameLabel =
            document.createElement("label");

        nameLabel.textContent = "Nama item";

        const nameInput =
            document.createElement("input");

        nameInput.type = "text";
        nameInput.className = "item-name";
        nameInput.maxLength = 150;
        nameInput.placeholder =
            "Contoh: Jasa desain";
        nameInput.required = true;

        const quantityLabel =
            document.createElement("label");

        quantityLabel.textContent = "Qty";

        const quantityInput =
            document.createElement("input");

        quantityInput.type = "number";
        quantityInput.className = "item-quantity";
        quantityInput.min = "1";
        quantityInput.max =
            String(MAX_QUANTITY);
        quantityInput.step = "1";
        quantityInput.inputMode = "numeric";
        quantityInput.value = "1";
        quantityInput.required = true;

        const priceLabel =
            document.createElement("label");

        priceLabel.textContent = "Harga";

        const priceInput =
            document.createElement("input");

        priceInput.type = "number";
        priceInput.className = "item-price";
        priceInput.min = "0";
        priceInput.max =
            String(MAX_PRICE);
        priceInput.step = "1";
        priceInput.inputMode = "numeric";
        priceInput.placeholder =
            "Contoh: 100000";
        priceInput.required = true;

        const removeButton =
            document.createElement("button");

        removeButton.type = "button";
        removeButton.className =
            "secondary-button";
        removeButton.textContent = "Hapus";

        removeButton.addEventListener(
            "click",
            () => {
                item.remove();
                clearError();
            }
        );

        item.appendChild(nameLabel);
        item.appendChild(nameInput);

        item.appendChild(quantityLabel);
        item.appendChild(quantityInput);

        item.appendChild(priceLabel);
        item.appendChild(priceInput);

        item.appendChild(removeButton);

        itemsContainer.appendChild(item);
    }

    function getItems() {
        const itemElements =
            itemsContainer.querySelectorAll(
                ".invoice-item"
            );

        const items = [];

        if (itemElements.length > MAX_ITEMS) {
            throw new Error(
                "Jumlah item melebihi batas maksimum."
            );
        }

        for (const itemElement of itemElements) {
            const nameInput =
                itemElement.querySelector(
                    ".item-name"
                );

            const quantityInput =
                itemElement.querySelector(
                    ".item-quantity"
                );

            const priceInput =
                itemElement.querySelector(
                    ".item-price"
                );

            if (
                !nameInput ||
                !quantityInput ||
                !priceInput
            ) {
                throw new Error(
                    "Data item tidak lengkap."
                );
            }

            const name =
                nameInput.value.trim();

            const quantity =
                Number(quantityInput.value);

            const price =
                Number(priceInput.value);

            if (!name) {
                throw new Error(
                    "Nama item tidak boleh kosong."
                );
            }

            if (
                !Number.isSafeInteger(quantity) ||
                quantity < 1 ||
                quantity > MAX_QUANTITY
            ) {
                throw new Error(
                    "Jumlah item harus berupa angka bulat yang valid."
                );
            }

            if (
                !Number.isSafeInteger(price) ||
                price < 0 ||
                price > MAX_PRICE
            ) {
                throw new Error(
                    "Harga item tidak valid."
                );
            }

            const itemTotal =
                quantity * price;

            if (
                !Number.isSafeInteger(itemTotal) ||
                itemTotal > MAX_SAFE_AMOUNT
            ) {
                throw new Error(
                    "Total harga item terlalu besar."
                );
            }

            items.push({
                name,
                quantity,
                price,
                itemTotal
            });
        }

        if (items.length === 0) {
            throw new Error(
                "Tambahkan minimal satu item."
            );
        }

        return items;
    }

    function formatDate(dateValue) {
        const date =
            new Date(`${dateValue}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return new Intl.DateTimeFormat(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(date);
    }

    function createPreviewItem(item) {
        const row =
            document.createElement("tr");

        const nameCell =
            document.createElement("td");

        nameCell.textContent =
            item.name;

        const quantityCell =
            document.createElement("td");

        quantityCell.textContent =
            String(item.quantity);

        const priceCell =
            document.createElement("td");

        priceCell.textContent =
            formatRupiah(item.price);

        const totalCell =
            document.createElement("td");

        totalCell.textContent =
            formatRupiah(item.itemTotal);

        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(totalCell);

        return row;
    }

    function calculateInvoice(items) {
        let subtotal = 0;

        for (const item of items) {
            subtotal += item.itemTotal;

            if (
                !Number.isSafeInteger(subtotal) ||
                subtotal > MAX_SAFE_AMOUNT
            ) {
                throw new Error(
                    "Subtotal invoice terlalu besar."
                );
            }
        }

        const discountPercent =
            Number(discount.value);

        const taxPercent =
            Number(tax.value);

        if (
            !Number.isFinite(discountPercent) ||
            discountPercent < 0 ||
            discountPercent > 100
        ) {
            throw new Error(
                "Diskon harus berada antara 0% dan 100%."
            );
        }

        if (
            !Number.isFinite(taxPercent) ||
            taxPercent < 0 ||
            taxPercent > 100
        ) {
            throw new Error(
                "Pajak harus berada antara 0% dan 100%."
            );
        }

        const discountAmount =
            subtotal *
            (discountPercent / 100);

        if (
            !Number.isFinite(discountAmount) ||
            discountAmount > MAX_SAFE_AMOUNT
        ) {
            throw new Error(
                "Nilai diskon terlalu besar."
            );
        }

        const afterDiscount =
            subtotal - discountAmount;

        if (
            !Number.isFinite(afterDiscount) ||
            afterDiscount < 0 ||
            afterDiscount > MAX_SAFE_AMOUNT
        ) {
            throw new Error(
                "Nilai setelah diskon tidak valid."
            );
        }

        const taxAmount =
            afterDiscount *
            (taxPercent / 100);

        if (
            !Number.isFinite(taxAmount) ||
            taxAmount > MAX_SAFE_AMOUNT
        ) {
            throw new Error(
                "Nilai pajak terlalu besar."
            );
        }

        const total =
            afterDiscount + taxAmount;

        if (
            !Number.isFinite(total) ||
            total < 0 ||
            total > MAX_SAFE_AMOUNT
        ) {
            throw new Error(
                "Total invoice terlalu besar."
            );
        }

        return {
            subtotal,
            discountPercent,
            discountAmount,
            taxPercent,
            taxAmount,
            total
        };
    }

    function updatePreview(data, items) {
        previewBusinessName.textContent =
            data.businessName;

        previewBusinessInfo.textContent =
            data.businessInfo;

        previewCustomerName.textContent =
            data.customerName;

        previewInvoiceNumber.textContent =
            data.invoiceNumber;

        previewInvoiceDate.textContent =
            formatDate(data.invoiceDate);

        previewItems.replaceChildren();

        for (const item of items) {
            previewItems.appendChild(
                createPreviewItem(item)
            );
        }

        previewSubtotal.textContent =
            formatRupiah(data.subtotal);

        previewDiscount.textContent =
            `${data.discountPercent}% (-${formatRupiah(
                data.discountAmount
            )})`;

        previewTax.textContent =
            `${data.taxPercent}% (${formatRupiah(
                data.taxAmount
            )})`;

        previewTotal.textContent =
            formatRupiah(data.total);

        invoicePreview.classList.add("show");
    }

    addItemButton.addEventListener(
        "click",
        createItem
    );

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            clearError();

            try {
                const businessNameValue =
                    businessName.value.trim();

                const businessInfoValue =
                    businessInfo.value.trim();

                const customerNameValue =
                    customerName.value.trim();

                const invoiceNumberValue =
                    invoiceNumber.value.trim();

                const invoiceDateValue =
                    invoiceDate.value;

                if (!businessNameValue) {
                    throw new Error(
                        "Nama usaha tidak boleh kosong."
                    );
                }

                if (!customerNameValue) {
                    throw new Error(
                        "Nama pelanggan tidak boleh kosong."
                    );
                }

                if (!invoiceNumberValue) {
                    throw new Error(
                        "Nomor invoice tidak boleh kosong."
                    );
                }

                if (!invoiceDateValue) {
                    throw new Error(
                        "Tanggal invoice harus diisi."
                    );
                }

                const items = getItems();

                const calculated =
                    calculateInvoice(items);

                const data = {
                    businessName:
                        businessNameValue,

                    businessInfo:
                        businessInfoValue,

                    customerName:
                        customerNameValue,

                    invoiceNumber:
                        invoiceNumberValue,

                    invoiceDate:
                        invoiceDateValue,

                    ...calculated
                };

                updatePreview(
                    data,
                    items
                );
            } catch (submitError) {
                showError(
                    submitError.message ||
                    "Terjadi kesalahan saat membuat invoice."
                );

                invoicePreview.classList.remove(
                    "show"
                );
            }
        }
    );

    printInvoice.addEventListener(
        "click",
        () => {
            window.print();
        }
    );

    createItem();
})();
