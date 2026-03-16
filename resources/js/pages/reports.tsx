import { Head, router, usePage } from '@inertiajs/react';
import { BarChart3, FileText, Landmark, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type BankAccount = { id: string; bankName?: string; accountNumber?: string; currency?: string };

type PageProps = {
    bankAccounts?: BankAccount[];
    statementData?: {
        rows?: StatementRow[];
        openingBalance?: number;
        closingBalance?: number;
        account?: BankAccount;
    } | null;
    beneficiaryData?: Array<{ beneficiaryId: number; nameEn?: string; nameAr?: string; bankName?: string; totalAmount: number; transferCount: number }>;
    summaryData?: {
        byCurrency?: Array<{ currency: string; total: number; count: number }>;
        byBeneficiary?: Array<{ name: string; total: number }>;
        byBank?: Array<{ bankName: string; total: number }>;
    } | null;
};

type TabId = 'bank-statement' | 'beneficiary' | 'summary';

type StatementRow = {
    date: string | null;
    description: string;
    debit: number | null;
    credit: number | null;
    balance: number;
};

export default function Reports({ bankAccounts = [] }: PageProps) {
    const { t } = useLanguage();
    const pageProps = usePage().props as unknown as PageProps;
    const accounts = pageProps.bankAccounts ?? bankAccounts;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Reports', 'التقارير'), href: '/reports' },
    ];

    const [activeTab, setActiveTab] = useState<TabId>('bank-statement');
    const [bankAccountId, setBankAccountId] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().slice(0, 10);
    });
    const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [statementData, setStatementData] = useState<{
        rows?: StatementRow[];
        openingBalance?: number;
        closingBalance?: number;
        account?: BankAccount;
    } | null>(null);
    const [beneficiaryData, setBeneficiaryData] = useState<Array<{ beneficiaryId: number; nameEn?: string; nameAr?: string; bankName?: string; totalAmount: number; transferCount: number }>>([]);
    const [summaryData, setSummaryData] = useState<{
        byCurrency?: Array<{ currency: string; total: number; count: number }>;
        byBeneficiary?: Array<{ name: string; total: number }>;
        byBank?: Array<{ bankName: string; total: number }>;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchBankStatement = useCallback(() => {
        if (!bankAccountId || !startDate || !endDate) return;
        router.get(
            '/reports/bank-statement',
            { bank_account_id: bankAccountId, start_date: startDate, end_date: endDate },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['statementData'],
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    }, [bankAccountId, startDate, endDate]);

    const fetchBeneficiaryStatement = useCallback(() => {
        router.get(
            '/reports/beneficiary-statement',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['beneficiaryData'],
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    }, []);

    const fetchSummary = useCallback(() => {
        router.get(
            '/reports/summary',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['summaryData'],
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    }, []);

    useEffect(() => {
        if (pageProps.statementData !== undefined) {
            setStatementData(pageProps.statementData ?? null);
        }
    }, [pageProps.statementData]);

    useEffect(() => {
        if (pageProps.beneficiaryData !== undefined) {
            setBeneficiaryData(pageProps.beneficiaryData ?? []);
        }
    }, [pageProps.beneficiaryData]);

    useEffect(() => {
        if (pageProps.summaryData !== undefined) {
            setSummaryData(pageProps.summaryData ?? null);
        }
    }, [pageProps.summaryData]);

    useEffect(() => {
        if (activeTab === 'bank-statement' && bankAccountId) fetchBankStatement();
    }, [activeTab, bankAccountId, startDate, endDate]);
    useEffect(() => {
        if (activeTab === 'beneficiary') fetchBeneficiaryStatement();
    }, [activeTab]);
    useEffect(() => {
        if (activeTab === 'summary') fetchSummary();
    }, [activeTab]);

    const tabs = [
        { id: 'bank-statement' as const, label: t('Bank account statement', 'كشف حساب بنكي'), icon: FileText },
        { id: 'beneficiary' as const, label: t('Beneficiary statement', 'كشف المستفيدين'), icon: Users },
        { id: 'summary' as const, label: t('Summary report', 'التقرير الملخص'), icon: BarChart3 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Reports', 'التقارير')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight">{t('Reports', 'التقارير')}</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {t('Financial reports and account statements', 'التقارير المالية وكشوف الحساب')}
                    </p>
                </header>

                <div className="flex flex-wrap gap-2 border-b">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors -mb-px',
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'bank-statement' && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('Account', 'الحساب')}</label>
                                <Select value={bankAccountId} onValueChange={setBankAccountId}>
                                    <SelectTrigger className="w-64">
                                        <SelectValue placeholder={t('Select account', 'اختر الحساب')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((a) => (
                                            <SelectItem key={a.id} value={String(a.id)}>
                                                {a.bankName ?? ''} {a.accountNumber ? `· ${a.accountNumber}` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('From', 'من')}</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-10 rounded-md border bg-background px-3"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('To', 'إلى')}</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="h-10 rounded-md border bg-background px-3"
                                />
                            </div>
                            <Button onClick={fetchBankStatement} disabled={loading || !bankAccountId}>
                                {loading ? t('Loading...', 'جاري التحميل...') : t('Generate', 'إنشاء')}
                            </Button>
                        </div>
                        {statementData?.rows && (
                            <div className="rounded-xl border overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left p-3 font-medium">{t('Date', 'التاريخ')}</th>
                                            <th className="text-left p-3 font-medium">{t('Description', 'الوصف')}</th>
                                            <th className="text-right p-3 font-medium">{t('Debit', 'مدين')}</th>
                                            <th className="text-right p-3 font-medium">{t('Credit', 'دائن')}</th>
                                            <th className="text-right p-3 font-medium">{t('Balance', 'الرصيد')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statementData.rows.map((row, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-3">{row.date ?? '—'}</td>
                                                <td className="p-3">{row.description}</td>
                                                <td className="p-3 text-right tabular-nums">{row.debit != null ? row.debit.toFixed(2) : '—'}</td>
                                                <td className="p-3 text-right tabular-nums">{row.credit != null ? row.credit.toFixed(2) : '—'}</td>
                                                <td className="p-3 text-right tabular-nums font-medium">{row.balance.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="border-t bg-muted/30 px-3 py-2 text-right text-sm font-semibold">
                                    {t('Closing balance', 'الرصيد الختامي')}: {statementData.closingBalance?.toFixed(2) ?? '—'}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'beneficiary' && (
                    <div className="rounded-xl border overflow-hidden">
                        {loading ? (
                            <p className="p-6 text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</p>
                        ) : beneficiaryData.length === 0 ? (
                            <p className="p-6 text-muted-foreground">{t('No data.', 'لا توجد بيانات.')}</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-3 font-medium">{t('Beneficiary', 'المستفيد')}</th>
                                        <th className="text-left p-3 font-medium">{t('Bank', 'البنك')}</th>
                                        <th className="text-right p-3 font-medium">{t('Transfers', 'التحويلات')}</th>
                                        <th className="text-right p-3 font-medium">{t('Total amount', 'المبلغ الإجمالي')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {beneficiaryData.map((row) => (
                                        <tr key={row.beneficiaryId} className="border-t">
                                            <td className="p-3">{row.nameEn ?? row.nameAr ?? '—'}</td>
                                            <td className="p-3">{row.bankName ?? '—'}</td>
                                            <td className="p-3 text-right tabular-nums">{row.transferCount}</td>
                                            <td className="p-3 text-right tabular-nums font-medium">{Number(row.totalAmount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'summary' && (
                    <div className="grid gap-6 md:grid-cols-3">
                        {loading ? (
                            <p className="text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</p>
                        ) : (
                            <>
                                {summaryData?.byCurrency && summaryData.byCurrency.length > 0 && (
                                    <div className="rounded-xl border p-5">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <BarChart3 className="size-4" />
                                            {t('By currency', 'حسب العملة')}
                                        </h3>
                                        <ul className="mt-3 space-y-2">
                                            {summaryData.byCurrency.map((r) => (
                                                <li key={r.currency} className="flex justify-between text-sm">
                                                    <span>{r.currency}</span>
                                                    <span className="font-medium tabular-nums">{Number(r.total).toFixed(2)} ({r.count})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {summaryData?.byBeneficiary && summaryData.byBeneficiary.length > 0 && (
                                    <div className="rounded-xl border p-5">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Users className="size-4" />
                                            {t('By beneficiary', 'حسب المستفيد')}
                                        </h3>
                                        <ul className="mt-3 space-y-2">
                                            {summaryData.byBeneficiary.map((r, i) => (
                                                <li key={i} className="flex justify-between text-sm">
                                                    <span className="truncate max-w-[120px]">{r.name}</span>
                                                    <span className="font-medium tabular-nums shrink-0">{Number(r.total).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {summaryData?.byBank && summaryData.byBank.length > 0 && (
                                    <div className="rounded-xl border p-5">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Landmark className="size-4" />
                                            {t('By bank', 'حسب البنك')}
                                        </h3>
                                        <ul className="mt-3 space-y-2">
                                            {summaryData.byBank.map((r, i) => (
                                                <li key={i} className="flex justify-between text-sm">
                                                    <span className="truncate max-w-[120px]">{r.bankName}</span>
                                                    <span className="font-medium tabular-nums shrink-0">{Number(r.total).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {summaryData && !summaryData.byCurrency?.length && !summaryData.byBeneficiary?.length && !summaryData.byBank?.length && (
                                    <p className="text-muted-foreground col-span-full">{t('No data.', 'لا توجد بيانات.')}</p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
