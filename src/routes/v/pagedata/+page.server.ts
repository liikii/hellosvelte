export async function load() {
    return {
        user: "老铁",
        status: "在线",
        luckyNumber: Math.floor(Math.random() * 100)
    };
}
