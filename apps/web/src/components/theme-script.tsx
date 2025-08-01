export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('url-shortener-theme') || 'system';
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = theme === 'dark' || (theme === 'system' && systemDark);
        
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
      } catch (e) {
        // Fallback to dark mode if there's an error
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}