"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, RefreshCcw, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export type TwoFactorStatus = {
  enabled: boolean;
  backupCodes: string[];
};

export function TwoFactorAuth() {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [pendingSecret, setPendingSecret] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/2fa');
      if (!response.ok) {
        throw new Error('Failed to load two-factor status');
      }
      const data: TwoFactorStatus = await response.json();
      setStatus(data);
      setBackupCodes(data.backupCodes ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadStatus();
  }, [isAuthenticated]);

  const handleStartSetup = async () => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup' }),
      });

      if (!response.ok) {
        throw new Error('Unable to start 2FA setup');
      }

      const data = await response.json();
      setPendingSecret(data.secret);
      setBackupCodes(data.backupCodes ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!pendingSecret) return;
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/2fa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode, secret: pendingSecret }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Verification failed');
      }

      const data = await response.json();
      setStatus({ enabled: true, backupCodes: data.backupCodes ?? [] });
      setBackupCodes(data.backupCodes ?? []);
      setPendingSecret(null);
      setVerificationCode('');
      setSuccess('Two-factor authentication is now enabled. Store your backup codes safely.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable = async () => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/2fa', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unable to disable two-factor authentication');
      }

      setStatus({ enabled: false, backupCodes: [] });
      setBackupCodes([]);
      setPendingSecret(null);
      setSuccess('Two-factor authentication has been disabled.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetSetup = () => {
    setPendingSecret(null);
    setVerificationCode('');
    setError(null);
    setSuccess(null);
  };

  const displayBackupCodes = useMemo(() => backupCodes.length > 0, [backupCodes]);

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sign in to configure two-factor authentication for your account.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-700">
              <ShieldCheck className="h-5 w-5 text-slate-600" />
              <div>
                <p className="font-semibold text-slate-900">Secure your account with 2FA</p>
                <p className="text-sm text-slate-600">
                  Use an authenticator app and backup codes to add an extra layer of security.
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading two-factor status...</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">Status</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {status?.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">Backup codes</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {displayBackupCodes ? backupCodes.length : 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card>
          <CardContent>
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {success ? (
        <Card>
          <CardContent>
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {success}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {pendingSecret ? (
        <Card>
          <CardHeader>
            <CardTitle>Complete 2FA setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Secret key</p>
                <p className="font-mono mt-2 rounded-lg bg-white p-3 text-sm text-slate-900 shadow-sm">
                  {pendingSecret}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Scan this code with your authenticator app or enter it manually.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification code</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  placeholder="Enter 6-digit code"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="primary"
                  onClick={handleVerify}
                  disabled={actionLoading || verificationCode.length !== 6}
                >
                  Verify code
                </Button>
                <Button variant="ghost" onClick={handleResetSetup} disabled={actionLoading}>
                  Cancel setup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{status?.enabled ? 'Manage 2FA' : 'Set up 2FA'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                {status?.enabled
                  ? 'Your account is protected by two-factor authentication. Keep your backup codes safe.'
                  : 'Enable two-factor authentication to require a second authentication factor at login.'}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">Authenticator app</p>
                  <p className="text-lg font-semibold text-slate-900">Recommended</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[.24em] text-slate-500">Backup codes</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {displayBackupCodes ? 'Available' : 'Not generated'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleStartSetup} disabled={actionLoading}>
                  {status?.enabled ? 'Regenerate 2FA setup' : 'Enable 2FA'}
                </Button>
                {status?.enabled ? (
                  <Button variant="destructive" onClick={handleDisable} disabled={actionLoading}>
                    Disable 2FA
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {displayBackupCodes && !pendingSecret ? (
        <Card>
          <CardHeader>
            <CardTitle>Backup codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {backupCodes.map((code) => (
                  <div
                    key={code}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900"
                  >
                    {code}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Use each backup code once if your authenticator app is unavailable.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
