import ThemeToggle from './ThemeToggle';

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Theme Toggle Demo</h1>
      <ThemeToggle />
      <p className="mt-4">
        This text will adapt to dark/light mode automatically.
      </p>
    </div>
  );
}
