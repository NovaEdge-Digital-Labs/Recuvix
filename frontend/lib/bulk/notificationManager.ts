export const playNotificationSound = () => {
    try {
        const audio = new Audio('/sounds/complete.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.warn("Audio play failed:", e));
    } catch (e) {
        console.warn("Audio Context failed:", e);
    }
};

export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;

    const permission = await Notification.requestPermission();
    return permission === "granted";
};

export const sendBrowserNotification = (title: string, body: string, icon = "/logo.png") => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    try {
        new Notification(title, {
            body,
            icon,
            tag: "recuvix-bulk-complete",
            renotify: true
        } as NotificationOptions & { renotify?: boolean });
    } catch (e) {
        console.warn("Browser notification failed:", e);
    }
};
