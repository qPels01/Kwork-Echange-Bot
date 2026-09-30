import axios from "axios";
import * as cheerio from "cheerio";
import { type Project } from "./filter.js";
import { cacheOrders } from "./utils/cacher.js";

export const parseKwork = async (): Promise<Project[]> => {
    try {
        const responses: any[] = await Promise.all([
            axios.get("https://kwork.ru/projects?c=41"),
            axios.get("https://kwork.ru/projects?c=37"),
        ]);

        let projects: Project[] = [];

        for (const response of responses) {
            const $ = cheerio.load(response.data);

            const script = $("script").eq(11).html();

            if (script && script.includes("wantsListData")) {
                const match = script.match(/window\.stateData=(\{.*?\});window\.firebaseConfig/s);

                if (!match) {
                    continue;
                }
                const stateData = JSON?.parse(match[1]!);
                projects.push(...stateData.wantsListData.pagination.data);
            }
            // console.log(projects.length);
        }
        await cacheOrders(projects.map((project) => project.id));
        return projects;
    } catch (e) {
        console.error(e);
        return [];
    }
};
await parseKwork();
