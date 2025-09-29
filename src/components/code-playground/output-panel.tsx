import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OutputPanelProps {
  output: string;
}

export default function OutputPanel({ output }: OutputPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Output</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black text-green-400 font-mono p-4 rounded-md h-[200px] overflow-auto whitespace-pre-wrap">
          {output || '// Code execution output will appear here'}
        </div>
      </CardContent>
    </Card>
  );
}
