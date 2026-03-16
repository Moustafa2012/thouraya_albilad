# Thuraya Al-Bilad — Bank Transfer Management System
## AI Developer Prompt: Review, Gap Analysis & Implementation Guide

---

## Project Context

You are an expert Full-Stack developer working on an **existing** production application for **Thuraya Al-Bilad Trading Company** — an import company that processes bank wire transfers by generating professional PDF documents sent via email to their banks (which lack digital banking services).

**Tech Stack in use:**
- Backend: **Laravel** (PHP)
- Frontend: **React + shadcn/ui + Tailwind CSS**
- PDF/SVG: Custom SVG template engine (code provided)

---

## Your Role

Your job is **not** to build from scratch. You must:

1. **Review** what has already been built
2. **Identify gaps** between the completed work and the full requirements
3. **Propose and implement** only what is missing or needs updating

---

## What Is Already Done — Do NOT Rebuild

- Full **Welcome Page** with all its sections (company intro, products, services, contact)
- The **SVG transfer document template** with its generation engine
- Helper functions: `generateSVG`, `downloadSVG`, `escapeXml`, `wrapText`
- Helper utilities: `formatAmount`, `numberToWords`, `formatDate`
- The base `TransferFormData` schema

---

## Known Gaps in the SVG Transfer Document

After reviewing the provided SVG template code, the following data fields are **missing** from the document and must be added:

| Field | Status | Note |
|---|---|---|
| Transfer number | Missing | No `TRANSFER_NUMBER` placeholder exists |
| Beneficiary name | Missing | No beneficiary section in SVG |
| Beneficiary IBAN | Missing | No `BENEFICIARY_IBAN` placeholder |
| Beneficiary bank | Missing | No `BENEFICIARY_BANK` placeholder |
| Beneficiary country | Missing | No `BENEFICIARY_COUNTRY` placeholder |
| Sender account number | Missing | Company name exists but account number does not |
| Sender bank name | Missing | Not represented in the document |
| Currency as separate field | Partial | Currently embedded inside `formatAmount` output |
| Stamp area | Missing | Signature box exists but no stamp box |
| Authorized signatory name | Missing | No `AUTHORIZED_BY` placeholder |

The SVG template, the `TransferFormData` schema, and the `generateSVG` function all need to be updated to reflect these missing fields.

---

## User Roles & Permissions

### Three Base Roles

| Role | Access Level |
|---|---|
| `SUPER_ADMIN` | Unrestricted access to everything including user management and custom permission assignment |
| `ADMIN` | Access to dashboard, transfers, beneficiaries, bank accounts, journal entries, reports |
| `VISITOR` | Public Welcome Page only — no access to the internal dashboard |

### Custom Permissions System (SUPER_ADMIN only)
- Assign permissions **per individual user**
- Assign permissions **per group**
- Permissions are granular per module: `view`, `create`, `edit`, `delete`, `send_email`, `export_pdf`, `manage_users`

### Navigation Logic
- After login, if role is `VISITOR` → redirect to Welcome Page, no dashboard button shown in user nav
- If role is `ADMIN` or `SUPER_ADMIN` → user nav shows a **Dashboard** button leading to the internal app
- `SUPER_ADMIN` additionally sees a **User Management** button

---

## Full Application Structure

### Public Zone

**Welcome Page** ✅ Already complete

---

### Protected Zone — Employee Dashboard

Accessible only to `ADMIN` and `SUPER_ADMIN`.

---

#### 1. Dashboard Page
Provides a high-level operational overview:

- Summary cards: total transfers this month, total amounts transferred, active beneficiaries count, bank accounts count
- Charts: transfers distribution by currency, transfers volume over time
- Latest 5 transfers with their status
- Quick action buttons

---

#### 2. Transfers Page
Lists all wire transfer records with the ability to manage them.

**List view includes:**
- Transfer number, date, beneficiary name, sender bank, amount, currency, status (Draft / Sent / Confirmed)
- Search and filters: by date range, beneficiary, bank, status, currency
- Row actions: view details, download PDF, send via email, edit (if Draft), delete

**Create Transfer Form** produces a PDF document with these exact sections:

```
FIXED HEADER
  Company logo + name + contact details

DOCUMENT TITLE
  "Bank Transfer Request" + date + transfer number

SENDER INFORMATION (Client)
  Company name + account number + bank name

FINANCIAL DETAILS
  Amount in numbers + amount in words + currency + purpose

BENEFICIARY INFORMATION
  Name + account number + beneficiary bank + IBAN + country

AUTHENTICATION ZONE
  Signature field + stamp field + authorized signatory name

FIXED FOOTER
  Legal notes + company details
```

- Beneficiary selected from saved beneficiaries list
- Sender bank account selected from saved bank accounts
- Amount validated against available account balance
- Live PDF preview before sending
- Direct email send to the bank address linked to the selected account

---

#### 3. Beneficiaries Page
Manage all saved transfer recipients.

- Table: name, country, bank name, account number, IBAN, preferred currency, status
- Search and filter capabilities
- Row actions: edit, deactivate, delete, view transfer history for this beneficiary
- Create new beneficiary form

---

#### 4. Bank Accounts Page
Manage all company bank accounts used for sending transfers.

- Table: bank name, account number, currency, current balance, bank email address, status
- Balance is automatically calculated: opening balance ± journal entries ± transfers
- Row actions: edit, view account statement, deactivate
- Create new bank account form

---

#### 5. Journal Entries Page
Manage manual financial entries that affect bank account balances.

- Table: date, account name, type (Debit / Credit), amount, description, created by
- Filters: by account, type, date range, user
- Every entry immediately affects the linked bank account balance
- Create new journal entry form with Debit / Credit selection

---

#### 6. Reports Page
Financial reporting and account statements.

- **Bank Account Statement:** select account + date range → detailed table (date, description, debit, credit, running balance) with PDF/Excel export
- **Beneficiary Statement:** total amounts transferred per beneficiary
- **Summary Report:** totals grouped by currency, beneficiary, bank, or period

---

#### 7. Audit Log Page
Full immutable activity log for all system events.

- Logs: who performed the action, action type, details, timestamp, IP address
- Covers: login/logout, create/edit/delete of any record, email sends, PDF downloads, permission changes
- Filters: by user, action type, date range
- Read-only — no record can be deleted, even by `SUPER_ADMIN`

---

#### 8. User Management Page (SUPER_ADMIN only)
Full control over user accounts and permissions.

- Table of all users with their roles and status
- Create new user with role assignment
- Edit user: change role, assign/revoke individual permissions per module
- Create and manage permission groups
- Assign users to groups
- Deactivate or delete users

---

## Transfer Number Format

Auto-generated sequential format:

```
TBT-{YEAR}-{4-DIGIT-SEQUENCE}

Examples:
  TBT-2025-0001
  TBT-2025-0042
  TBT-2026-0001  ← resets each year
```

---

## Email Workflow

When sending a transfer:
1. System generates the PDF from the SVG template
2. Email is composed with the PDF attached
3. Recipient address is auto-filled from the bank account's saved email
4. User can review and optionally edit the email body before sending
5. On successful send: transfer status changes to `Sent`, timestamp recorded, audit log entry created

---

## Implementation Priority Order

When deciding what to build or update next, follow this sequence:

1. Fix SVG template — add all missing fields listed in the gap analysis
2. Update `TransferFormData` schema to include the new fields
3. Update `generateSVG` function to inject the new fields
4. Database migrations for: `bank_accounts`, `beneficiaries`, `transfers`, `journal_entries`, `audit_logs`
5. Laravel models, observers (auto-balance updates), and middleware (role + permission checks)
6. API controllers for all modules
7. React pages in this order: Dashboard → Transfers → Beneficiaries → Banks → Journal → Reports → Audit Log → User Management

---

## General Rules for This Project

- Never remove or rewrite existing working code unless explicitly instructed
- Every new route must pass through role and permission middleware
- Every state-changing operation must automatically create an audit log entry
- Balance updates on bank accounts must always be computed, never manually stored (or use an observer pattern)
- All forms use React Hook Form + Zod validation
- All tables support search, filter, and pagination
- The app UI uses shadcn/ui components with Tailwind CSS — maintain visual consistency
- No new UI libraries unless absolutely necessary