let promise: Promise<void> | null = null;

export function loadXiangqi(): Promise<void> {
  if (promise) return promise;

  promise = new Promise((resolve, reject) => {
    // уже есть глобально
    if ((window as any).Xiangqi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '/scripts/lib/xiangqi.min.js';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load xiangqi'));

    document.head.appendChild(script);
  });

  return promise;
}
