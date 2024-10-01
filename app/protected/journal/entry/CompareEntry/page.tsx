import CompareEntry from '@/components/CompareEntryView'; // Assuming you have a CompareEntryView component
import HeaderBar from '@/components/HeaderBar'; // Import the HeaderBar

export default function CompareEntriesPage() {
  // Mock data for the two entries to compare (you can replace this with actual data fetching logic)
  const entry1 = {
    id: 1,
    title: 'Entry 1',
    content: 'This is the content of the first entry.',
  };

  const entry2 = {
    id: 2,
    title: 'Entry 2',
    content: 'This is the content of the second entry.',
  };

  return (
    <div>
      {/* Add HeaderBar at the top */}
      <HeaderBar />

      {/* Comparison section */}
      <div className="comparison-section">
        <h2>Compare Entries</h2>

        {/* Render the CompareEntry component to compare two entries */}
        <CompareEntry entry1={entry1} entry2={entry2} />
      </div>
    </div>
  );
}
