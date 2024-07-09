// app/page.tsx

import DownloadForm from "@/components/DownloadForm";

export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="m-5 flex text-4xl font-extrabold justify-center">
        YouTube Playlist Downloader
      </h1>
      <DownloadForm />
    </div>
  );
}
