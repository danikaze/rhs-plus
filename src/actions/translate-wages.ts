export function translateWages() {
  translateTable(document.querySelector<HTMLTableElement>('table#main'));
  translateTable(document.querySelector<HTMLTableElement>('table#sub'));
}

function translateTable(table: HTMLTableElement | null): void {
  if (!table) return;
  const cells = Array.from(table.querySelectorAll<HTMLTableCellElement>('th,td'));
  for (const td of cells) {
    const text = JPEN[td.innerText];
    if (!text) continue;
    translateCell(td, text);
  }
}

function translateCell(td: HTMLTableCellElement, text: string): void {
  const html = `<div>${td.innerText}</div><div style="font-size:smaller;">${text}</div>`;
  td.innerHTML = html;
}

// translations from the PDF provided in RHS
const JPEN = {
  // [勤怠日数 (Work Days)]
  勤怠日数: 'Work days',
  勤務日数: 'Days worked',
  欠勤日数: 'Days absent',
  休職日数: 'Leave of absence',
  特別休暇日数: 'Special paid holidays',
  その他休暇日数: 'Other holiday',
  有休取得日数: 'Paid holidays taken',
  有給残日数: 'Paid holidays remaining',
  代休日数: 'Time off in lieu',

  // [勤怠時間 (Work Hours)]
  勤怠時間: 'Work Hours',
  実労働時間: 'Work hours',
  時間外労働時間: 'Overtime',
  '時間外(60H超)': 'Overtime above 60hrs',
  深夜労働時間: 'Late night work hours',
  遅刻早退時間: 'Hours in late/out early',
  法定内時間外: 'Hours exceeding statutory working hours',
  休日労働時間: 'Hours worked in weekend/holiday',

  // [支給（Payment)]
  賞与: 'Bonus',
  支給: 'Payment',
  月額給与: 'Monthly salary',
  月額給与調整: 'Monthly salary adjustment',
  時間外労働手当: 'Overtime allowance',
  // 法定内時間外: 'Overtime allowance (legal hour)',
  深夜労働手当: 'Late night overtime allowance',
  休日労働手当: 'Holiday work allowance',
  欠勤控除: 'Absence deduction',
  '遅刻・早退控除': 'In late/out early deduction',
  代休控除: 'Time off in lieu deduction',
  インセンティブ: 'Incentive allowance',
  住宅手当: 'Housing allowance',
  持株奨励金: 'Stock ownership plan incentive',
  'その他支給1～5': 'Other allowance 1～5',
  通勤手当: 'Commuting allowance',
  通勤手当調整: 'Commuting allowance adjustment',
  通勤手当払戻: 'Commuting allowance refund',
  弔慰金: 'Condolence money',
  予防接種費用: 'Vaccination cost reimbursement',
  健康診断費用: 'Health checkup cost reimbursement',
  健保給付金: 'Health insurance association benefits',
  健保ポイント: 'Healthy Points payback',
  赴任手当: 'Relocation allowance',

  // [控除 (Deductions)]
  控除: 'Deductions',
  持株会: 'Stock ownership plan',
  家賃控除: 'Housing rent deduction',
  フィットネス: 'Rakuten fitness club membership fee',
  'その他控除1～5': 'Other deduction 1～5',
  SO所得税: 'One-yen stock option income tax',
  SO所得税調整: 'One-yen stock option income tax adjustment',
  SO行使代金: 'One-yen stock option total exercise price',
  健康保険料: 'Health insurance',
  介護保険料: 'Nursing insurance',
  厚生年金保険料: 'Employees pension insurance',
  雇用保険料: 'Employment insurance',
  所得税: 'Income tax',
  住民税: 'Inhabitant tax',
  年末調整過不足: 'Year-end tax adjustment refund',

  // [合計欄 (Totals)]
  合計欄: 'Totals',
  課税支給合計: 'Taxable payment',
  支給額合計: 'Total payment',
  社会保険料合計: 'Total social insurance payment',
  控除額合計: 'Total deductions',
  差引支給額: 'NET payment',
  振込額計: 'Bank deposit amount',

  // [支給内訳1 (Payment Breakdown 1)]
  支給内訳1: 'Payment Breakdown 1',
  基準給: 'Standard salary',
  調整給: 'Adjustment salary',

  // [支給内訳2 (Payment Breakdown 2)]
  支給内訳2: 'Payment Breakdown 2',
  月間基本賃金: 'Monthly wage',
  固定時間外手当: 'Fixed overtime allowance',
  裁量労働手当: 'Discretionary work allowance',

  // [累計 (YTD - year to date)]
  累計: 'YTD - year to date',
  課税支給累計: 'Taxable payment',
  支給額累計: 'Income payment',
  社会保険料累計: 'Social insurance payment',
  所得税累計: 'Income tax',

  // [Sub table]
  会社名: 'Company name',
  楽天グループ株式会社: 'Rakuten Group Inc.',
};
