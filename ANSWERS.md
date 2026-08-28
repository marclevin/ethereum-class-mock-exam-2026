# Written section, mock

Answer all five questions. **Maximum 120 words each.**

---

## Question 1 (5 marks)

State your `poolId` and list the exact values that produced it. Then explain what would have
happened if you had deployed `Task3Liquidity` with a tick spacing of 60 instead of 200, everything
else unchanged. Say what `poolId` would have done, and what the first failure would have been.

**Answer:**


The exact values that produced it were my token A address, my token B address, etc. (You would list the actual addresses and numbers here. This and explain how the poolId is derived from these values.)

---

## Question 2 (5 marks)

You put in 5 whole tokens of currency1. State which of your two tokens became currency0 and how you
knew, the output you predicted, the output you actually received, and the arithmetic that got you
from 5 to your prediction. Then split the difference between prediction and actual into the part
that is fee and the part that is not, with numbers.

**Answer:**

I knew which token became currency0 by checking which of the two currencies square root price was lower. The output I predicted was X, I actually received Y. The way I got this prediction was by calculating the amount of currency0 I would receive for 5 whole tokens of currency1 using the current price and accounting for the fee. The difference between my prediction and actual output is A, which can be split into a fee of B and a price impact of C.

---

## Question 3 (5 marks)

`Task3Liquidity` has to be holding your tokens and it also has to have approved the liquidity
router. Explain why both are needed and what each one does. Then call `addLiquidity` from a freshly
deployed `Task3Liquidity` that you have not sent any tokens to, quote the error message exactly,
and say which of the two requirements it was complaining about.

**Answer:**

Revert because ERC20 balance too small OR liquidity must be greater than zero. (Actually quote the right possible reverts, check the contract requires to tell you what should fail.)

(Another note, to do this type of testing, you can click the replay button to redeploy without having to change the code, and then call the function without sending tokens to it. The error message will indicate which requirement is not met.)


---

## Question 4 (5 marks)

State your live tick and the range you chose, and say why you chose it. Then answer this: if you
had chosen a range sitting entirely **below** the live tick, what would have happened? Name which
of your two tokens the pool would have taken, which it would have left untouched, and why that is
the way round it is.

**Answer:**

If I had set a range below the live tick, my position would have been inactive...

The pool would have taken my token A (or B, depending on which was currency0) and left the other token untouched...

The reason for this is...

---

## Question 5 (5 marks)

State the number `startingSqrtPriceX96` returned for your run. Show how that number relates to your
starting price of 16, or one sixteenth, and to two to the power of ninety six. Then explain why the
protocol stores the square root of the price rather than the price itself, and why your tick came
out at roughly plus or minus 27727.

**Answer:**

Please don't bother to do insane complex math here, if I ask something like this I want you to explain the logic and the relationship, not to do a full calculation. The square root is used because it allows for more efficient calculations in the AMM, and the tick value is derived from the logarithmic relationship between price and ticks, which is why it came out to roughly plus or minus 27727. Good enough!

---
