import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
    function toggleTheme() {
        const current =
            document.documentElement.attributes.getNamedItem(
                'data-theme',
            )?.value
        const next = current === 'light' ? 'dark' : 'light'

        document.dispatchEvent(new CustomEvent('set-theme', { detail: next }))
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
