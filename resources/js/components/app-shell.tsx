import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppContent } from '@/components/app-content';

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