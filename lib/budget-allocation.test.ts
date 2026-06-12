import assert from "node:assert/strict"
import { allocateBudgetCategories, inferEventType } from "./budget-allocation"

const formal = allocateBudgetCategories({
  totalBudget: 3000,
  eventType: "formal dinner",
})

assert.deepEqual(
  formal.map((item) => [item.key, item.percentage, item.amount]),
  [
    ["venue", 30, 900],
    ["catering", 40, 1200],
    ["av_tech", 10, 300],
    ["marketing", 15, 450],
    ["contingency", 5, 150],
  ],
)

const defaultSplit = allocateBudgetCategories({
  totalBudget: 999.99,
  eventType: "unknown event",
})

assert.equal(defaultSplit[0].amount, 350)
assert.equal(defaultSplit[4].amount, 100)
assert.equal(inferEventType("summer ball formal dinner for 200 people"), "formal dinner")
assert.equal(inferEventType("weekly party at a club"), "club night")
assert.equal(inferEventType("football team social"), "sports social")

console.log("budget allocation tests passed")
