import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { SocksProxyAgent } from "socks-proxy-agent";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const proxy = {
    host: process.env.PROXY_SERVER,
    port: process.env.PROXY_PORT,
    username: process.env.PROXY_USER,
    password: process.env.PROXY_PASS,
};

const agent = new SocksProxyAgent(
    `socks5://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`,
);

export const queryLLM = async (prompt: string): Promise<string> => {
    try {
        const res = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "dots-studio/dots-3-note-preview:free",
                messages: [
                    {
                        role: "system",
                        content:
                            "Ты должен фильтровать заказы, которые взяты с фриланс биржы Kwork. Тебе в сообщение отправляются данные о заказах, выдавай вначале инфу о заказе, по типу его опиания. Потом пиши цену сроки и т.д. Не забудь про ссылку на сам заказ. Дели заказы как бы на категории, тип хорошие, которые я сделаю, не очень и хуйня. Это будут заказы на разработку ботов, сайтов и т.д. Отвечай мне списком заказов, которые подходят. В приоритет ставь те, которые подошли бы мне. Я джун, более-менее разбираюсь в вебе",
                    },
                    { role: "user", content: prompt },
                ],
            },
            {
                httpsAgent: agent,
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            },
        );
        const reply = res.data.choices[0].message.content;
        // console.log("\ud83e\udd16 Response:", reply);
        return reply;
    } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
        return "";
    }
};
// await queryLLM("ПРивет!!! Как твои дела???");
