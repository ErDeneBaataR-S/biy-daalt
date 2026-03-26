import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_10px_30px_-12px_rgba(37,99,235,0.9)]">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-[0.95rem] font-semibold text-slate-900 dark:text-slate-100">
                    Product Management
                </span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    System
                </span>
            </div>
        </>
    );
}
