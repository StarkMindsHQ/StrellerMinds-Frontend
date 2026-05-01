import { NextResponse } from 'next/server';

const themes = [
  {
    name: 'default',
    variables: {},
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    monoFontFamily:
      "'Source Code Pro', ui-monospace, SFMono-Regular, monospace",
  },
  {
    name: 'sunset',
    variables: {
      '--primary': '18 93% 58%',
      '--secondary': '336 74% 33%',
      '--ring': '18 93% 58%',
      '--background': '24 100% 98%',
      '--foreground': '320 36% 12%',
    },
    fontFamily: "'Poppins', Inter, system-ui, sans-serif",
  },
  {
    name: 'ocean',
    variables: {
      '--primary': '197 92% 47%',
      '--secondary': '221 53% 24%',
      '--ring': '197 92% 47%',
      '--background': '210 50% 98%',
      '--foreground': '217 54% 13%',
    },
    fontFamily: "'Manrope', Inter, system-ui, sans-serif",
  },
];

export async function GET() {
  return NextResponse.json({ themes });
}
