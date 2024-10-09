"use client";
import { useState } from 'react';
import Modal from "./Modal";

// Define the structure of a card
interface CardType {
  title: string;
  content: string;
}

export default function CardList() {
  // Type the state to ensure selectedCard is either a CardType object or null
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  return (
    <div className="card-list-container">
      {selectedCard && (
        <Modal
          title={selectedCard.title}
          content={selectedCard.content}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Render cards */}
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

// Define the props for the Card component
interface CardProps {
  title: string;
  content: string;
  onClick: () => void;
}

function Card({ title, content, onClick }: CardProps) {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      <span className="read-more">Read More</span>
    </div>
  );
}
