import axios from "axios";
import { queryLLM } from "./agent.controller.js";
import { parseKwork } from "./parser.js";
import { filterProject, type Project } from "./utils/filter.js";

const agentWorker = async (): Promise<void> => {
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
        const processedProjects: string = await queryLLM(prompt);
        const res = await axios.post("http://127.0.0.1:3000/projects", processedProjects);
        console.log(res.status);
    } catch (error) {
        throw error;
    }
};
await agentWorker();
