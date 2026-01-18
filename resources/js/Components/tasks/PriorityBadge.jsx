import React from 'react';
import { Badge } from '@/Components/ui/Badge';
import { getPriorityColor } from '@/lib/dateUtils';

export default function PriorityBadge({ priority }) {
    const labels = {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent',
    };

    const icons = {
        low: '↓',
        medium: '→',
        high: '↑',
        urgent: '⚠',
    };

    return (
        <Badge className={getPriorityColor(priority)}>
            <span className="mr-1">{icons[priority]}</span>
            {labels[priority]}
        </Badge>
    );
}
