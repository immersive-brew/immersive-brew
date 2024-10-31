import WaterQualityTracker from '@/components/WaterQualityTracker';

export default function WaterQualityTrackerPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Water Quality Tracker</h1>
      <p className="mb-6">
        Upload an image of your water sample to analyze the contents. Ensure you're signed in to upload your data.
      </p>
      <WaterQualityTracker />
    </div>
  );
}
