export type AnalyticsMetric = {
    label: string;
    value: string;
    helper: string;
    delta?: string;
};

export type AnalyticsSeriesPoint = {
    label: string;
    value: number;
};

export type AnalyticsBreakdownItem = {
    label: string;
    value: string;
    tone: 'sky' | 'emerald' | 'amber' | 'slate';
};

export type AnalyticsInsight = {
    title: string;
    description: string;
};
