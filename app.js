const table = document.getElementById("table");
const invoiceEl = document.getElementById("invoice");
const totalEl = document.getElementById("grandTotal");

let invoice = localStorage.getItem("invoice") || 1;
invoiceEl.textContent = invoice;

// إنشاء 10 أسطر
for (let i = 0; i < 10; i++) {
  const row = table.insertRow();
  row.innerHTML = `
    <td><input></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td>0</td>
  `;
}

// حساب تلقائي
table.addEventListener("input", () => {
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    const r = table.rows[i];
    const price = r.cells[1].children[0].value || 0;
    const qty = r.cells[2].children[0].value || 0;
    const sum = price * qty;
    r.cells[3].textContent = sum;
    total += sum;
  }
  totalEl.textContent = total;
});

function saveInvoice() {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    const r = table.rows[i];
    if (r.cells[0].children[0].value !== "") {
      data.push({
        item: r.cells[0].children[0].value,
        price: r.cells[1].children[0].value,
        qty: r.cells[2].children[0].value,
        total: r.cells[3].textContent
      });
    }
  }
  if (data.length === 0) {
    alert("ماكو مواد");
    return;
  }
  localStorage.setItem("invoice_" + invoice, JSON.stringify(data));
  localStorage.setItem("invoice", ++invoice);
  alert("تم الحفظ ✅");
  location.reload();
}

function clearInvoice() {
  location.reload();
}
