# How to prepare for the practical exam

ECO5037W Fintech and Cryptocurrencies, 2026.

This is a mock exam to help you prepare for the real one.

---

## The exam at a glance

| | |
| --- | --- |
| Length | Three hours |
| Total | 100 marks |
| Format | Practical, open book |
| Where | Wherever, on your own laptop |
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

| Task                    | Marks |
| ----------------------- | ----- |
| 1. Mint your two tokens | 10    |
| 2. Open the pool        | 20    |
| 3. Add liquidity        | 20    |
| 4. Predict, then swap   | 15    |
| 5. Report your results  | 10    |
| 6. Written section      | 25    |
| *Total*                   | 100   |

---

## Where it runs

**Remix, in your browser, is what we support.** Go to [remix.ethereum.org](https://remix.ethereum.org).

**Bring your own laptop.** Any machine that runs a current browser is fine. The work is light.

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
Every student gets a unique text file. It carries your token names and
symbols, your fee tier, your tick spacing, your starting price, your liquidity amount and your swap
amount. **Everyone gets different values.**


1. A classmate's numbers will not work in your contracts, and yours will not work in theirs.
2. Copy the numbers exactly, digit for digit. They are long because they are in the token's
   smallest unit. The single most common mistake last time was typing a short round number where a
   long one was required, which mints almost nothing and makes the next step fail.


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

Five questions, five marks each, **120 words maximum per answer**.

Every question is about **your own run**: your parameters, your addresses, your numbers, your
errors, your chosen range. A textbook description of how Uniswap works, however accurate, scores
nothing. The marks are for statements that can be checked against the work you submitted.

---

## How to use the mock

The mock covers all six tasks, with one fixed set of numbers that everybody shares. Work through
[README.md](README.md) in this repository.

Do it at least twice. The second run should take well under an hour, and that is the point: on the
day you want the mechanics to be automatic so your three hours go on thinking rather than on
finding buttons.

Between the two runs, break things deliberately. Give `addLiquidity` a tick that is not on the
grid. Give it a range that misses the price. Try to swap before recording a prediction. Read the
error each time and make sure you understand it.

Do not skip Tasks 5 and 6 because they are not code. They are 35 of the 100 marks, and the written
section is where general knowledge gets you nothing and your own numbers get you everything.

### The mock is not the exam paper

The mock is a rehearsal, not a preview. The two papers ask for the same understanding, and they
deliberately do not ask for it in the same words.

Some of what differs between this mock and the exam:

- the token contract has a different name, and so do several variables and events
- the gaps are split up differently, so a check that is one line here may be two there
- the fee, the tick spacing, the starting price, the supply and the swap amount are all different,
  and yours will be different again from your neighbour's
- the mock swaps currency1 into currency0, the exam may well go the other way
- the five written questions are different questions

What does not differ: the four tasks, the ideas being tested, `V4.sol`, `ERC20.sol`, `ExamBase.sol`,
the setup script, and the way everything fits together.

The practical consequence is simple. **Copying your mock answers into the exam will not work.**
Knowing why each line is what it is will work perfectly. If you find yourself pasting rather than
reading during your second run, slow down, because that is exactly the habit the exam catches.

---

## Before exam day

- Open Remix on the laptop you will bring, and confirm you can clone a repository into it.
- Run the setup script and confirm it prints three addresses.
- Deploy at least one contract successfully.
- Complete the mock end to end.
- **If anything on that list fails, tell us before the day.** Setup problems are not what the exam
  is testing, and there is no time to solve them on the day.


Good luck - Marc :)
