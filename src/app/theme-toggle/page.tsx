import ThemeToggle from "./ThemeToggle";

export default function Page() {
  return (
    <div style={{ padding: "24px" }}>
      <h1>Theme Toggle Demo</h1>
      <ThemeToggle />
      <p>This text will adapt to dark/light mode.</p>
    </div>
  );
}