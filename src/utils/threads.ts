export async function yieldToEventThread() {
    await new Promise(resolve => setTimeout(resolve, 0));
}