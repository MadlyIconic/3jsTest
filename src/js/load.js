export async function load(url, populateOptions) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}