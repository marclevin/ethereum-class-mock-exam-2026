# How to prepare for the practical exam

ECO5037W Fintech and Cryptocurrencies, 2026.

Read this once now, work through the mock, then read it again the day before.

---

## The exam at a glance

| | |
| --- | --- |
| Length | Three hours |
| Total | 100 marks |
| Format | Practical, open book |
| Where | In the venue, on your own laptop |
| Tools | Remix in your browser |
| What you write | Solidity, filling in gaps in code that is already written |
| What you submit | Four Solidity files, one JSON file, one Markdown file |

You will mint two reward tokens, open a Uniswap v4 pool at a given price, add liquidity to it, and
trade against it. Four tasks, one contract each.

**The code is mostly written for you.** Each contract has gaps marked `TODO`, with a hint next to
every one. There are eleven gaps in total and most are a single line. You are not asked to write a
Uniswap integration from scratch.

---

## Marks

| Task | Marks | How it is marked |
| --- | --- | --- |
| 1. Mint your two tokens | 10 | Automatically |
| 2. Open the pool | 20 | Automatically |
| 3. Add liquidity | 20 | Automatically |
| 4. Predict, then swap | 15 | Automatically |
| 5. Report your results | 10 | Automatically |
| 6. Written section | 25 | By hand |

Seventy five of the hundred marks come from running your submitted code. **Code that does not
compile scores zero on Tasks 1 to 5**, no matter how nearly right it looks, so leave time to press
Compile once more before you submit.

---

## Where it runs

**Remix, in your browser, is what we support.** Go to [remix.ethereum.org](https://remix.ethereum.org).
Nothing is installed, nothing costs anything, and there is no test network. Remix gives you a
sandbox with ten accounts holding fake ether, and a script in the repository puts Uniswap v4 into
that sandbox for you.

**Bring your own laptop.** Any machine that runs a current browser is fine. The work is light: the
heavy Uniswap contracts arrive already compiled, so your browser only ever compiles the small
amount of code you write.

**You may use your own local setup instead if you strongly prefer it**, but understand what that
means. Every instruction in the exam paper describes Remix, and support on the day will be for
Remix. You would be responsible for getting Uniswap v4 running locally yourself, in the time
allowed. The files you submit are the same either way. Unless you already have a working local
Solidity setup and are confident with it, use Remix.

**One thing to know about the sandbox.** Reloading the page or changing the Environment setting
wipes everything you have deployed. Your written code survives, your deployed contracts do not. The
exam is built so this costs you a few minutes rather than the whole paper, because each task is a
separate contract that you deploy once. Still, do not reload the page.

---

## You get your own parameter sheet

Every student gets a printed sheet with their student number on it. It carries your token names and
symbols, your fee tier, your tick spacing, your starting price, your liquidity amount and your swap
amount. **Everyone gets different values.**

That has three consequences worth taking seriously.

1. A classmate's numbers will not work in your contracts, and yours will not work in theirs.
2. Copy the numbers exactly, digit for digit. They are long because they are in the token's
   smallest unit. The single most common mistake last time was typing a short round number where a
   long one was required, which mints almost nothing and makes the next step fail.
3. Keep the sheet safe during the exam and hand it back at the end.

The starting price arrives on your sheet already worked out, as two long numbers. You are not asked
to compute square roots.

---

## What to study

### Things you already met in the assignments

- What an ERC20 token is: `totalSupply`, `balanceOf`, `transfer`, `approve`, `transferFrom`.
- **Decimals.** A token with 18 decimals holds amounts in units of a quintillionth. One whole token
  is `1000000000000000000`. Be comfortable moving between the two.
- Why an automated market maker is different from an order book.

### The core of this exam

- **What identifies a pool.** Four things: the two currencies in sorted order, the fee, the tick
  spacing, and the hooks address. Change any one and you are talking about a different pool. This
  is why Tasks 2, 3 and 4 must all be given the same fee and tick spacing.
- **Currency sorting.** The pool always calls the lower token address `currency0` and the higher
  one `currency1`. You do not choose. You find out only after your tokens are deployed, which is
  why your sheet gives you two starting prices instead of one.
- **Ticks.** A tick is a price point, `price = 1.0001 ** tick`. Ticks can be negative, and often
  are. Any tick holding liquidity must be an exact multiple of the pool's tick spacing.
- **Concentrated liquidity.** Your liquidity is only active between the two ticks you choose. If
  the current price sits outside your range, your position does nothing and the pool takes only one
  of your two tokens.
- **`sqrtPriceX96`.** How the protocol stores price: the square root of the price, scaled by two to
  the power of ninety six. You should know what it is and why the square root is there. You will
  not have to calculate one.
- **Exact input against exact output.** In v4 the sign of `amountSpecified` chooses between them. A
  negative amount means exact input. This catches people who have read about earlier versions.
- **`sqrtPriceLimitX96`.** A bound on how far the price may move during a swap. It has to sit on the
  side the price is moving towards, or the swap will not run.
- **Approvals.** The routers move tokens out of your contract with `transferFrom`, so your contract
  has to approve them first, and it has to be holding the tokens.
- **Fees and slippage.** Why the amount you get back is always a bit less than the price alone
  suggests, and which part of the shortfall is the fee and which part is your own trade moving the
  price.

### Not examined

Hooks, flash accounting, Permit2, the position manager, and writing your own router. If you find
yourself reading about those, you have gone past the edge of the exam.

---

## The written section, 25 marks

Five questions, five marks each, **120 words maximum per answer**. Each is marked as nothing, half
or full.

Every question is about **your own run**: your parameters, your addresses, your numbers, your
errors, your chosen range. A textbook description of how Uniswap works, however accurate, scores
nothing. The marks are for statements that can be checked against the work you submitted.

The questions cover ground like this:

- Why your sheet gave you two starting prices, which one your pool used, and how you knew.
- What output you predicted before swapping, how you arrived at it, and where the difference
  between that and the real figure went.
- The exact error you hit on a failed attempt at adding liquidity, and what caused it given your
  tick spacing and your live tick.
- The range you chose, and what would have happened if you had chosen one that misses the price.
- What changes if a token uses 6 decimals instead of 18.

**Practise while you do the mock.** Keep a note of what you predicted, what you got, and every
error message you saw. Trying to reconstruct that at the end is much harder than writing it down as
you go.

---

## How to use the mock

The mock is the same four tasks with a fixed set of numbers that everyone shares. Work through
[README.md](README.md) in this repository.

Do it at least twice. The second run should take well under an hour, and that is the point: on the
day you want the mechanics to be automatic so your three hours go on thinking rather than on
finding buttons.

Between the two runs, break things deliberately. Give `addLiquidity` a tick that is not on the
grid. Give it a range that misses the price. Try to swap before recording a prediction. Read the
error each time and make sure you understand it. Those errors show up in the written section.

A worked solution is published about a week after the mock. Get properly stuck first.

---

## Before exam day

- Open Remix on the laptop you will bring, and confirm you can clone a repository into it.
- Run the setup script and confirm it prints three addresses.
- Deploy at least one contract successfully.
- Complete the mock end to end.
- **If anything on that list fails, tell us before the day.** Setup problems are not what the exam
  is testing, and there is no time to solve them in the room.

## On the day

- Bring your laptop, charged, and its charger.
- Bring your parameter sheet.
- Set the Environment to **Remix VM (Cancun)** before anything else.
- Run the setup script first, and keep the three addresses it prints somewhere you can see.
- Write down every address and number as you go. The paper tells you exactly when.
- Do not reload the page.
- Leave ten minutes at the end for the results file and a final compile.

Good luck.
