export function formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}