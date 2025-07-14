function getImageUrl(path: string) {
  if (!path) return '';
  const trimmed = path.trim();
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return trimmed;
}

export { getImageUrl }; 

//WE HAD THE BACKEND API_URL IN THE IMAGE PATH, BUT NOW WE HAVE THE SUPABASE BASE URL, DO WE HAVE CHANGED THIS , I DONT REALLY CARE ANYWATS TBH!!!!