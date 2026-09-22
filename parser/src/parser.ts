import axios from "axios";
import * as cheerio from "cheerio";

export const parseKwork = async () => {
    try {
        const response = await axios.get("https://kwork.ru/projects");
        const $ = cheerio.load(response.data);

        let projectsPrompt = "";

        const script = $("script").eq(11).html();

        if (script && script.includes("wantsListData")) {
            const match = script.match(/window\.stateData=(\{.*?\});window\.firebaseConfig/s);

            if (match) {
                const stateData = JSON?.parse(match[1]!);
                // console.log(stateData.wantsListData.pagination.data);
                const projects = stateData.wantsListData.pagination.data;

                for (const project of projects) {
                    projectsPrompt += `\n ID проекта: ${project.id}\n Название: ${project.name}\n Описание: ${project.description}\n Статус: ${project.status}\n Цена от: ${project.priceLimit}₽\n Лимит времени (в днях): ${project.max_days}\n Ссылка на подробное описание: https://kwork.ru/projects/${project.id}/view\n Откликов: ${project.getWantsActiveCount}`;
                }
                // console.log(projectsPrompt);
                return projectsPrompt;
            } else {
                console.log("Matches no found");
                return null;
            }
        }
    } catch (e) {
        console.error(e);
    }
};
await parseKwork();
