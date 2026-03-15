import { Transition } from '@headlessui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, Server, ShieldCheck, X } from 'lucide-react';
import { useId, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

type SmtpProps = {
  enabled: boolean;
  host?: string | null;
  port?: number | null;
  username?: string | null;
  encryption?: string | null;
  from_address?: string | null;
  from_name?: string | null;
  has_password?: boolean;
};

type PageProps = {
  smtp: SmtpProps;
  flash?: { success?: string; error?: string };
  errors?: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Settings', href: edit().url },
  { title: 'SMTP Email', href: '/settings/smtp' },
];

export default function SmtpSettings() {
  const uid = useId();
  const { smtp, flash, errors } = usePage().props as unknown as PageProps;

  const [enabled, setEnabled] = useState<boolean>(Boolean(smtp.enabled));
  const [host, setHost] = useState<string>(smtp.host ?? '');
  const [port, setPort] = useState<string>(smtp.port ? String(smtp.port) : '');
  const [username, setUsername] = useState<string>(smtp.username ?? '');
  const [password, setPassword] = useState<string>('');
  const [encryption, setEncryption] = useState<string>(smtp.encryption ?? '');
  const [fromAddress, setFromAddress] = useState<string>(smtp.from_address ?? '');
  const [fromName, setFromName] = useState<string>(smtp.from_name ?? '');
  const [processing, setProcessing] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  function submit() {
    setProcessing(true);
    setRecentlySuccessful(false);

    router.put(
      '/settings/smtp',
      {
        enabled,
        host: host || null,
        port: port ? Number(port) : null,
        username: username || null,
        password: password || null,
        encryption: encryption || null,
        from_address: fromAddress || null,
        from_name: fromName || null,
      },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
        onSuccess: () => {
          setPassword('');
          setRecentlySuccessful(true);
          window.setTimeout(() => setRecentlySuccessful(false), 1500);
        },
      },
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="SMTP Email" />

      <h1 className="sr-only">SMTP Email</h1>

      <SettingsLayout>
        <div className="space-y-6">
          <Heading
            variant="small"
            title="SMTP Email"
            description="Configure SMTP server and sender identity"
          />

          {flash?.success && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span className="font-medium">{flash.success}</span>
            </div>
          )}

          {flash?.error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span className="font-medium">{flash.error}</span>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Enable SMTP override</p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, the app uses these settings for outgoing email.
                  </p>
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Server className="size-4 text-muted-foreground" aria-hidden="true" />
              Server
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${uid}-host`}>Host</Label>
              <Input id={`${uid}-host`} value={host} onChange={(e) => setHost(e.target.value)} placeholder="smtp.example.com" />
              <InputError className="mt-2" message={errors?.host} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${uid}-port`}>Port</Label>
              <Input id={`${uid}-port`} inputMode="numeric" value={port} onChange={(e) => setPort(e.target.value)} placeholder="587" />
              <InputError className="mt-2" message={errors?.port} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${uid}-username`}>Username</Label>
              <Input id={`${uid}-username`} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="user@example.com" />
              <InputError className="mt-2" message={errors?.username} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${uid}-password`}>Password</Label>
              <Input id={`${uid}-password`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={smtp.has_password ? '•••••••• (leave blank to keep)' : 'Enter password'} />
              <InputError className="mt-2" message={errors?.password} />
            </div>

            <div className="grid gap-2">
              <Label>Encryption</Label>
              <Select value={encryption || ''} onValueChange={(v) => setEncryption(v === 'none' ? '' : v)}>
                <SelectTrigger className="h-10 bg-background/60">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                </SelectContent>
              </Select>
              <InputError className="mt-2" message={errors?.encryption} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
              Sender
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${uid}-from-address`}>From address</Label>
              <Input id={`${uid}-from-address`} type="email" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} placeholder="no-reply@example.com" />
              <InputError className="mt-2" message={errors?.from_address} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${uid}-from-name`}>From name</Label>
              <Input id={`${uid}-from-name`} value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Thouraya Albilad" />
              <InputError className="mt-2" message={errors?.from_name} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button disabled={processing} onClick={submit} data-test="update-smtp-button">
              Save
            </Button>

            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out"
              enterFrom="opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-neutral-600">Saved</p>
            </Transition>
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}

