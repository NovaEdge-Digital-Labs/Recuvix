import React from 'react';

interface SchemaTypeProps {
    type: string;
}

const SchemaType: React.FC<SchemaTypeProps> = ({ type }) => {
    return (
        <span className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[11px] font-mono text-[#999] border border-[#222]">
            {type}
        </span>
    );
};

export default SchemaType;
