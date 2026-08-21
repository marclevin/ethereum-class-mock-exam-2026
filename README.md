# Mock exam: Uniswap v4

ECO5037W Fintech and Cryptocurrencies.

Read [PREPARATION.md](PREPARATION.md) first. It tells you what the real exam looks like and what to
study. This file is the practice run itself.

Nothing here is marked. Do it twice if you have time.

> **This mock is deliberately not a copy of the exam paper.** Same six tasks, same ideas, same kind
> of work, but the token contract is called something else, the variables and events are named
> differently, the checks are split up differently, the numbers are different and the swap goes the
> other way. Answers memorised from here will not paste into the exam. Understanding from here will
> carry across completely. That is the whole point.

---

## Setup, about five minutes

**Step 1.** Open [remix.ethereum.org](https://remix.ethereum.org).

**Step 2.** On the top navigation bar, click the **GitHub Link** icon and connect to your GitHub account.

**Step 3.** Once connected, click the same icon again and select **Clone**. Paste your fork of the repository's URL and click **OK**. Wait for the files to appear in the file explorer on the left. (*NB* Make sure you are cloning your fork, not the original repository.)

**Step 4.** In the file explorer, right click `scripts/01_setup.js` and choose **Run**. Watch the
terminal at the bottom. After a few seconds it prints three addresses.

**Step 5.** Copy those three addresses into the table below. You will paste them repeatedly. (There is a button that says *EDIT* at the top of this page, click it to edit this markdown file.)

```
Pool manager     0x ______________________________________
Liquidity router 0x ______________________________________
Swap router      0x ______________________________________
```

> Reloading the page or changing the Environment wipes everything you deployed. Your code is safe,
> the deployments are not. If it happens, run the setup again and redeploy.

---

## Your numbers for the mock

In the real exam these come from a text file that is yours alone. For the mock, everyone uses the
set below. Copy them exactly, digit for digit.

```
--- TASK 1, your two tokens ---

  Token A name          Tutorial Tokens
  Token A symbol        TUT
  Token B name          Cafeteria Points
  Token B symbol        CAFE

  startingSupply_       2000000000000000000000000
                        that is 2000000 tokens at 18 decimals

--- TASK 2, your pool ---

  _fee                  10000
  _tickSpacing          200

  Starting price        1 TUT is worth 16 CAFE

  _sqrtPriceIfTokenALower
                        316912650057057350374175801344
  _sqrtPriceIfTokenBLower
                        19807040628566084398385987584

--- TASK 3, liquidity ---

  Send to your Task3Liquidity contract, from token A and again from token B:
                        1000000000000000000000000

  liquidityDelta        50000000000000000000000
                        a liquidity amount, not a number of tokens

--- TASK 4, the swap ---

  Send to your Task4Swap contract, from token A and again from token B:
                        1000000000000000000000000

  amountIn              5000000000000000000
                        that is 5 whole tokens

  Direction             currency1 into currency0
                        so zeroForOne is false
```

The two long price numbers are worth a look. The starting price is 16, and the square root of 16 is
4, so the first number is exactly four times two to the power of ninety six. The second is the same
thing for a price of one sixteenth, so it is a quarter of two to the power of ninety six. In the
real exam your ratio will not be a perfect square, and the numbers will not be as tidy, but they
are worked out the same way and they arrive already calculated.

The fee here is 10000, which is one percent. That is a fat fee by Uniswap standards and it is
deliberate: it makes the gap between what you predict and what you get big enough to see clearly in
Task 4. Your exam fee will probably be smaller.

---

## Task 1: mint your tokens

Open `contracts/Task1Token.sol` and fill in `TODO 1.1`.

Compile with the **Solidity Compiler** tab. Then in **Deploy and Run**, pick `PracticeToken` from
the **Contract** dropdown, expand the **Deploy** button, and deploy it twice: once with the token A
name and symbol, once with token B. Both use the same `startingSupply_`.

Write down both addresses.

```
Token A address 0x ______________________________________
Token B address 0x ______________________________________
```

---

## Task 2: open the pool

Open `contracts/Task2Pool.sol` and fill in `TODO 2.1` to `TODO 2.3`. Compile.

Deploy `Task2Pool` once, with the three addresses from setup, your two token addresses, the fee,
the tick spacing, and the two long price numbers.

Then call, in order: `alphaIsCurrency0`, `poolId`, `startingSqrtPriceX96`, `openPool`,
`currentSlot0`. Write down what each one gives you.

```
alphaIsCurrency0        ______________________________________
poolId                0x ______________________________________
startingSqrtPriceX96    ______________________________________
tick after openPool     ______________________________________
Task2Pool address     0x ______________________________________
```

Whichever of the two long numbers came back from `startingSqrtPriceX96`, satisfy yourself that it
is the right one for the sort order you actually got. Everything after this depends on it.

---

## Task 3: add liquidity

Open `contracts/Task3Liquidity.sol` and fill in `TODO 3.1` to `TODO 3.3`. Compile.

Deploy `Task3Liquidity` once. The fee and tick spacing have to match Task 2 exactly, or you are
pointing at a pool that does not exist.

Send it tokens: call `transfer` on token A, and again on token B, to the `Task3Liquidity` address,
using the Task 3 send amount above. That is half your supply.

Call `currentTick` to see the live tick, then choose a `tickLower` below it and a `tickUpper` above
it. Both must be exact multiples of 200.

A safe way to do it: step the live tick down to the multiple of 200 at or below it, then go twenty
spacings, meaning 4000 ticks, either side. With a live tick of 12345 that is 12200 in the middle,
so 8200 and 16200.

Your live tick may well be negative, depending on which of your tokens became currency0. That is
normal and nothing is wrong. The same method works: a live tick of -8642 steps down to -8800, so
-12800 and -4800.

Then call `addLiquidity` with your two ticks and the `liquidityDelta` above. Look at **decoded
output** in the terminal for the two amounts. Both are negative, because the tokens left your
contract and went into the pool.

```
tickLower        ______________________________________
tickUpper        ______________________________________
amount0          ______________________________________
amount1          ______________________________________
Task3 address 0x ______________________________________
```

---

## Task 4: predict, then swap

Open `contracts/Task4Swap.sol` and fill in `TODO 4.1` to `TODO 4.4`. Compile.

Deploy `Task4Swap` once, with the swap router this time. Send it tokens the same way, using the
Task 4 send amount. That is the other half of your supply, so both contracts end up funded and your
own balance ends at zero.

**Work out what you expect before you run anything.** You are putting in 5 whole tokens of
currency1 and getting currency0 back. Two things decide the answer:

- which of your tokens actually became currency0, because that flips the rate you get between 16
  and one sixteenth
- the fee, which is one percent and comes off what you put in

Do not guess. Check `alphaIsCurrency0`, work out which rate applies to you, take the fee off, and
write the number down with a reason next to it.

Call `recordPrediction` with that number in the smallest unit, so 18 decimals. Then call
`swapExactIn` with `zeroForOne` **false** and the `amountIn` above.

In **decoded output**, one amount is negative, the token you paid, and the other is positive, the
token you received. The positive one is your actual output. Copy both exactly, minus sign and all.

```
predicted output    ______________________________________
actual output       ______________________________________
Task4 address     0x ______________________________________
```

Compare what you predicted against what you got and make sure you can explain the gap. Some of it
is the fee. Some of it is your own trade moving the price. Know which is which, and roughly how big
each part is.

---

## Task 5: report your results

Open `results.json` and fill in every field with the values you wrote down.

Very long numbers go in as text inside quotes. The template already shows which ones. Keep minus
signs. Do not round or truncate anything.

In the exam this is worth 10 marks for what is essentially careful copying, so practise being
careful.

---

## Task 6: written section

Answer all five questions in `ANSWERS.md`. **120 words each, maximum.**

The exam asks five questions of this kind, worth 5 marks each. They are not these five questions,
but they are the same sort of question: every one is about your own run, and a correct general
description of how Uniswap works scores nothing.

Write real answers, not notes to yourself. Getting a specific, checkable claim into 120 words is a
skill, and it is quicker to learn it now than on the day.

---

## Practise the handover

You will not submit any of this, but do the submission steps once anyway, because fumbling them
under time pressure is a real way to lose marks.

In the exam you download exactly six files from the Remix file explorer, right click each one and
choose **Download**:

```
Task1Token.sol
Task2Pool.sol
Task3Liquidity.sol
Task4Swap.sol
results.json
ANSWERS.md
```

You do not rename them, you do not submit the workspace as a zip, and you press **Compile** one
last time first. Files that do not compile score zero on the code tasks whatever is written in
them. Then the six files go into a single zip called `STUDENTNUMBER.zip`.

Do all of that now, with these mock files, and time yourself. It should take about three minutes.

---

## Checking yourself

`scripts/02_selfcheck.js` is optional. Fill in the three addresses at the top, right click the
file, choose **Run**. It checks the shape of your contracts and the rules they should be enforcing.
It does not check your numbers and it is not a mark predictor. The exam has one of these too.

---

## When you have finished

Do it again. The second run should take well under an hour.

Then break it deliberately, because the written section has a habit of asking about error messages:

- give `addLiquidity` a tick that is not a multiple of 200
- give it a range that sits entirely above the live tick, and see which token the pool takes
- try `swapExactIn` before recording a prediction
- deploy `Task3Liquidity` with the wrong tick spacing and watch `poolId` change

Read each error. Make sure you can say what caused it.

---

## References

**Which files you edit.** Only the four task files, plus `results.json` and `ANSWERS.md`. `V4.sol`,
`ERC20.sol` and `ExamBase.sol` are provided and already finished. Those three are identical to the
ones you will get in the exam.

**Uniswap v4.** [Uniswap v4 docs](https://docs.uniswap.org/contracts/v4). Comprehensive, and more
than you need. Both this mock and the exam can be completed without reading them.

**Ticks.** `price = 1.0001 ** tick`. Any tick that holds liquidity has to be a multiple of the
pool's tick spacing.

**Compiler warnings.** The starting files produce warnings about unused variables. That is normal
and costs you nothing. They disappear as you fill the gaps in. Only red errors matter.
