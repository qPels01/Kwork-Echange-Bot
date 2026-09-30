import * as fsPromises from "node:fs/promises";
import path from "node:path";

const cachePath = path.join(process.cwd(), "data", "cache.json");

export async function cacheOrders(ids: number[]) {
    try {
        await fsPromises.mkdir(path.dirname(cachePath), {
            recursive: true,
        });

        const data = await fsPromises.readFile(cachePath, "utf8");
        const cachedIds: number[] = JSON.parse(data);

        if (JSON.stringify(cachedIds) !== JSON.stringify(ids)) {
            await fsPromises.writeFile(cachePath, JSON.stringify(ids), { encoding: "utf8" });
            console.log("Кэш обновлён");
        } else {
            console.log("Изменений нет");
        }
    } catch (error: any) {
        console.error(error);
    }
}
