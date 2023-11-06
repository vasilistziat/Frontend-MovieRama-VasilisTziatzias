export const EventBus = (() => {
    const events: Record<string, Function[]> = {};

    const on = (eventName: string, callback: Function) => {
        if (!events[eventName]) {
            events[eventName] = [];
        }

        events[eventName].push(callback);
    };

    const off = (eventName: string, callback: Function) => {
        if (!events[eventName]) return;

        if (!callback) {
            delete events[eventName];
            return;
        }

        events[eventName] = events[eventName].filter((cb) => cb !== callback);
    };

    const emit = (eventName: string, ...args: Record<string, any>[]) => {
        if (!events[eventName]) return;

        events[eventName].forEach((callback) => {
            callback.apply(null, args);
        });
    };

    return {
        on,
        off,
        emit
    };
})();
