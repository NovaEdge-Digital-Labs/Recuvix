import React from 'react';
import SchemaType from './SchemaType';
import { ParamDef } from '@/lib/api-reference/endpoints';

interface ResponseSchemaProps {
    fields: ParamDef[];
}

const ResponseSchema: React.FC<ResponseSchemaProps> = ({ fields }) => {
    return (
        <div className="my-6 border border-[#111] rounded-lg overflow-hidden bg-[#0d0d0d]">
            <div className="grid grid-cols-3 px-4 py-2 border-b border-[#111] bg-[#0a0a0a]">
                <span className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-wider">Field</span>
                <span className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-wider">Type</span>
                <span className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-wider">Description</span>
            </div>
            <div className="divide-y divide-[#111]">
                {fields.map((field) => (
                    <div key={field.name} className="grid grid-cols-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                        <span className="text-sm font-mono text-[#e8ff47]">{field.name}</span>
                        <div className="flex items-center">
                            <SchemaType type={field.type} />
                        </div>
                        <span className="text-sm text-[#999] leading-relaxed">{field.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResponseSchema;
