import React from 'react';

// Reusable card to display a team member's photo, name, and job title.
// - Keep props clear and minimal for reusability
// - Inline styles for simplicity and easy portability (no external libs)
export default function TeamMemberCard({ photoUrl, name, title }) {
  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    background: '#ffffff',
    border: '1px solid #e6e6e6',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
  };

  const avatarStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
    flex: '0 0 56px',
    backgroundColor: '#f2f2f2'
  };

  const textContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0
  };

  const nameStyle = {
    margin: 0,
    fontSize: '16px',
    lineHeight: 1.35,
    color: '#222222',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const titleStyle = {
    margin: '2px 0 0 0',
    fontSize: '13px',
    lineHeight: 1.4,
    color: '#6b7280' // neutral gray for secondary text
  };

  return (
    <div style={cardStyle}>
      {/* Photo */}
      <img
        src={photoUrl}
        alt={name}
        style={avatarStyle}
      />

      {/* Text block */}
      <div style={textContainerStyle}>
        <h3 style={nameStyle}>{name}</h3>
        <p style={titleStyle}>{title}</p>
      </div>
    </div>
  );
}


