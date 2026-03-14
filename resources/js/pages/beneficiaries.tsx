import { Head, router } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { BeneficiariesEmptyState } from '@/components/Beneficiaries/BeneficiariesEmptyState';
import { BeneficiariesHeader } from '@/components/Beneficiaries/BeneficiariesHeader';
import { BeneficiariesStats } from '@/components/Beneficiaries/BeneficiariesStats';
import { BeneficiaryCard } from '@/components/Beneficiaries/BeneficiaryCard';
import type { Beneficiary, BeneficiaryFilters } from '@/components/Beneficiaries/types';
import { useLanguage } from '@/components/language-provider';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const COPY_FEEDBACK_MS = 2000;

const INITIAL_FILTERS: BeneficiaryFilters = {
  search: '',
  category: 'all',
  country: 'all',
  accountType: 'all',
};

export default function Beneficiaries({ beneficiaries }: { beneficiaries: Beneficiary[] }) {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('beneficiaries.title', 'المستفيدين'), href: '/beneficiaries' },
  ];

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<BeneficiaryFilters>(INITIAL_FILTERS);

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((b) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          b.nameEn.toLowerCase().includes(q) ||
          b.nameAr.includes(filters.search) ||
          b.bankName.toLowerCase().includes(q) ||
          b.accountNumber.includes(q);
        if (!matches) return false;
      }
      if (filters.category !== 'all' && b.category !== filters.category) return false;
      if (filters.country !== 'all' && b.country !== filters.country) return false;
      if (filters.accountType !== 'all' && b.accountType !== filters.accountType) return false;
      return true;
    });
  }, [beneficiaries, filters]);

  function handleFiltersChange(partial: Partial<BeneficiaryFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  function handleDelete(id: string) {
    if (confirm(t('Are you sure you want to delete this beneficiary?', 'هل أنت متأكد من حذف هذا المستفيد؟'))) {
      router.delete(`/beneficiaries/${id}`);
    }
  }

  function handleEdit(beneficiary: Beneficiary) {
    // router.visit(`/beneficiaries/${beneficiary.id}/edit`);
    console.log('Edit beneficiary', beneficiary.id);
  }

  function handleCopy(text: string, id: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), COPY_FEEDBACK_MS);
    }
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.country !== 'all' ||
    filters.accountType !== 'all';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('beneficiaries.title', 'المستفيدين')} /> 

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <BeneficiariesHeader
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          resultCount={filteredBeneficiaries.length}
          isRtl={isRtl}
          t={t}
        />

        <div className="flex flex-1 flex-col gap-6 p-6">
          {beneficiaries.length > 0 && (
            <BeneficiariesStats beneficiaries={beneficiaries} t={t} isRtl={isRtl} />
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredBeneficiaries.map((beneficiary, index) => (
                <BeneficiaryCard
                  key={beneficiary.id}
                  beneficiary={beneficiary}
                  index={index}
                  isCopied={copiedId === `iban-${beneficiary.id}`}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onCopy={handleCopy}
                  t={t}
                  isRtl={isRtl}
                />
              ))}
            </AnimatePresence>

            {filteredBeneficiaries.length === 0 && (
              <BeneficiariesEmptyState
                isRtl={isRtl}
                t={t}
                hasSearch={hasActiveFilters}
                searchQuery={filters.search}
                onClearSearch={hasActiveFilters ? handleClearFilters : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
