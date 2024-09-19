import ManualEntryForm from '@/components/ManualEntryForm';
import HeaderBar from '@/components/HeaderBar'; // Import the HeaderBar

export default function ManualEntryPage() {
  return (
    <div>
      {/* Add HeaderBar at the top */}
      <HeaderBar />

      {/* Main content for manual entry form */}
      <ManualEntryForm />
    </div>
  );
}
