import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const DropdownMenu = Menu;

const DropdownMenuTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => (
    <Menu.Button
        ref={ref}
        className={cn("inline-flex justify-center w-full rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75", className)}
        {...props}
    >
        {children}
    </Menu.Button>
));
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = React.forwardRef(({ className, align = 'end', children, ...props }, ref) => (
    <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
    >
        <Menu.Items
            ref={ref}
            className={cn(
                "absolute z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700",
                align === 'end' ? 'right-0' : 'left-0',
                className
            )}
            {...props}
        >
            <div className="py-1">{children}</div>
        </Menu.Items>
    </Transition>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef(({ className, children, ...props }, ref) => (
    <Menu.Item>
        {({ active }) => (
            <button
                ref={ref}
                className={cn(
                    "group flex w-full items-center px-4 py-2 text-sm",
                    active ? "bg-blue-100 text-blue-900 dark:bg-gray-700 dark:text-gray-100" : "text-gray-700 dark:text-gray-300",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )}
    </Menu.Item>
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuLabel = React.forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-4 py-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400", className)}
        {...props}
    >
        {children}
    </div>
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("h-px bg-gray-200 dark:bg-gray-700 my-1", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
};
