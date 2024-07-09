"use client";
// components/DownloadForm.tsx

import { useState } from "react";

export default function DownloadForm() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [files, setFiles] = useState<{ fileName: string; url: string }[]>([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/download", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistUrl }),
    });

    const data = await res.json();
    if (data.downloadLink) {
      setFiles([{ fileName: "Download Link", url: data.downloadLink }]);
      setMessage("Click to download:");
    } else {
      setMessage(data.message || "Error downloading files.");
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="playlistUrl"
            className="block text-sm font-medium text-gray-300"
          >
            YouTube Playlist URL
          </label>
          <input
            type="text"
            id="playlistUrl"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-900 text-gray-300"
            placeholder="Enter YouTube Playlist URL"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download
          </button>
        </div>
      </form>
      {message && (
        <div className="mt-4 text-center text-sm text-gray-300">
          <p>{message}</p>
        </div>
      )}
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div key={index}>
            <button
              className="text-blue-400 hover:underline"
              onClick={() => handleDownload(file.url)}
            >
              {file.fileName}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
