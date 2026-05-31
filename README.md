# Expense Report Approval Module

A React + Vite front-end application for managing expense report approvals.

## Features

- **Reports Listing** — View all employee expense reports with status, amount, approver, and bill count. Filter by Pending / All and search by name or report.
- **Report Detail** — Drill into a report to see employee info, total vs approved amounts, and individual expense bills. Approve or reject the full report or individual bills.
- **Bill Preview Modal** — Full image viewer for uploaded bill receipts with zoom (±), rotate (left/right), download, and delete. Navigate between bills in the report. Switch between Details and Comments tabs. Add comments inline.
- **File Upload** — Supports JPG, JPEG, PNG, and PDF. Files are stored as base64 in `localStorage` for persistence across sessions.
- **Persistent State** — All report data, bill statuses, uploaded files, and comments are saved to `localStorage`.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite | Build tool & dev server |
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| CSS Modules | Scoped component styles |
| Lucide React | Icon library |
| localStorage | Client-side persistence |

## Project Structure

```
src/
├── data/           # Mock seed data
├── context/        # ExpenseContext (state + actions via useReducer)
├── hooks/          # useLocalStorage
├── utils/          # helpers (formatAmount, fileUtils, etc.)
└── components/
    ├── layout/     # Sidebar
    ├── ui/         # Avatar, Badge (shared atoms)
    ├── reports/    # Screen 1 — Reports listing
    ├── report-detail/  # Screen 2 — Report detail + BillItem
    └── bill-preview/   # Screen 3/4 — Modal with ImageViewer + Details/Comments
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Notes

- `localStorage` has a ~5 MB limit. Uploading very large images/PDFs may fail; the app warns in the console when this happens.
- Approving/rejecting a full report cascades the status to all individual bills.
- Bill status is recomputed automatically: all approved → Approved, all rejected → Rejected, mixed → Partially Approved.
