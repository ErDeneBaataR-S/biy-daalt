export type InitiativeStatus = 'on-track' | 'at-risk' | 'planned' | 'completed';

export type ReleaseStatus = 'planned' | 'in-review' | 'shipped';

export type Initiative = {
    id: string;
    title: string;
    owner: string;
    status: InitiativeStatus;
    completed: boolean;
};

export type Release = {
    id: string;
    name: string;
    version: string;
    targetDate: string;
    status: ReleaseStatus;
    summary: string;
};

export type InitiativeDraft = Omit<Initiative, 'id'>;

export type ReleaseDraft = Omit<Release, 'id'>;
