import { queryLLM } from "./agent.controller.js";
import { parseKwork } from "./parser.js";
import { filterProject, type Project } from "./utils/filter.js";

const agentWorker = async () => {
    try {
        const projects = await parseKwork();
        let prompt = "";
        for (const project of projects) {
            if (filterProject(project)) {
                continue;
            }
            prompt += `\n ID проекта: ${project.id}\n Название: ${project.name}\n Описание: ${project.description}\n Статус: ${project.status}\n Цена от: ${project.priceLimit}₽\n Лимит времени (в днях): ${project.max_days}\n Ссылка на подробное описание: https://kwork.ru/projects/${project.id}/view\n Откликов: ${project.getWantsActiveCount}`;
        }
        // console.log(prompt);
        const res = await queryLLM(prompt);
        console.log(res);
    } catch (error) {
        throw error;
    }
};
await agentWorker();
