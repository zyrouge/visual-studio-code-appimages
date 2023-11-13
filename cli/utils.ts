export const xfetch = (...args: Parameters<typeof fetch>) => {
    return fetch(args[0], {
        ...args[1],
        headers: {
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0",
            ...args[1]?.headers,
        },
    });
};
