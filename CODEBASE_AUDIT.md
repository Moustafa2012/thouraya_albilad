# Codebase Audit — Thuraya Al-Bilad

**Date:** 2026-03-15  
**Scope:** Full-stack audit of API endpoints, data models, services, and frontend components with frontend–backend mapping and mismatch documentation.

---

## 1. API Endpoints Inventory

### 1.1 Web Routes (`routes/web.php`)

| Method | URI | Name | Controller@action | Middleware |
|--------|-----|------|-------------------|------------|
| GET | `/` | home | Closure → Inertia welcome | — |
| GET | `/dashboard` | dashboard | Closure → Inertia dashboard | auth, verified |
| GET | `/transactions` | transactions | Closure → Inertia transactions | auth, verified |
| GET | `/transfers` | transfers.index | TransferController@index | auth, verified |
| GET | `/transfers/create` | transfers.create | TransferController@create | auth, verified |
| POST | `/transfers` | transfers.store | TransferController@store | auth, verified |
| GET | `/transfers/balance-check` | transfers.balance-check | TransferController@balanceCheck | auth, verified |
| GET | `/transfers/{transfer}` | transfers.show | TransferController@show | auth, verified |
| GET | `/transfers/{transfer}/document.svg` | transfers.document.svg | TransferController@documentSvg | auth, verified |
| GET | `/transfers/{transfer}/document.pdf` | transfers.document.pdf | TransferController@documentPdf | auth, verified |
| POST | `/transfers/{transfer}/resend` | transfers.resend | TransferController@resend | auth, verified |
| GET | `/beneficiaries` | beneficiaries.index | BeneficiaryController@index | auth, verified |
| GET | `/beneficiaries/create` | beneficiaries.create | BeneficiaryController@create | auth, verified |
| POST | `/beneficiaries` | beneficiaries.store | BeneficiaryController@store | auth, verified |
| GET | `/beneficiaries/{beneficiary}` | beneficiaries.show | BeneficiaryController@show | auth, verified |
| GET | `/beneficiaries/{beneficiary}/edit` | beneficiaries.edit | BeneficiaryController@edit | auth, verified |
| PATCH/PUT | `/beneficiaries/{beneficiary}` | beneficiaries.update | BeneficiaryController@update | auth, verified |
| DELETE | `/beneficiaries/{beneficiary}` | beneficiaries.destroy | BeneficiaryController@destroy | auth, verified |
| GET | `/bank-accounts` | bank-accounts.index | BankAccountController@index | auth, verified |
| GET | `/bank-accounts/create` | bank-accounts.create | BankAccountController@create | auth, verified |
| POST | `/bank-accounts` | bank-accounts.store | BankAccountController@store | auth, verified |
| GET | `/bank-accounts/{bank_account}` | bank-accounts.show | BankAccountController@show | auth, verified |
| GET | `/bank-accounts/{bank_account}/edit` | bank-accounts.edit | BankAccountController@edit | auth, verified |
| PATCH/PUT | `/bank-accounts/{bank_account}` | bank-accounts.update | BankAccountController@update | auth, verified |
| DELETE | `/bank-accounts/{bank_account}` | bank-accounts.destroy | BankAccountController@destroy | auth, verified |
| POST | `/bank-accounts/{bank_account}/suspend` | bank-accounts.suspend | BankAccountController@suspend | auth, verified |
| POST | `/bank-accounts/{bank_account}/activate` | bank-accounts.activate | BankAccountController@activate | auth, verified |
| GET | `/journals` | journals | JournalEntryController@index | auth, verified |
| GET | `/journals/create` | journals.create | JournalEntryController@create | auth, verified |
| POST | `/journals` | JournalEntryController@store | journals.store | auth, verified |
| GET | `/audit-logs` | audit-logs | AuditLogController@index | auth, verified |

### 1.2 Settings Routes (`routes/settings.php`)

| Method | URI | Name | Controller@action |
|--------|-----|------|-------------------|
| GET | `/settings/profile` | profile.edit | ProfileController@edit |
| PATCH | `/settings/profile` | profile.update | ProfileController@update |
| DELETE | `/settings/profile` | profile.destroy | ProfileController@destroy |
| GET | `/settings/password` | user-password.edit | PasswordController@edit |
| PUT | `/settings/password` | user-password.update | PasswordController@update |
| GET | `/settings/appearance` | appearance.edit | Closure → Inertia settings/appearance |
| GET | `/settings/two-factor` | two-factor.show | TwoFactorAuthenticationController@show |
| GET | `/settings/users` | settings.users | UserManagementController@index |
| PATCH | `/settings/users/{managedUser}` | settings.users.update | UserManagementController@update |
| GET | `/settings/smtp` | settings.smtp.edit | SmtpSettingsController@edit |
| PUT | `/settings/smtp` | settings.smtp.update | SmtpSettingsController@update |

### 1.3 AuditLogController — Routes Not Exposed in Web

The following methods exist on `AuditLogController` but **have no routes** in `web.php` or `settings.php`:

| Method | Purpose |
|--------|---------|
| `stats(Request)` | JSON stats (totals, by severity, by action, etc.) |
| `export(Request)` | CSV/JSON export of logs |
| `show(Request, int $id)` | Single log entry JSON |
| `userTimeline(Request, int $userId)` | Timeline for a user |

**Recommendation:** Add routes for export (and optionally stats) if the UI is expected to support export/stats:

- `GET /audit-logs/stats` → `AuditLogController@stats`
- `GET /audit-logs/export` → `AuditLogController@export`

---

## 2. Data Models Inventory

### 2.1 Core Models and Key Attributes

| Model | Table | Key attributes / relationships |
|-------|--------|---------------------------------|
| **User** | users | role, is_super_admin, permissions; relations: transfers, beneficiaries (via user_id) |
| **Transfer** | transfers | transfer_number, user_id, bank_account_id, beneficiary_id, amount, currency, transfer_date, reference_number, notes, bank_email, status, document_hash; relations: user, bankAccount, beneficiary |
| **BankAccount** | bank_accounts | user_id, company_id, account_name, holder_name_ar/en, bank_name, bank_email, account_number (encrypted), iban (encrypted), currency, balance, status, is_active; relations: user, company, personal, business, audits |
| **Beneficiary** | beneficiaries | user_id, name_ar, name_en, country, bank_name, account_number, iban, swift_code, currency, …; relation: user |
| **JournalEntry** | journal_entries | user_id, bank_account_id, date, description, reference, type, status, amount, currency, direction (debit/credit); relations: user, bankAccount |
| **AuditLog** | audit_logs | user_id, action, auditable_type, auditable_id, old_values, new_values, ip_address, user_agent, description, severity; relations: user, auditable |
| **UserActivityLog** | user_activity_logs | user_id, action, description, severity, …; relation: user |

### 2.2 API Resources (Backend → Frontend shape)

| Resource | Key fields exposed (camelCase) |
|----------|-------------------------------|
| **TransferResource** | id, transferNumber, bankAccountId, beneficiaryId, amount, currency, transferDate, referenceNumber, notes, bankEmail, status, createdAt, updatedAt, bankAccount (whenLoaded), beneficiary (whenLoaded) |
| **BankAccountResource** | id, accountName, holderNameAr/En, bankName, bankEmail, accountNumber, iban, currency, balance, status, isActive, business/personal details, … |
| **JournalEntryResource** | id, date, description, reference, type, status, amount, currency — **missing:** bankAccountId, direction |

**Mismatch:** `JournalEntryResource` does not expose `bankAccountId` or `direction` (both exist on `journal_entries` and are used by `JournalEntryObserver` for balance updates). Frontend journal create form does not send `bank_account_id` or `direction`; backend `StoreJournalEntryRequest` does not validate them.

---

## 3. Service Methods Inventory

| Service | Methods |
|---------|---------|
| **TransferService** | create(StoreTransferRequest), sendToBank(Transfer), documentHash(Transfer) (private) |
| **TransferDocumentService** | renderSvg(Transfer), renderPdf(Transfer) |
| **BeneficiaryService** | create, update, delete (signatures inferred from controller) |
| **BankAccountService** | create, update, delete, suspend, activate |
| **JournalEntryService** | create(StoreJournalEntryRequest) — does not accept bank_account_id or direction |
| **AuditLogger** (Logging) | logCustom, … (creates AuditLog records) |
| **ActivityLogger** (Logging) | log([…]) (creates UserActivityLog records) |

---

## 4. Frontend Pages and Expected Props

| Inertia page | Route / controller | Expected props (from backend) |
|--------------|--------------------|--------------------------------|
| welcome | GET / | canRegister |
| dashboard | GET /dashboard | (none) |
| transactions | GET /transactions | (none) |
| transfers | TransferController@index | transfers (TransferResource collection) |
| Createtransfer | TransferController@create | accounts (BankAccountResource), beneficiaries (camelCase array) |
| transfer-show | TransferController@show | transfer (TransferResource) |
| beneficiaries | BeneficiaryController@index | beneficiaries (camelCase array) |
| Createbeneficiary | BeneficiaryController@create, edit | (none) or beneficiary, isEdit |
| bank-accounts | BankAccountController@index, show | accounts (BankAccountResource) or account (single) |
| Createbankaccount | BankAccountController@create, edit | (none) or account, isEdit |
| journals | JournalEntryController@index | journals (JournalEntryResource collection) |
| Createjournal | JournalEntryController@create | (none) — **missing:** bank accounts list for linking entries |
| audit-logs | AuditLogController@index | logs, pagination, filters |
| settings/profile | ProfileController@edit | (profile data) |
| settings/password | PasswordController@edit | (none) |
| settings/appearance | Closure | (none) |
| settings/two-factor | TwoFactorAuthenticationController@show | (2FA state) |
| settings/users | UserManagementController@index | users, roles, … |
| settings/smtp | SmtpSettingsController@edit | smtpSettings, … |
| auth/login, register, etc. | Fortify | (varies) |

---

## 5. Documented Mismatches and Fixes

### 5.1 Fixed in This Audit

| Issue | Resolution |
|-------|------------|
| **BankAccountController@index** returned all bank accounts (no user scope) | **Fixed:** Scoped query by `user_id` so only the current user’s accounts are returned. |
| **AuditLogController** applied filters `description` and `severity` on `audit_logs` table which had no such columns | **Fixed:** Migration added `description` (nullable text) and `severity` (nullable string, default `info`) to `audit_logs`. |
| **Audit-logs frontend** sent `dateRange` and did not refetch on filter change | **Fixed:** Query params now send `date_range` (and optional `start_date`, `end_date`, `user_id`). Filter change and “clear filters” trigger `router.get('/audit-logs', buildQueryParams(...))` so server-side filtering and pagination work. |

### 5.2 Remaining Gaps / Recommendations

| Item | Severity | Description |
|------|----------|-------------|
| **BeneficiaryController@show** | Low | Method is empty (no implementation). Either implement (e.g. return Inertia view for single beneficiary) or remove route if not used. |
| **Bank account authorization** | Medium | Index is now scoped by user; show/edit/destroy/suspend/activate do not call `$this->authorize()`. Policy exists; recommend adding `authorize` in controller (or equivalent middleware) so users cannot access other users’ accounts by ID. |
| **Journal entries ↔ bank account** | Medium | DB has `bank_account_id` and `direction`; observer updates balance. Create-journal form and `StoreJournalEntryRequest` do not include bank account or direction; `JournalEntryResource` does not expose them. Recommend: add bank account selector and debit/credit to form, add validation and resource fields, and pass through `JournalEntryService::create`. |
| **Audit log export / stats** | Low | Frontend does not call `/audit-logs/export` or `/audit-logs/stats`. If product needs export or stats, add routes and UI (e.g. Export button, Stats section). |
| **Transfer list transferNumber** | Low | Frontend `transfers.tsx` type and list do not show `transferNumber`; backend sends it via `TransferResource`. Consider adding a column for transfer number in the transfers table UI. |
| **Resource filter (audit-logs)** | Low | Backend `applyFilters` does not filter by `resource`; frontend sends `resource` in filters and filters in memory. For consistency and performance, consider adding server-side `resource` filter (e.g. by auditable_type) and sending `resource` in query params. |

### 5.3 Frontend ↔ Backend Query Param Mapping (Audit Logs)

| Frontend (AuditLogFilters) | Backend (AuditLogController@index) |
|----------------------------|-------------------------------------|
| search | search |
| action | action |
| resource | (not applied on server; client-side only) |
| severity | severity |
| dateRange | date_range |
| startDate (when dateRange === 'custom') | start_date |
| endDate (when dateRange === 'custom') | end_date |
| (not in filters UI) | user_id |

---

## 6. Summary

- **Endpoints:** All web and settings routes are inventoried; audit log export/stats/show/timeline exist in code but have no routes.
- **Models:** Documented with main attributes and relations; `audit_logs` extended with `description` and `severity`.
- **Resources:** Transfer and BankAccount resources aligned with frontend; JournalEntry resource (and create flow) missing bank account and direction.
- **Critical fix:** Bank accounts index scoped by current user.
- **Audit logs:** Schema and filter/query param alignment fixed; optional: add routes for export/stats and server-side resource filter.

Use this document as the single reference for API surface, data shapes, and known mismatches when adding features or fixing bugs.
