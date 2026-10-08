// Payslip PDF, generated in the browser. jsPDF is loaded on demand so it doesn't weigh down page loads.
import { fullName, MONTHS } from "./utils";

const money = (v, currency) =>
  `${currency} ${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Unpaid days used for the slip (manual override wins). */
export const unpaidDaysOf = (p) =>
  p.unpaidDaysOverride != null
    ? Number(p.unpaidDaysOverride)
    : p.workingDays - Number(p.eligibleDays) + Number(p.absentDays) + Number(p.unpaidLeaveDays);

export async function downloadPayslipPdf(slip, companyName = "Markeltree") {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const cur = slip.run.currency;
  const period = `${MONTHS[slip.run.month - 1]} ${slip.run.year}`;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  doc.setFillColor(93, 95, 239);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(companyName, 40, 32);
  doc.setFontSize(11);
  doc.text(`Payslip — ${period}`, 40, 52);
  doc.setTextColor(30, 30, 50);

  const e = slip.employee;
  autoTable(doc, {
    startY: 90,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    body: [
      ["Employee", fullName(e), "Employee code", e.employeeCode],
      ["Designation", e.designation ?? "—", "Department", e.department?.name ?? "—"],
      ["Paid days", `${slip.workingDays - unpaidDaysOf(slip)} of ${slip.workingDays}`, "Unpaid days", String(unpaidDaysOf(slip))],
      ["Bank", slip.bankName ?? "—", "Account", slip.bankAccount ?? "—"],
    ],
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 90 }, 2: { fontStyle: "bold", cellWidth: 90 } },
  });

  const adjustments = slip.adjustments ?? [];
  const earnings = [["Basic salary", money(slip.basicSalary, cur)], ...slip.earnings.map((x) => [x.name, money(x.amount, cur)]), ...adjustments.filter((a) => a.type === "EARNING").map((a) => [a.name, money(a.amount, cur)])];
  const deductions = [
    ...(Number(slip.absenceDeduction) ? [[`Unpaid days (${unpaidDaysOf(slip)})`, money(slip.absenceDeduction, cur)]] : []),
    ...slip.deductions.map((x) => [x.name, money(x.amount, cur)]),
    ...adjustments.filter((a) => a.type === "DEDUCTION").map((a) => [a.name, money(a.amount, cur)]),
    ...(Number(slip.taxAmount) ? [["Income tax", money(slip.taxAmount, cur)]] : []),
  ];
  const rows = Math.max(earnings.length, deductions.length);
  const body = Array.from({ length: rows }, (_, i) => [...(earnings[i] ?? ["", ""]), ...(deductions[i] ?? ["", ""])]);
  const grossTotal = Number(slip.grossPay) + adjustments.filter((a) => a.type === "EARNING").reduce((s, a) => s + Number(a.amount), 0);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 16,
    head: [["Earnings", "Amount", "Deductions", "Amount"]],
    body,
    foot: [["Total earnings", money(grossTotal, cur), "Total deductions", money(slip.totalDeductions, cur)]],
    theme: "grid",
    headStyles: { fillColor: [93, 95, 239] },
    footStyles: { fillColor: [244, 246, 249], textColor: [30, 30, 50], fontStyle: "bold" },
    styles: { fontSize: 10 },
    columnStyles: { 1: { halign: "right" }, 3: { halign: "right" } },
  });

  const y = doc.lastAutoTable.finalY + 24;
  doc.setFillColor(244, 246, 249);
  doc.roundedRect(40, y, W - 80, 44, 6, 6, "F");
  doc.setFontSize(13);
  doc.text("Net pay", 56, y + 27);
  doc.setFont(undefined, "bold");
  doc.text(money(slip.netPay, cur), W - 56, y + 27, { align: "right" });
  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 156);
  doc.text("This is a system-generated payslip and does not require a signature.", 40, y + 70);

  doc.save(`payslip-${e.employeeCode}-${slip.run.year}-${String(slip.run.month).padStart(2, "0")}.pdf`);
}
