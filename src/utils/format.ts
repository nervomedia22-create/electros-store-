export function formatEGP(amount: number, lang: 'ar' | 'en' = 'ar'): string {
  if (lang === 'ar') {
    return Number(amount).toLocaleString('ar-EG') + ' ج.م';
  }
  return Number(amount).toLocaleString('en-US') + ' EGP';
}

export function formatDate(dateString: string, lang: 'ar' | 'en' = 'ar'): string {
  try {
    const d = new Date(dateString);
    if (lang === 'ar') {
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}
