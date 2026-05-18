export interface StatusConfig {
    label: string;
    icon: string;
    color: string;
}

// 任务状态 (List页使用)
export const TASK_STATUS: { [key: number]: StatusConfig }  = {
    0: { label: '未运行', icon: 'bi-dash-circle', color: 'text-secondary' },
    1: { label: '运行中', icon: 'bi-play-circle-fill', color: 'text-primary' },
    2: { label: '全成功', icon: 'bi-check-circle-fill', color: 'text-success' },
    3: { label: '有失败', icon: 'bi-exclamation-circle-fill', color: 'text-warning' },
    4: { label: '启动失败', icon: 'bi-x-circle-fill', color: 'text-danger' }
};

// 用例状态 (Detail页使用)
export const CASE_STATUS: Record<number, any> = {
    0: { label: 'not started', color: 'bg-secondary' },
    1: { label: 'start', color: 'bg-primary' },
    2: { label: 'task error', color: 'bg-danger' },
    3: { label: 'success', color: 'bg-success' },
    4: { label: 'skip', color: 'bg-info' },
    5: { label: 'fail', color: 'bg-danger' },
    6: { label: 'nofingeprint ok', color: 'bg-success' },
    7: { label: 'unknown ok', color: 'bg-success' },
    8: { label: 'unhandle', color: 'bg-warning' }
};
