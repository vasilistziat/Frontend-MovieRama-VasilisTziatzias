export const getDuration = (time: number) => {
    const hours = time / 60;
    const roundedHours = Math.floor(hours);
    const minutes = (hours - roundedHours) * 60;
    const roundedMinutes = Math.round(minutes);
    return `${roundedHours}h ${roundedMinutes}m`;
};
