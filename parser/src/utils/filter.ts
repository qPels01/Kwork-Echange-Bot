export interface Project {
    name: string;
    description: string;
    max_days: string;
    id: number;
    priceLimit: string;
    possiblePriceLimit: number;
    timeLeft: string;
    status: string;
    getWantsActiveCount: number;
}

export const filterProject = (data: Project): boolean => {
    const forbiddenKeywords = [
        "wordpress",
        "1с",
        "битрикс",
        "bitrix",
        "tilda",
        "wix",
        "joomla",
        "drupal",
        "opencart",
        "shopify",
        "seo",
        "дизайн",
        "логотип",
        "баннер",
        "верстка",
        "копирайтинг",
        "Битрикс24",
        "Bitrix24",
        "Вордпрес",
        "Вордпресc",
    ];

    const text = `${data.name}${data.description}`.toLocaleLowerCase();

    return forbiddenKeywords.some((keyword) => text.includes(keyword));
};
