import type { ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

type Props = {
    children: ReactNode;
};

export function AppShell({ children }: Props) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <AppContent>
                    {children}
                </AppContent>
            </div>
        </SidebarProvider>
    );
}