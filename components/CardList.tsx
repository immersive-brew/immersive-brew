// CardList.tsx
"use client"; 
import { useState } from 'react';
import Modal from "./Modal";

export default function CardList() {
  const [selectedCard, setSelectedCard] = useState(null); // track selected card

  return (
    <div className="card-list-container">
      {selectedCard && (
        <Modal
          title={selectedCard.title}
          content={selectedCard.content}
          onClose={() => setSelectedCard(null)}
        />
      )}
      
      {/* Adding more cards */}
      <Card
        title="New member of the web dev team..."
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        onClick={() => setSelectedCard({ title: 'New member of the web dev team...', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' })}
      />
      <Card
        title="New website live!"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt..."
        onClick={() => setSelectedCard({ title: 'New website live!', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt...' })}
      />
      <Card
        title="Company retreat announcement"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        onClick={() => setSelectedCard({ title: 'Company retreat announcement', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' })}
      />
      <Card
        title="New office opened"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        onClick={() => setSelectedCard({ title: 'New office opened', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' })}
      />
      <Card
        title="Upcoming hackathon event"
        content="Our company is hosting a hackathon event this weekend!"
        onClick={() => setSelectedCard({ title: 'Upcoming hackathon event', content: 'Our company is hosting a hackathon event this weekend!' })}
      />
      <Card
        title="Quarterly performance review"
        content="Don't forget to submit your self-evaluations by Friday!"
        onClick={() => setSelectedCard({ title: 'Quarterly performance review', content: 'Don\'t forget to submit your self-evaluations by Friday!' })}
      />
      <Card
        title="Holiday party invitation"
        content="Join us for our annual holiday party at the downtown venue."
        onClick={() => setSelectedCard({ title: 'Holiday party invitation', content: 'Join us for our annual holiday party at the downtown venue.' })}
      />
      <Card
        title="New project launch"
        content="We're excited to announce the launch of our new project."
        onClick={() => setSelectedCard({ title: 'New project launch', content: 'We\'re excited to announce the launch of our new project.' })}
      />
    </div>
  );
}


function Card({ title, content, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      <span className="read-more">Read More</span>
    </div>
  );
}
