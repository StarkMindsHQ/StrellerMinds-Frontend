import { NextResponse } from 'next/server';

interface TwoFactorState {
  enabled: boolean;
  secret?: string;
  backupCodes: string[];
}

let twoFactorState: TwoFactorState = {
  enabled: false,
  secret: undefined,
  backupCodes: [],
};

const generateBackupCodes = () =>
  Array.from({ length: 6 }).map(
    () => Math.random().toString(36).slice(2, 10).toUpperCase(),
  );

const validateCode = (code: string) => /^[0-9]{6}$/.test(code);

export async function GET() {
  return NextResponse.json({
    enabled: twoFactorState.enabled,
    backupCodes: twoFactorState.enabled ? twoFactorState.backupCodes : [],
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action !== 'setup') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const secret = 'JBSWY3DPEHPK3PXP';
  const backupCodes = generateBackupCodes();

  twoFactorState = {
    ...twoFactorState,
    enabled: false,
    secret,
    backupCodes,
  };

  return NextResponse.json({ secret, backupCodes });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { code, secret } = body as { code?: string; secret?: string };

  if (!secret || !code || !validateCode(code)) {
    return NextResponse.json(
      { error: 'Please provide a valid 6-digit authentication code.' },
      { status: 400 },
    );
  }

  if (secret !== twoFactorState.secret) {
    return NextResponse.json({ error: 'Secret key mismatch' }, { status: 400 });
  }

  twoFactorState = {
    enabled: true,
    secret: twoFactorState.secret,
    backupCodes: twoFactorState.backupCodes,
  };

  return NextResponse.json({ backupCodes: twoFactorState.backupCodes });
}

export async function DELETE() {
  twoFactorState = {
    enabled: false,
    secret: undefined,
    backupCodes: [],
  };

  return NextResponse.json({ enabled: false });
}
