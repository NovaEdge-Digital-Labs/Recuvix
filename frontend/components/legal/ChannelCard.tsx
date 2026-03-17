import React from 'react';

interface ChannelCardProps {
    icon: string;
    title: string;
    description: string;
    contact: string;
    badge: string;
    href: string;
}

export function ChannelCard({
    icon,
    title,
    description,
    contact,
    badge,
    href
}: ChannelCardProps) {
    return (
        <a href={href} className="channel-card">
            <div className="channel-icon">{icon}</div>
            <div className="channel-info">
                <h3 className="channel-title">{title}</h3>
                <p className="channel-desc">{description}</p>
                <span className="channel-contact">{contact}</span>
            </div>
            <div className="channel-badge">{badge}</div>
        </a>
    );
}
