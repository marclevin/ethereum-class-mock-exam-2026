// Optional. Checks your work so far and points at anything obviously wrong.
//
// It checks the shape of your contracts and the rules they should be enforcing.
// It does not tell you what to put in results.json, and passing every line is a
// good sign rather than a promise of full marks.
//
// The exam has a script like this one. That one cannot check your numbers,
// because everybody has different ones. This one can, because the mock numbers
// are fixed, so it goes a little further than the exam version will.
//
// How to run it:
//   1. Fill in the three addresses below. Leave one as "" if you have not got
//      that far yet, and that part is skipped.
//   2. Right click this file in the file explorer and choose "Run".
//
// This script only reads. It will not change anything you have deployed.

// ---------------------------------------------------------------------------
const TASK2_ADDRESS = "";
const TASK3_ADDRESS = "";
const TASK4_ADDRESS = "";
// ---------------------------------------------------------------------------

// The mock parameters, from README.md. Do not change these.
const MOCK_FEE = 10000;
const MOCK_TICK_SPACING = 200;
const MOCK_SUPPLY = "2000000000000000000000000";
const MOCK_LIQUIDITY = "50000000000000000000000";
const MOCK_AMOUNT_IN = "5000000000000000000";
const PRICE_IF_TOKEN_A_LOWER = "316912650057057350374175801344";
const PRICE_IF_TOKEN_B_LOWER = "19807040628566084398385987584";
const TICK_IF_TOKEN_A_LOWER = 27727;
const TICK_IF_TOKEN_B_LOWER = -27728;

const BASE_ABI = [
  "function FEE() view returns (uint24)",
  "function TICK_SPACING() view returns (int24)",
  "function tokenA() view returns (address)",
  "function tokenB() view returns (address)",
  "function currency0() view returns (address)",
  "function currency1() view returns (address)",
  "function alphaIsCurrency0() view returns (bool)",
  "function poolId() view returns (bytes32)",
  "function poolExists() view returns (bool)",
  "function currentTick() view returns (int24)",
  "function currentSlot0() view returns (uint160,int24)",
];

const TASK2_ABI = BASE_ABI.concat([
  "function startingSqrtPriceX96() view returns (uint160)",
  "function sqrtPriceIfTokenALower() view returns (uint160)",
  "function sqrtPriceIfTokenBLower() view returns (uint160)",
]);
const TASK3_ABI = BASE_ABI.concat(["function addLiquidity(int24,int24,int256) returns (int256,int256)"]);
const TASK4_ABI = BASE_ABI.concat([
  "function predictionLocked() view returns (bool)",
  "function expectedAmountOut() view returns (uint256)",
  "function swapExactIn(bool,uint256) returns (int256,int256)",
]);
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function symbol() view returns (string)",
];

let passes = 0;
let failures = 0;

function ok(label) {
  passes++;
  console.log(`  pass  ${label}`);
}

function bad(label, why) {
  failures++;
  console.log(`  FAIL  ${label}`);
  if (why) console.log(`        ${why}`);
}

async function check(label, fn) {
  try {
    const problem = await fn();
    if (problem) bad(label, problem);
    else ok(label);
  } catch (error) {
    bad(label, (error && (error.reason || error.message)) || String(error));
  }
}

/// Expects the call to be rejected. Passing means your validation is working.
async function expectRejected(label, call) {
  try {
    await call();
    bad(label, "the call went through when it should have been rejected");
  } catch (error) {
    ok(label);
  }
}

(async () => {
  if (!TASK2_ADDRESS) {
    console.error("Fill in at least TASK2_ADDRESS at the top of this file first.");
    return;
  }

  const provider = new ethers.providers.Web3Provider(web3Provider);
  const signer = provider.getSigner();

  const task2 = new ethers.Contract(TASK2_ADDRESS, TASK2_ABI, signer);
  let sharedPoolId;
  let tokenALower;

  console.log("");
  console.log("Task 1");

  await check("both tokens minted the whole starting supply", async () => {
    const a = new ethers.Contract(await task2.tokenA(), ERC20_ABI, signer);
    const b = new ethers.Contract(await task2.tokenB(), ERC20_ABI, signer);
    const supplyA = await a.totalSupply();
    const supplyB = await b.totalSupply();
    if (supplyA.isZero() || supplyB.isZero()) return "a total supply is zero, so TODO 1.1 is not finished";
    if (!supplyA.eq(MOCK_SUPPLY) || !supplyB.eq(MOCK_SUPPLY)) {
      return `supplies are ${supplyA.toString()} and ${supplyB.toString()}, the mock asks for ${MOCK_SUPPLY} each. A short round number here is the classic mistake.`;
    }
  });

  console.log("");
  console.log("Task 2");

  await check("fee and tick spacing match the mock parameters", async () => {
    const fee = Number(await task2.FEE());
    const spacing = Number(await task2.TICK_SPACING());
    if (fee !== MOCK_FEE) return `deployed with fee ${fee}, the mock uses ${MOCK_FEE}`;
    if (spacing !== MOCK_TICK_SPACING) return `deployed with spacing ${spacing}, the mock uses ${MOCK_TICK_SPACING}`;
  });

  await check("the two currencies are in protocol order", async () => {
    const c0 = (await task2.currency0()).toLowerCase();
    const c1 = (await task2.currency1()).toLowerCase();
    if (c0 >= c1) return "currency0 must sort below currency1";
  });

  await check("both starting prices were typed in correctly", async () => {
    const alpha = await task2.sqrtPriceIfTokenALower();
    const beta = await task2.sqrtPriceIfTokenBLower();
    if (!alpha.eq(PRICE_IF_TOKEN_A_LOWER)) return `sqrtPriceIfTokenALower is ${alpha.toString()}, expected ${PRICE_IF_TOKEN_A_LOWER}`;
    if (!beta.eq(PRICE_IF_TOKEN_B_LOWER)) return `sqrtPriceIfTokenBLower is ${beta.toString()}, expected ${PRICE_IF_TOKEN_B_LOWER}`;
  });

  await check("startingSqrtPriceX96 picked the right one of the two", async () => {
    tokenALower = await task2.alphaIsCurrency0();
    const value = await task2.startingSqrtPriceX96();
    if (value.isZero()) return "it is still returning zero, so TODO 2.1 is not finished";
    const wanted = tokenALower ? PRICE_IF_TOKEN_A_LOWER : PRICE_IF_TOKEN_B_LOWER;
    if (!value.eq(wanted)) {
      return `your token A ${tokenALower ? "is" : "is not"} the lower address, so it should return ${wanted}, and it returned ${value.toString()}. TODO 2.1 has the two the wrong way round.`;
    }
  });

  await check("the pool has been opened", async () => {
    sharedPoolId = await task2.poolId();
    if (!(await task2.poolExists())) return "openPool has not run yet, or it did not do anything";
  });

  await check("the pool opened at the tick the price implies", async () => {
    if (!(await task2.poolExists())) return "the pool is not open yet";
    const tick = Number(await task2.currentTick());
    const wanted = tokenALower ? TICK_IF_TOKEN_A_LOWER : TICK_IF_TOKEN_B_LOWER;
    if (Math.abs(tick - wanted) > 2) return `the live tick is ${tick}, expected about ${wanted} for this starting price`;
  });

  // --- Task 3 --------------------------------------------------------------

  if (TASK3_ADDRESS) {
    console.log("");
    console.log("Task 3");
    const task3 = new ethers.Contract(TASK3_ADDRESS, TASK3_ABI, signer);

    await check("it points at the same pool as Task 2", async () => {
      const id = await task3.poolId();
      if (id !== sharedPoolId) {
        return "different pool id to Task 2, so a constructor value does not match. Check the fee, the tick spacing and both token addresses.";
      }
    });

    await check("it is holding both of your tokens", async () => {
      const a = new ethers.Contract(await task3.tokenA(), ERC20_ABI, signer);
      const b = new ethers.Contract(await task3.tokenB(), ERC20_ABI, signer);
      const balanceA = await a.balanceOf(TASK3_ADDRESS);
      const balanceB = await b.balanceOf(TASK3_ADDRESS);
      if (balanceA.isZero() || balanceB.isZero()) {
        return "one of the balances is zero, so transfer your tokens to this contract first";
      }
    });

    if (await task3.poolExists()) {
      const live = Number(await task3.currentTick());
      const base = Math.floor(live / MOCK_TICK_SPACING) * MOCK_TICK_SPACING;
      const lower = base - 20 * MOCK_TICK_SPACING;
      const upper = base + 20 * MOCK_TICK_SPACING;
      const width = upper - lower;

      await expectRejected("a tick off the grid is rejected", () =>
        task3.callStatic.addLiquidity(lower + 1, upper, MOCK_LIQUIDITY),
      );
      await expectRejected("a range the wrong way round is rejected", () =>
        task3.callStatic.addLiquidity(upper, lower, MOCK_LIQUIDITY),
      );
      await expectRejected("a range entirely above the live tick is rejected", () =>
        task3.callStatic.addLiquidity(upper, upper + width, MOCK_LIQUIDITY),
      );
      await expectRejected("a range entirely below the live tick is rejected", () =>
        task3.callStatic.addLiquidity(lower - width, lower, MOCK_LIQUIDITY),
      );
    }
  }

  // --- Task 4 --------------------------------------------------------------

  if (TASK4_ADDRESS) {
    console.log("");
    console.log("Task 4");
    const task4 = new ethers.Contract(TASK4_ADDRESS, TASK4_ABI, signer);

    await check("it points at the same pool as Task 2", async () => {
      const id = await task4.poolId();
      if (id !== sharedPoolId) {
        return "different pool id to Task 2, so a constructor value does not match. Check the fee, the tick spacing and both token addresses.";
      }
    });

    await check("it is holding both of your tokens", async () => {
      const a = new ethers.Contract(await task4.tokenA(), ERC20_ABI, signer);
      const b = new ethers.Contract(await task4.tokenB(), ERC20_ABI, signer);
      const balanceA = await a.balanceOf(TASK4_ADDRESS);
      const balanceB = await b.balanceOf(TASK4_ADDRESS);
      if (balanceA.isZero() || balanceB.isZero()) {
        return "one of the balances is zero, so transfer your tokens to this contract first";
      }
    });

    if (await task4.predictionLocked()) {
      console.log("  skip  swapping before a prediction, you have already recorded one");
      await check("your prediction was stored", async () => {
        const stored = await task4.expectedAmountOut();
        if (stored.isZero()) return "predictionLocked is true but expectedAmountOut is zero, so TODO 4.1 only did half the job";
      });
    } else {
      await expectRejected("swapping before a prediction is rejected", () =>
        task4.callStatic.swapExactIn(false, MOCK_AMOUNT_IN),
      );
    }
  }

  console.log("");
  console.log(`${passes} passed, ${failures} failed`);
  if (failures === 0) {
    console.log("Shape, rules and numbers all look right. results.json and the written section are still yours.");
  }
})();
