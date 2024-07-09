import os
import sys
from pytube import Playlist
from pytube.exceptions import VideoUnavailable
import time
import zipfile

def trim_filename(filename:str, max_length=20):
    filename = filename.replace(' ','_')
    if len(filename) > max_length:
        return filename[:max_length] + '.mp4'
    return filename

def download_videos(playlist_url):
    playlist = Playlist(playlist_url)
    download_folder = os.path.join(os.getcwd(), "public/downloads")  # Base path to downloads folder
    
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    playlist_title = playlist.title  # Get playlist title
    playlist_folder = os.path.join(download_folder, playlist_title)  # Folder path for playlist
    
    if not os.path.exists(playlist_folder):
        os.makedirs(playlist_folder)

    downloaded_files = []

    for video in playlist.videos:
        success = False
        attempts = 0

        while not success and attempts < 5:  # Retry up to 5 times
            try:
                stream = video.streams.filter(res="720p").first()
                if stream:
                    # Use original filename
                    original_filename = stream.default_filename
                    file_path = stream.download(output_path=playlist_folder, filename=original_filename)
                    downloaded_files.append(file_path)
                    
                else:
                    print(f"No 720p stream available for {video.title}")
                success = True
            except VideoUnavailable:
                print(f"Video {video.title} is unavailable.")
                success = True
            except Exception as e:
                attempts += 1
                print(f"Error downloading {video.title}: {str(e)}. Retrying ({attempts}/5)...")
                time.sleep(5)  # Wait for 5 seconds before retrying
    
    return downloaded_files

def zip_downloads(playlist_url):
    files = download_videos(playlist_url)
    playlist_title = Playlist(playlist_url).title
    zip_filename = f"{playlist_title}.zip"
    download_folder = os.path.join(os.getcwd(), "public/downloads")
    playlist_folder = os.path.join(download_folder, playlist_title)

    with zipfile.ZipFile(os.path.join(download_folder, zip_filename), 'w') as zipf:
        for file in files:
            zipf.write(file, arcname=os.path.relpath(file, playlist_folder))

    return os.path.join(download_folder, zip_filename)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python download.py <playlist_url>")
        sys.exit(1)
    playlist_url = sys.argv[1]
    zip_file = zip_downloads(playlist_url)
    print(f"Files zipped successfully: {zip_file}")
