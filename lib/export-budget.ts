import * as XLSX from "xlsx"

type BudgetExportBreakdown = Record<string, { percentage: number; amount: number; notes?: string }>

function titleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}

function boldRow(sheet: XLSX.WorkSheet, rowIndex: number, columnCount: number) {
  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const address = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex })
    if (!sheet[address]) continue
    sheet[address].s = { font: { bold: true } }
  }
}

export function generateBudgetXlsx(
  breakdown: BudgetExportBreakdown,
  total_budget: number,
  expected_attendance: number,
  event_name: string,
): Buffer {
  const summaryRows = Object.entries(breakdown).map(([key, item]) => ({
    Category: titleCase(key),
    Percentage: `${item.percentage}%`,
    "Amount (£)": item.amount,
    Notes: item.notes ?? "",
  }))

  summaryRows.push({
    Category: "TOTAL",
    Percentage: "100%",
    "Amount (£)": total_budget,
    Notes: event_name,
  })

  const perHeadRows = Object.entries(breakdown).map(([key, item]) => ({
    Category: titleCase(key),
    "Total (£)": item.amount,
    "Per Person (£)": expected_attendance > 0 ? Math.round((item.amount / expected_attendance) * 100) / 100 : 0,
  }))

  const workbook = XLSX.utils.book_new()
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows)
  summarySheet["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 30 }]
  boldRow(summarySheet, 0, 4)
  boldRow(summarySheet, summaryRows.length, 4)

  const perHeadSheet = XLSX.utils.json_to_sheet(perHeadRows)
  perHeadSheet["!cols"] = [{ wch: 20 }, { wch: 14 }, { wch: 16 }]
  boldRow(perHeadSheet, 0, 3)

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Budget Summary")
  XLSX.utils.book_append_sheet(workbook, perHeadSheet, "Per Head Breakdown")

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }) as Buffer
}
