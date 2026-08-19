# Mock exam, worked solution

The four contracts in `contracts/` on this branch are filled in. Read this alongside them.

If you have not genuinely tried the mock yet, stop and go and do that first. Reading a solution
feels like learning and mostly is not. The exam asks you to explain your own choices, and you
cannot explain a choice you did not make.

---

## Task 1: mint your tokens

```solidity
_mint(msg.sender, initialSupply_);
```

`msg.sender` is whoever sent the deployment transaction, so the whole supply lands with you.

The trap here is not the code, it is the number. `initialSupply_` is in the token's smallest unit.
With 18 decimals, `1000000000000000000000000` is a million tokens, and `1000000` is a millionth of
one. Type the short number and everything downstream fails, usually at the first `transfer`, with a
message about your balance being too small.

---

## Task 2: open the pool

**TODO 2.1**

```solidity
return alphaIsCurrency0() ? sqrtPriceIfAlphaIsCurrency0 : sqrtPriceIfBetaIsCurrency0;
```

The pool sorts your two tokens by address and calls the lower one `currency0`. You have no say in
it, and you only find out once both tokens are deployed.

Price in this protocol always means "how much `currency1` does one unit of `currency0` buy". So
when your token A wins the sort, the price is the figure from your sheet. When token B wins, the
same market is described by the reciprocal. That is why you were given two numbers, and why one is
not the other with a minus sign: they are reciprocals, not opposites. A price of 4 becomes a price
of one quarter, and after the square root, two becomes one half.

**TODO 2.2**

```solidity
tick = poolManager.initialize(key, startingPrice);
```

The pool manager holds every pool in one contract. `initialize` writes your pool's starting price
and hands back the tick that price sits at.

**TODO 2.3**

```solidity
emit PoolOpened(poolId(), currency0(), currency1(), FEE, TICK_SPACING, startingPrice, tick);
```

Events are the record of what happened. This one is also how the marker confirms you opened the
pool you were supposed to.

---

## Task 3: add liquidity

**TODO 3.1, the ticks have to sit on the grid**

```solidity
require(tickLower % TICK_SPACING == 0, "tickLower is not a multiple of the tick spacing");
require(tickUpper % TICK_SPACING == 0, "tickUpper is not a multiple of the tick spacing");
```

A pool does not track every possible tick. It tracks every `TICK_SPACING`th one. With a spacing of
60, the pool knows about 18900 and 18960 and nothing between them, so liquidity can only start and
stop at those points. Remember your tick may be negative, and the same rule applies.

**TODO 3.2, the range has to contain the live tick**

```solidity
require(liveTick >= tickLower && liveTick < tickUpper, "your range does not contain the live tick");
```

This is the heart of concentrated liquidity. Your liquidity is only active while the price is
inside your range. Put it entirely above the current price and the pool takes only one of your two
tokens, because from where the price stands right now the only way into your range is by trading in
one direction. Your position sits there earning nothing until the price moves into it.

Note the asymmetry: at or above `tickLower`, but strictly below `tickUpper`. A range is half open,
so ranges that sit next to each other do not overlap at the join.

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

---

## Task 4: predict, then swap

**TODO 4.1**

```solidity
predictedAmountOut = expectedAmountOut;
predictionRecorded = true;
emit PredictionRecorded(expectedAmountOut);
```

**TODO 4.2**

```solidity
require(predictionRecorded, "record your prediction before you swap");
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

The plus one and minus one matter. The extremes themselves are not valid prices, so the limit is
set just inside them, which in practice means "do not stop early".

---

## Checking the numbers

For the mock, price 4 with a fee of 3000, which is 0.3 percent, swapping one whole token of
`currency0`:

- The price alone suggests about 4 tokens back.
- The fee takes 0.3 percent off, which leaves about 3.988.
- Your own trade moves the price against you while it executes, which costs a little more.

With a range twenty spacings either side of the live tick, the real answer is 3.987205 tokens. So
the fee cost you about 0.012 of a token and your own price impact cost a further 0.0008.

The exact figure depends on the range you chose. A wider range holds the price steadier and lands
you closer to 3.988. A narrow one costs you more. That relationship, between the range you picked
and the price you got, is the sort of thing the written section rewards.

---

## The mistakes that cost the most marks

1. **Short round numbers where long ones belong.** Copy the digits from your sheet.
2. **Different fee or tick spacing between Tasks 2, 3 and 4.** Those four fields identify the pool.
   Change one and you point at a pool that was never opened, and nothing works.
3. **Forgetting to send tokens to the Task 3 and Task 4 contracts.** They pay, so they must hold.
4. **Reloading the page.** The sandbox is wiped and every deployment is gone.
5. **Not writing things down as you go.** Task 5 asks for numbers you saw an hour earlier.
