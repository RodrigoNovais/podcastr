export const convertDurationToTimeString = (duration: number): string => {
    const hours = Math.floor(duration / (60 * 60));
    const minutes = Math.floor(duration / 60 % 60);
    const seconds = Math.floor(duration % 60);

    const time = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':');

    return time;
};
