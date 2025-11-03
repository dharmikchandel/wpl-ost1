import React from 'react';
import TeamMemberCard from './TeamMemberCard';

// Example parent that renders multiple TeamMemberCard components.
// This stays minimal: simple spacing, clean alignment.
export default function Team() {
  const containerStyle = {
    maxWidth: '760px',
    margin: '24px auto',
    padding: '0 16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '14px'
  };

  // Example data; replace with real data source as needed
  const members = [
    {
      id: 1,
      name: 'Ava Thompson',
      title: 'Product Manager',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Diego Rivera',
      title: 'Senior Developer',
      photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=320&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Mia Patel',
      title: 'UX Designer',
      photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=320&auto=format&fit=crop'
    }
  ];

  return (
    <div style={containerStyle}>
      {members.map((m) => (
        <TeamMemberCard
          key={m.id}
          photoUrl={m.photoUrl}
          name={m.name}
          title={m.title}
        />
      ))}
    </div>
  );
}


