# Mock exam: Uniswap v4

ECO5037W Fintech and Cryptocurrencies. Practice for the practical exam.

Read [PREPARATION.md](PREPARATION.md) first. It tells you what the real exam looks like and what to
study. This file is the practice run itself.

Everybody does the same mock, with the numbers below. In the real exam you get your own sheet with
your own numbers, but the steps are identical.

Nothing here is marked. Do it twice if you have time.

---

## Setup, about five minutes

**Step 1.** Open [remix.ethereum.org](https://remix.ethereum.org).

**Step 2.** In the file explorer on the left, click **Clone git repository** and paste this
repository's URL. Wait for the files to appear.

**Step 3.** Click the **Deploy and Run** tab on the far left (the Ethereum logo). At the top, set
**Environment** to **Remix VM (Cancun)**. Uniswap v4 will not run on an older setting.

**Step 4.** Right click `scripts/01_setup.js` and choose **Run**. After a few seconds the terminal
prints three addresses. Copy them somewhere.

```
Pool manager     0x ______________________________________
Liquidity router 0x ______________________________________
Swap router      0x ______________________________________
```

> Reloading the page or changing the Environment wipes everything you deployed. Your code is safe,
> the deployments are not. If it happens, run the setup again and redeploy.

**If any of this fails, tell us before exam day.** That is the main reason the mock exists.

---

## Your numbers for the mock

In the real exam these come on a sheet with your student number on it. Copy them exactly, digit
for digit. They are long because the tokens have 18 decimals, so the numbers are in the smallest
unit, not whole tokens.

```
--- TASK 1, your two tokens ---

  Token A name          Campus Credits
  Token A symbol        CRED
  Token B name          Library Points
  Token B symbol        LIB

  initialSupply_        1000000000000000000000000
                        that is 1000000 tokens at 18 decimals

--- TASK 2, your pool ---

  _fee                  3000
  _tickSpacing          60

  Starting price        1 CRED is worth 4 LIB

  _sqrtPriceIfAlphaIsCurrency0
                        158456325028528675187087900672
  _sqrtPriceIfBetaIsCurrency0
                        39614081257132168796771975168

--- TASK 3, liquidity ---

  Send to your Task3Liquidity contract, from token A and again from token B:
                        500000000000000000000000

  liquidityDelta        10000000000000000000000
                        a liquidity amount, not a number of tokens

--- TASK 4, the swap ---

  Send to your Task4Swap contract, from token A and again from token B:
                        500000000000000000000000

  amountIn              1000000000000000000
                        that is 1 whole token

  Direction             currency0 into currency1
                        so zeroForOne is true
```

The two long price numbers are worth a look. The starting price is 4, and the square root of 4 is
2, so the first number is exactly two times two to the power of ninety six. The second is the same
thing for a price of one quarter, so it is half of two to the power of ninety six. In the real exam
your ratio will not be a perfect square, and the numbers will not be as tidy, but they are worked
out the same way and they arrive already calculated on your sheet.

---

## Task 1: mint your tokens

Open `contracts/Task1Token.sol` and fill in `TODO 1.1`.

Compile with the **Solidity Compiler** tab. Then in **Deploy and Run**, pick `ExamToken` from the
**Contract** dropdown, expand the **Deploy** button, and deploy it twice: once with the token A
name and symbol, once with token B. Both use the same `initialSupply_`.

Write down both addresses.

---

## Task 2: open the pool

Open `contracts/Task2Pool.sol` and fill in `TODO 2.1` to `TODO 2.3`. Compile.

Deploy `Task2Pool` once, with the three addresses from setup, your two token addresses, the fee,
the tick spacing, and the two long price numbers.

Then call, in order: `alphaIsCurrency0`, `poolId`, `startingSqrtPriceX96`, `openPool`,
`currentSlot0`. Write down what each one gives you.

---

## Task 3: add liquidity

Open `contracts/Task3Liquidity.sol` and fill in `TODO 3.1` to `TODO 3.3`. Compile.

Deploy `Task3Liquidity` once. The fee and tick spacing have to match Task 2 exactly, or you are
pointing at a pool that does not exist.

Send it tokens: call `transfer` on token A, and again on token B, to the `Task3Liquidity` address,
using the send amount above.

Call `currentTick` to see the live tick, choose a `tickLower` below it and a `tickUpper` above it,
both multiples of 60, then call `addLiquidity`. Look at **decoded output** in the terminal for the
two amounts.

---

## Task 4: predict, then swap

Open `contracts/Task4Swap.sol` and fill in `TODO 4.1` to `TODO 4.4`. Compile.

Deploy `Task4Swap` once, with the swap router this time. Send it tokens the same way.

Work out roughly how much you expect back for one whole token, given a price of 4 and a fee of
3000. Call `recordPrediction` with that number in the smallest unit, then call `swapExactIn` with
`zeroForOne` true and the `amountIn` above.

Compare what you predicted against what you got, and make sure you can explain the gap. The real
exam asks you to do exactly that in writing.

---

## When you are done

Try these, because the real exam asks about them:

- Deliberately give `addLiquidity` a tick that is not a multiple of 60. Read the error.
- Deliberately give it a range that sits entirely above the live tick. Read that error too.
- Try `swapExactIn` before `recordPrediction` and see what happens.
- Work out what your pool would have done if the other token had sorted first.

A worked solution is published about a week after the mock goes out. Try it properly before then.
Reading the answer is worth far less than getting stuck and pushing through it.
