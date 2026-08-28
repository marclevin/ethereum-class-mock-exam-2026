# Written section, mock

Answer all five questions. **Maximum 120 words each.**

---

## Question 1 (5 marks)

State your `poolId` and list the exact values that produced it. Then explain what would have
happened if you had deployed `Task3Liquidity` with a tick spacing of 60 instead of 200, everything
else unchanged. Say what `poolId` would have done, and what the first failure would have been.

**Answer:**

---

## Question 2 (5 marks)

You put in 5 whole tokens of currency1. State which of your two tokens became currency0 and how you
knew, the output you predicted, the output you actually received, and the arithmetic that got you
from 5 to your prediction. Then split the difference between prediction and actual into the part
that is fee and the part that is not, with numbers.

**Answer:**

---

## Question 3 (5 marks)

`Task3Liquidity` has to be holding your tokens and it also has to have approved the liquidity
router. Explain why both are needed and what each one does. Then call `addLiquidity` from a freshly
deployed `Task3Liquidity` that you have not sent any tokens to, quote the error message exactly,
and say which of the two requirements it was complaining about.

**Answer:**

---

## Question 4 (5 marks)

State your live tick and the range you chose, and say why you chose it. Then answer this: if you
had chosen a range sitting entirely **below** the live tick, what would have happened? Name which
of your two tokens the pool would have taken, which it would have left untouched, and why that is
the way round it is.

**Answer:**

---

## Question 5 (5 marks)

State the number `startingSqrtPriceX96` returned for your run. Show how that number relates to your
starting price of 16, or one sixteenth, and to two to the power of ninety six. Then explain why the
protocol stores the square root of the price rather than the price itself, and why your tick came
out at roughly plus or minus 27727.

**Answer:**

---
