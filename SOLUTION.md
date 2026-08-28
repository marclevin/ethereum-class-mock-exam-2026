# Mock exam, worked solution

The four contracts in `contracts/` on this branch are filled in. Read this alongside them.

If you have not genuinely tried the mock yet, stop and go and do that first. Reading a solution
feels like learning and mostly is not. The exam asks you to explain your own choices, and you
cannot explain a choice you did not make.

One warning before you start copying. **The exam paper is not this paper.** The contract names, the
variable names, the events, the way the checks are split up and every number are different there.
The eleven ideas below are what carries across. The eleven lines below do not.

---

## Task 1: mint your tokens

```solidity
_mint(issuer, startingSupply_);
```

`issuer` was set to `msg.sender` on the line above, so the whole supply lands with whoever sent the
deployment transaction, which is you.

The trap here is not the code, it is the number. `startingSupply_` is in the token's smallest unit.
With 18 decimals, `2000000000000000000000000` is two million tokens, and `2000000` is two
millionths of one. Type the short number and everything downstream fails, usually at the first
`transfer`, with a message about your balance being too small.

---

## Task 2: open the pool

**TODO 2.1**

```solidity
return alphaIsCurrency0() ? sqrtPriceIfTokenALower : sqrtPriceIfTokenBLower;
```

The pool sorts your two tokens by address and calls the lower one `currency0`. You have no say in
it, and you only find out once both tokens are deployed. `alphaIsCurrency0()` is exactly that
question: did token A come out as the lower address.

Price in this protocol always means "how much `currency1` does one unit of `currency0` buy". So
when your token A wins the sort, the price is 16 and you want the first number. When token B wins,
the same market is described by the reciprocal, one sixteenth, and you want the second. That is why
you were given two numbers, and why one is not the other with a minus sign: they are reciprocals,
not opposites. A price of 16 becomes a price of one sixteenth, and after the square root, four
becomes one quarter.

Get this backwards and nothing errors. The pool opens happily at the wrong price, and you find out
in Task 4 when your output is 256 times what you expected.

**TODO 2.2**

```solidity
tick = poolManager.initialize(key, startingPrice);
```

The pool manager holds every pool in one contract. `initialize` writes your pool's starting price
and hands back the tick that price sits at.

For this mock that tick is **27727** if your token A sorted lower, and **-27728** if token B did.
Both are the same market seen from opposite ends: `1.0001 ** 27727` is about 16, and
`1.0001 ** -27728` is about one sixteenth. A negative tick is not a problem and not a mistake.

**TODO 2.3**

```solidity
emit PoolReady(poolId(), currency0(), currency1(), startingPrice, tick);
```

Events are the record of what happened. Note that this event does not carry the fee or the tick
spacing, so read the declaration rather than assuming the field list. The exam's event has a
different name and a different set of fields, and it is checked against its own declaration.

---

## Task 3: add liquidity

**TODO 3.1, both ticks have to sit on the grid**

```solidity
require(
    tickLower % TICK_SPACING == 0 && tickUpper % TICK_SPACING == 0,
    "a tick is not a multiple of the tick spacing"
);
```

A pool does not track every possible tick. It tracks every `TICK_SPACING`th one. With a spacing of
200, the pool knows about 27600 and 27800 and nothing between them, so liquidity can only start and
stop at those points. Remember your tick may be negative, and the same rule applies.

**TODO 3.2, the range has to contain the live tick**

```solidity
require(tickNow >= tickLower, "the live tick is below your range");
require(tickNow < tickUpper, "the live tick is at or above your range");
```

This is the heart of concentrated liquidity. Your liquidity is only active while the price is
inside your range. Put it entirely above the current price and the pool takes only one of your two
tokens, because from where the price stands right now the only way into your range is by trading in
one direction. Your position sits there earning nothing until the price moves into it.

Note the asymmetry: at or above `tickLower`, but strictly below `tickUpper`. A range is half open,
so ranges that sit next to each other do not overlap at the join.

Two requires rather than one because the message then tells you which end is wrong. That is worth
doing whenever a rule has two independent halves.

**TODO 3.3, the call**

```solidity
BalanceDelta delta = liquidityRouter.modifyLiquidity(
    poolKey(),
    ModifyLiquidityParams({
        tickLower: tickLower,
        tickUpper: tickUpper,
        liquidityDelta: liquidityDelta,
        salt: bytes32(0)
    }),
    ""
);
```

Both amounts come back negative. That is correct, and it is worth being clear why: the number is
the change in what the pool owes you. Tokens left you and went in, so it is negative.

If you took the live tick, stepped it down to a multiple of 200, and went twenty spacings either
side, you should have seen roughly these, and the two are swapped over if your token B sorted
lower:

```
amount0   -2200431510220132625644        about 2200 tokens
amount1   -37290889336267464876407       about 37291 tokens
```

They are wildly different sizes, and that is the point of concentrated liquidity rather than a
mistake. At a price of 16 the pool wants sixteen times as much of the cheap token by count, and
your range sits asymmetrically around the price in price terms even though it looks symmetric in
tick terms.

---

## Task 4: predict, then swap

**TODO 4.1**

```solidity
expectedAmountOut = amountOutYouExpect;
predictionLocked = true;
emit PredictionLogged(amountOutYouExpect);
```

**TODO 4.2**

```solidity
require(predictionLocked, "record your prediction before you swap");
```

**TODO 4.3, the sign**

```solidity
int256 amountSpecified = -int256(amountIn);
```

In v4 one field covers two different questions. A negative amount means "this is exactly what I am
putting in, tell me what I get". A positive amount means "this is exactly what I want out, take
whatever that costs". You want the first, so the amount is negative. Anything you have read about
earlier versions of the protocol will not help you here.

**TODO 4.4, the price limit**

```solidity
uint160 priceLimit = zeroForOne ? TickMath.MIN_SQRT_PRICE + 1 : TickMath.MAX_SQRT_PRICE - 1;
```

A swap moves the price. Selling `currency0` makes it more plentiful, so its price falls. Selling
`currency1` does the reverse. The limit is a stop, and it has to be on the side the price is
travelling towards, or the swap has already passed it before it starts and does nothing.

The mock swaps `currency1` into `currency0`, so `zeroForOne` is false and the price is heading up,
and the limit belongs at the top. Write the ternary anyway rather than hard coding the top: the
exam may well send you the other way.

The plus one and minus one matter. The extremes themselves are not valid prices, so the limit is
set just inside them, which in practice means "do not stop early".

---

## Checking the numbers

Five whole tokens of `currency1` in, a fee of 10000 which is one percent, and the liquidity amount
from the sheet. **Which answer is yours depends on how your tokens sorted**, and the two are not
close, so check `alphaIsCurrency0` before you reach for a calculator.

**If your token A sorted lower**, `currency0` is TUT and the price is 16, so five CAFE buys about
five sixteenths of a TUT:

- The price alone suggests 0.3125 tokens back.
- The fee takes one percent off the input first, which leaves 0.309375.
- Your own trade moves the price against you while it executes, which costs a little more.
- The real figure is **0.309367343158256833**.

So the fee cost you about 0.0031 of a token and your own price impact cost a further 0.0000077.

**If your token B sorted lower**, `currency0` is CAFE and the price is one sixteenth, so five TUT
buys about eighty CAFE:

- The price alone suggests 80 tokens back.
- After the one percent fee, 79.2.
- The real figure is **79.168649214910895285**.

Here the fee cost you 0.8 of a token and price impact a further 0.031.

Two things are worth noticing. The fee is much the larger of the two effects, because one percent
of your trade is a lot and your trade is tiny next to the pool. And the price impact is small
enough that the price moves less than a single tick, which means **the width of your range did not
change your answer**. Range width decides how many tokens you had to deposit, not what this swap
paid out. It would matter if your range were tight enough for the swap to push the price out of it,
and then it would matter enormously.

That distinction, between the fee and the price impact and what each one depends on, is the sort of
thing the written section rewards.

---

## Tasks 5 and 6

There is no worked answer for these two, because the answers are your own numbers.

For `results.json`, the only skill is care. Copy every digit, keep the minus signs, and leave the
long numbers as text inside quotes. Ten marks for careful copying is ten marks a lot of people drop.

For `ANSWERS.md`, the test is whether your answer could be true of anyone else's paper. If it
could, it is a textbook answer and it is worth nothing. Quote your own tick, your own addresses,
your own error message, your own two amounts. Then check you are inside 120 words.

---

## The mistakes that cost the most marks

1. **Short round numbers where long ones belong.** Copy the digits from your sheet.
2. **The two starting prices the wrong way round in TODO 2.1.** Nothing errors. You find out much
   later, and by then the pool is open and cannot be reopened.
3. **Different fee or tick spacing between Tasks 2, 3 and 4.** Those four fields identify the pool.
   Change one and you point at a pool that was never opened, and nothing works.
4. **Forgetting to send tokens to the Task 3 and Task 4 contracts.** They pay, so they must hold.
5. **Reloading the page.** The sandbox is wiped and every deployment is gone.
6. **Not writing things down as you go.** Task 5 asks for numbers you saw an hour earlier.
