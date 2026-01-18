import { format, formatDistance, formatRelative, isToday, isTomorrow, isPast, isFuture, parseISO } from 'date-fns';

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
}

/**
 * Format date and time for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date) {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Get friendly date (e.g., "Today", "Tomorrow", "Yesterday", or formatted date)
 * @param {string|Date} date - Date to format
 * @returns {string} Friendly date string
 */
export function getFriendlyDate(date) {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dateObj)) return 'Today';
    if (isTomorrow(dateObj)) return 'Tomorrow';

    return formatRelative(dateObj, new Date());
}

/**
 * Check if date is overdue
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isOverdue(date) {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isPast(dateObj) && !isToday(dateObj);
}

/**
 * Check if date is upcoming
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export function isUpcoming(date) {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isFuture(dateObj);
}

/**
 * Get priority color
 * @param {string} priority - Priority level (low, medium, high, urgent)
 * @returns {string} Tailwind color class
 */
export function getPriorityColor(priority) {
    const colors = {
        low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
        high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
        urgent: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    };
    return colors[priority] || colors.medium;
}

/**
 * Get status color
 * @param {string} status - Task status
 * @returns {string} Tailwind color class
 */
export function getStatusColor(status) {
    const colors = {
        pending: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
        in_progress: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        completed: 'text-green-600 bg-green-50 dark:bg-green-900/20',
        cancelled: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    };
    return colors[status] || colors.pending;
}
