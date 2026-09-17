import axios from "axios";
import * as cheerio from "cheerio";

const getData = async () => {
    try {
        const response = await axios.get("https://kwork.ru/projects");
        const $ = cheerio.load(response.data);

        const script = $("script").eq(11).html();
        const redScript = script.replaceAll(" ", "");

        // let max_len = 0,
        //     max_index = 0;

        // let len = script.length;
        // if (max_len < len) {
        //     max_len = len;
        //     max_index = i;
        // }

        if (redScript && redScript.includes("wantsListData")) {
            const match = script.match(/window\.stateData=(\{.*?\});window\.firebaseConfig/s);

            let projectData = [];

            if (match) {
                const stateData = JSON.parse(match[1]);
                projectData = stateData.wantsListData.pagination.data;
            }

            console.log(projectData);

            for (const project of projectData) {
                const project_id = project.id;
                const project_name = project.name;
                const project_desc = project.description;
                const project_status = project.status;
                const project_price = project.priceLimit;
                const project_days = project.max_days;
                console.log(
                    `\nID: ${project_id}\nНазвание: ${project_name}\nОписание: ${project_desc}`,
                );
            }
        }
    } catch (e) {
        console.log(e);
    }
};
getData();
