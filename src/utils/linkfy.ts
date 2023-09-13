export let charactersAccepted = "abcdefghijklmnopqrstuvwxyz1234567890-"

const linkfy = (s: string) => {
    let ns = String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    ns = ns.toLowerCase().split("")?.map(letter => charactersAccepted.includes(letter) ? letter : "-").join("");
    while (ns.includes('--'))
    ns = ns.split('--').join('-');
    ns = ns.split("")?.map((letter, i) => (letter === "-" && i === 0) ? "" : letter).join("");
    return ns
}

export default linkfy