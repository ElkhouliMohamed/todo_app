import React from 'react';
import { Badge } from '@/Components/ui/Badge';
import { getStatusColor } from '@/lib/dateUtils';

export default function StatusBadge({ status }) {
    const labels = {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
    };

    const variants = {
        pending: 'secondary',
        in_progress: 'default',
        completed: 'success',
        cancelled: 'destructive',
    };

    return (
        <Badge variant={variants[status]} className={getStatusColor(status)}>
            {labels[status]}
        </Badge>
    );
}
