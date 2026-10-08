import * as fsPromises from "node:fs/promises";
import path from "node:path";

const cachePath = path.join(process.cwd(), "data", "cache.json");

export async function cacheOrders(ids: number[]): Promise<void> {
    await fsPromises.mkdir(path.dirname(cachePath), {
        recursive: true,
    });

    let cachedIds: number[] = [];

    try {
        const data = await fsPromises.readFile(cachePath, "utf8");

        if (data.trim()) {
            cachedIds = JSON.parse(data);
        }
        const allIds = [...new Set([...cachedIds, ...ids])];
        if (ids.length !== 0) {
            await fsPromises.writeFile(cachePath, JSON.stringify(allIds), "utf8");
            console.log("Кэш обновлён");
        } else {
            console.log("Изменений нет");
        }
    } catch (error: any) {
        if (error.code === "ENOENT") {
            await fsPromises.writeFile(cachePath, JSON.stringify(ids), "utf8");

            console.log("Кэш создан");
            return;
        }
        throw error;
    }
}

export async function getNewIds(currentIds: number[]): Promise<number[]> {
    try {
        const data = await fsPromises.readFile(cachePath, "utf8");
        const cachedIds: number[] = JSON.parse(data);
        const cachedIdsSet = new Set(cachedIds);

        const newIds = currentIds.filter((id) => !cachedIdsSet.has(id));

        return newIds;
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return currentIds;
        }
        throw error;
    }
}
// await cacheOrders([23, 5, 1, 2, 3]);
// await getNewIds([23, 5, 1, 2, 3, 7]);
