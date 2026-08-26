(() => {
    "use strict";

    const form = document.getElementById("invoiceForm");

    if (!form) {
        return;
    }

    if (form.dataset.invoiceInitialized === "true") {
        return;
    }

    form.dataset.invoiceInitialized = "true";

    const itemsContainer =
        document.getElementById("items");

    const addItemButton =
        document.getElementById("addItem");

    const error =
        document.getElementById("error");

    const preview =
        document.getElementById("invoicePreview");

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

    const discount =
        document.getElementById("discount");

    const tax =
        document.getElementById("tax");

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

    const printInvoice =
        document.getElementById("printInvoice");

    let itemCount = 0;

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

    function createItem() {
        itemCount += 1;

        const wrapper =
            document.createElement("div");

        wrapper.className = "invoice-item";

        const nameLabel =
            document.createElement("label");

        nameLabel.textContent = "Nama item";

        const nameInput =
            document.createElement("input");

        nameInput.type = "text";
        nameInput.className = "item-name";
        nameInput.maxLength = 150;
        nameInput.placeholder = "Contoh: Jasa desain";
        nameInput.required = true;

        const quantityLabel =
            document.createElement("label");

        quantityLabel.textContent = "Jumlah";

        const quantityInput =
            document.createElement("input");

        quantityInput.type = "number";
        quantityInput.className = "item-quantity";
        quantityInput.min = "1";
        quantityInput.max = "1000000";
        quantityInput.step = "1";
        quantityInput.value = "1";
        quantityInput.inputMode = "numeric";
        quantityInput.required = true;

        const priceLabel =
            document.createElement("label");

        priceLabel.textContent = "Harga";

        const priceInput =
            document.createElement("input");

        priceInput.type = "number";
        priceInput.className = "item-price";
        priceInput.min = "0";
        priceInput.max = "100000000000";
        priceInput.step = "1";
        priceInput.inputMode = "numeric";
        priceInput.placeholder = "Contoh: 100000";
        priceInput.required = true;

        const removeButton =
            document.createElement("button");

        removeButton.type = "button";
        removeButton.className = "remove-item";
        removeButton.textContent = "Hapus";

        removeButton.addEventListener("click", () => {
            wrapper.remove();
        });

        wrapper.append(
            nameLabel,
            nameInput,
            quantityLabel,
            quantityInput,
            priceLabel,
            priceInput,
            removeButton
        );

        itemsContainer.appendChild(wrapper);
    }

    function getItems() {
        const rows =
            itemsContainer.querySelectorAll(
                ".invoice-item"
            );

        const items = [];

        for (const row of rows) {
            const name =
                row.querySelector(".item-name").value.trim();

            const quantity =
                Number(
                    row.querySelector(".item-quantity").value
                );

            const price =
                Number(
                    row.querySelector(".item-price").value
                );

            if (!name) {
                throw new Error(
                    "Nama item tidak boleh kosong."
                );
            }

            if (
                !Number.isFinite(quantity) ||
                quantity < 1
            ) {
                throw new Error(
                    "Jumlah item harus minimal 1."
                );
            }

            if (
                !Number.isFinite(price) ||
                price < 0
            ) {
                throw new Error(
                    "Harga item tidak valid."
                );
            }

            items.push({
                name,
                quantity,
                price,
                total: quantity * price
            });
        }

        return items;
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return "-";
        }

        const parts =
            dateValue.split("-");

        if (parts.length !== 3) {
            return "-";
        }

        return (
            parts[2] +
            "-" +
            parts[1] +
            "-" +
            parts[0]
        );
    }

    function updatePreview() {
        clearError();

        try {
            const items = getItems();

            if (items.length === 0) {
                throw new Error(
                    "Tambahkan minimal satu item invoice."
                );
            }

            const discountValue =
                Number(discount.value);

            const taxRate =
                Number(tax.value);

            if (
                !Number.isFinite(discountValue) ||
                discountValue < 0
            ) {
                throw new Error(
                    "Nilai diskon tidak valid."
                );
            }

            if (
                !Number.isFinite(taxRate) ||
                taxRate < 0 ||
                taxRate > 100
            ) {
                throw new Error(
                    "Pajak harus berada antara 0% dan 100%."
                );
            }

            const subtotal =
                items.reduce(
                    (sum, item) => sum + item.total,
                    0
                );

            if (discountValue > subtotal) {
                throw new Error(
                    "Diskon tidak boleh lebih besar dari subtotal."
                );
            }

            const afterDiscount =
                subtotal - discountValue;

            const taxAmount =
                afterDiscount * (taxRate / 100);

            const total =
                afterDiscount + taxAmount;

            previewBusinessName.textContent =
                businessName.value.trim();

            previewBusinessInfo.textContent =
                businessInfo.value.trim();

            previewCustomerName.textContent =
                customerName.value.trim();

            previewInvoiceNumber.textContent =
                invoiceNumber.value.trim();

            previewInvoiceDate.textContent =
                formatDate(invoiceDate.value);

            previewItems.replaceChildren();

            for (const item of items) {
                const row =
                    document.createElement("tr");

                const nameCell =
                    document.createElement("td");

                nameCell.textContent = item.name;

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
                    formatRupiah(item.total);

                row.append(
                    nameCell,
                    quantityCell,
                    priceCell,
                    totalCell
                );

                previewItems.appendChild(row);
            }

            previewSubtotal.textContent =
                formatRupiah(subtotal);

            previewDiscount.textContent =
                formatRupiah(discountValue);

            previewTax.textContent =
                formatRupiah(taxAmount);

            previewTotal.textContent =
                formatRupiah(total);

            preview.classList.add("show");

        } catch (err) {
            showError(err.message);
            preview.classList.remove("show");
        }
    }

    addItemButton.addEventListener(
        "click",
        createItem
    );

    form.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();
            updatePreview();
        }
    );

    printInvoice.addEventListener(
        "click",
        function () {
            window.print();
        }
    );

    createItem();

})();
