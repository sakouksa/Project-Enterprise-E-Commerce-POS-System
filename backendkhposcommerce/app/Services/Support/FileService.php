<?php

namespace App\Services\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService
{
    /**
     * Store an uploaded file to a specified directory and disk.
     */
    public function upload(
        UploadedFile $file,
        string $directory = 'uploads',
        string $disk = 'public',
        ?string $customFilename = null
    ): string {
        $filename = $customFilename ?: (Str::random(40) . '.' . $file->getClientOriginalExtension());
        return $file->storeAs($directory, $filename, $disk);
    }

    /**
     * Delete a file from disk if it exists.
     */
    public function delete(?string $path, string $disk = 'public'): bool
    {
        if (!$path) {
            return false;
        }

        $relativePath = $this->getRelativePath($path, $disk);

        if (Storage::disk($disk)->exists($relativePath)) {
            return Storage::disk($disk)->delete($relativePath);
        }

        return false;
    }

    /**
     * Replace an existing file with a new uploaded file.
     */
    public function replace(
        UploadedFile $newFile,
        ?string $oldPath,
        string $directory = 'uploads',
        string $disk = 'public'
    ): string {
        $this->delete($oldPath, $disk);
        return $this->upload($newFile, $directory, $disk);
    }

    /**
     * Delete an entire directory on the given disk.
     */
    public function deleteDirectory(string $directory, string $disk = 'public'): bool
    {
        if (Storage::disk($disk)->exists($directory)) {
            return Storage::disk($disk)->deleteDirectory($directory);
        }
        return false;
    }

    /**
     * Get the full public URL for a stored file path.
     */
    public function getUrl(?string $path, string $disk = 'public'): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        $relativePath = $this->getRelativePath($path, $disk);
        return Storage::disk($disk)->url($relativePath);
    }

    /**
     * Convert full URL or relative path to a clean relative storage path.
     */
    public function getRelativePath(string $path, string $disk = 'public'): string
    {
        $storageUrl = Storage::disk($disk)->url('');
        if ($storageUrl && str_starts_with($path, $storageUrl)) {
            return ltrim(substr($path, strlen($storageUrl)), '/');
        }

        // Strip leading /storage/ if present
        if (str_starts_with($path, '/storage/')) {
            return substr($path, 9);
        }

        return ltrim($path, '/');
    }
}
