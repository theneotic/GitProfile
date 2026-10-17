interface StoredUpload {
  buffer: Buffer;
  contentType: string;
  filename: string;
  createdAt: number;
}

const g = globalThis as unknown as {
  _uploadStore?: Map<string, StoredUpload>;
};

if (!g._uploadStore) {
  g._uploadStore = new Map<string, StoredUpload>();
}

export const uploadStore = g._uploadStore;

export function pruneUploads() {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const [key, item] of uploadStore.entries()) {
    if (now - item.createdAt > ONE_DAY) {
      uploadStore.delete(key);
    }
  }
}
