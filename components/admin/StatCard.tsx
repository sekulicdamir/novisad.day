import React from 'react';

interface StatCardProps {
    // FIX: Replaced JSX.Element with React.ReactElement to fix 'Cannot find namespace JSX' error.
    icon: React.ReactElement;
    title: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
                {/* FIX: Added type assertion to `icon` to solve React.cloneElement typing issue where className is not a recognized prop. */}
                {React.cloneElement(icon as React.ReactElement<any>, { className: "w-8 h-8 text-white" })}
            </div>
            <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
                <p className="text-2xl font-bold text-dark">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
