const fs = require("node:fs")

const file = fs.readFileSync("./07/input.txt", { encoding: "utf-8" })

const cards = ['A', 'K', 'Q',  'T', '9', '8', '7', '6', '5', '4', '3', '2','J']
const rankOrder = ['fiveOfAKind', 'fourOfAKind', 'fullHouse', 'threeOfAKind', 'twoPair', 'onePair', 'highCard']
/** @type {{ [rank: string]: Hand[]}} */
const results = {
    fiveOfAKind: [],
    fourOfAKind: [],
    fullHouse: [],
    threeOfAKind: [],
    twoPair: [],
    onePair: [],
    highCard: [],
}

const lines = file.split('\n').filter(({ length }) => length)

/** @typedef {{ cards: string[], bid: number }} Hand */

/** @type {(hand: Hand) => number} */
const getNumberOfJokers = ({ cards }) => cards.reduce((acc, c) => (acc + (c === 'J' ? 1 : 0)), 0)

/** @type {Hand[]} */
const hands = lines.map(l => {
    const [handStr, bidStr] = l.split(' ')
    return {
        cards: handStr.split(''),
        bid: parseInt(bidStr),
    }
})


/** @type {(hand: Hand) => string[]} */
const getHandType = hand => {
    let run = 0
    let runs = []
    let lastCard = undefined
    const jokerCount = getNumberOfJokers(hand)
    const sortedWithoutJokers = hand.cards.filter(c => c !== 'J').sort((a, b) => cards.indexOf(a) - cards.indexOf(b))
    for (const card of sortedWithoutJokers) {
        if (lastCard === undefined) {
            lastCard = card
            run++
            continue
        }
        if (card === lastCard) {
            run++
            continue
        }
        lastCard = card
        runs.push(run)
        run = 1
    }
    if (lastCard === sortedWithoutJokers[sortedWithoutJokers.length - 1]) {
        runs.push(run)
    }

    const highestRun = runs.reduce((acc, run) => Math.max(acc, run), -1)

    if (jokerCount === 5) return 'fiveOfAKind'

    if (runs[0] === 5 || jokerCount + highestRun === 5) return 'fiveOfAKind'

    if (runs.includes(4) || jokerCount + highestRun === 4) return 'fourOfAKind'

    if (runs.includes(3) && runs.includes(2)) return 'fullHouse'

    if (runs.includes(2) && runs.slice(runs.indexOf(2) + 1).includes(2) && jokerCount === 1) return 'fullHouse'

    if (runs.includes(3) || highestRun + jokerCount === 3) return 'threeOfAKind'

    if (runs.includes(2) && runs.slice(runs.indexOf(2) + 1).includes(2)) return 'twoPair'

    if (runs.includes(2) || highestRun + jokerCount === 2) return 'onePair'

    return 'highCard'
}

hands.forEach(hand => {
    const type = getHandType(hand)
    results[type].push(hand)
})

/** @type {(a: Hand, b: Hand) => number} */
const sortByHandInRank = (a, b) => {
    for (let i = 0; i < a.cards.length; i++) {
        const aIndex = cards.indexOf(a.cards[i])
        const bIndex = cards.indexOf(b.cards[i])
        if (aIndex - bIndex === 0) continue

        return aIndex - bIndex
    }
    return 0
}

const finalOrder = rankOrder.map(rank => {
    const localResult = [...results[rank]].sort(sortByHandInRank)
    return localResult
}).reduce((acc, hands) => [...acc, ...hands], [])

console.log([...finalOrder].reverse().reduce((acc, hand, index) => acc + ((index + 1) * hand.bid), 0))
