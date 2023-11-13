import { spawn } from "child_process";

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

export interface XSpawnResult {
    exitCode: number | null;
}

export const xspawn = async (...args: Parameters<typeof spawn>) => {
    return new Promise<XSpawnResult>((resolve) => {
        const proc = spawn(args[0], args[1], {
            ...args[2],
            env: {
                ...process.env,
                ...args[2]?.env,
            },
            stdio: "inherit",
        });
        proc.on("close", (exitCode) => {
            resolve({ exitCode });
        });
    });
};
