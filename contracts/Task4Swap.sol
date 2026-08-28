// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./V4.sol";
import "./ExamBase.sol";

// Mock exam solution. Task 4, with TODO 4.1, 4.2, 4.3 and 4.4 filled in.

contract Task4Swap is ExamBase {
    using BalanceDeltaLibrary for BalanceDelta;

    IPoolSwapTest public immutable swapRouter;

    uint256 public expectedAmountOut;
    bool public predictionLocked;

    event PredictionLogged(uint256 expectedAmountOut);
    event SwapCompleted(bytes32 poolId, bool zeroForOne, uint256 amountIn, int256 amount0, int256 amount1);

    constructor(
        address _poolManager,
        address _swapRouter,
        address _tokenA,
        address _tokenB,
        uint24 _fee,
        int24 _tickSpacing
    ) ExamBase(_poolManager, _tokenA, _tokenB, _fee, _tickSpacing) {
        swapRouter = IPoolSwapTest(_swapRouter);

        IERC20(_tokenA).approve(_swapRouter, type(uint256).max);
        IERC20(_tokenB).approve(_swapRouter, type(uint256).max);
    }

    function recordPrediction(uint256 amountOutYouExpect) external {
        require(!predictionLocked, "you have already recorded a prediction, it cannot be changed");
        require(amountOutYouExpect > 0, "your prediction must be greater than zero");

        // TODO 4.1
        expectedAmountOut = amountOutYouExpect;
        predictionLocked = true;
        emit PredictionLogged(amountOutYouExpect);
    }

    function swapExactIn(bool zeroForOne, uint256 amountIn) external returns (int256 amount0, int256 amount1) {
        require(poolExists(), "the pool is not open, run Task 2 first and check your constructor values match");
        require(amountIn > 0, "amountIn must be greater than zero");

        // TODO 4.2
        require(predictionLocked, "record your prediction before you swap");

        // TODO 4.3
        int256 amountSpecified = -int256(amountIn);

        // TODO 4.4
        uint160 priceLimit = zeroForOne ? TickMath.MIN_SQRT_PRICE + 1 : TickMath.MAX_SQRT_PRICE - 1;

        BalanceDelta delta = swapRouter.swap(
            poolKey(),
            SwapParams({zeroForOne: zeroForOne, amountSpecified: amountSpecified, sqrtPriceLimitX96: priceLimit}),
            IPoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false}),
            ""
        );

        amount0 = delta.amount0();
        amount1 = delta.amount1();
        emit SwapCompleted(poolId(), zeroForOne, amountIn, amount0, amount1);
    }
}
