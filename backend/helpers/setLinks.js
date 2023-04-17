module.exports = function SetLinks(link, number) {
    link.searchParams.set("page[number]", 0)
    let first = link.pathname + link.search
    link.searchParams.set("page[number]", parseInt(number) + 1)
    let next = link.pathname + link.search
    return {
        first,
        next
    }
}