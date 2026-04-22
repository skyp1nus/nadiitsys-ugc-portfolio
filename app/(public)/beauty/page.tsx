import { getByCategory } from "@/lib/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Beauty — nadiitsys" };

export default function BeautyPage() {
  const videos = getByCategory("beauty");
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Beauty</h1>
      {videos.length === 0 ? (
        <p className="text-gray-400">No videos yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </main>
  );
}
