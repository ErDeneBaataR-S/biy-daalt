export type BacklogItemKind = 'feature' | 'bug' | 'design' | 'research';

export type BacklogItemStatus =
    | 'done'
    | 'in-progress'
    | 'in-review'
    | 'blocked';

export type BacklogItemPriority = 'low' | 'medium' | 'high' | 'critical';

export type BacklogFilterId = 'all' | 'assigned' | 'priority' | 'sprint';

export type BacklogFilter = {
    id: BacklogFilterId;
    label: string;
};

export type BacklogItem = {
    id: string;
    kind: BacklogItemKind;
    title: string;
    status: BacklogItemStatus;
    priority: BacklogItemPriority;
    owner: string;
    team: string;
    sprintLabel: string;
    estimateLabel: string;
    position: number;
};

export type BacklogItemDraft = Omit<BacklogItem, 'id' | 'position'>;
