// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./V4.sol";
import "./ExamBase.sol";

// Mock exam solution. Task 3, with TODO 3.1, 3.2 and 3.3 filled in.

contract Task3Liquidity is ExamBase {
    using BalanceDeltaLibrary for BalanceDelta;

    IPoolModifyLiquidityTest public immutable liquidityRouter;

    event LiquidityProvided(
        bytes32 poolId, int24 tickLower, int24 tickUpper, int256 liquidityDelta, int256 amount0, int256 amount1
    );

    constructor(
        address _poolManager,
        address _liquidityRouter,
        address _tokenA,
        address _tokenB,
        uint24 _fee,
        int24 _tickSpacing
    ) ExamBase(_poolManager, _tokenA, _tokenB, _fee, _tickSpacing) {
        liquidityRouter = IPoolModifyLiquidityTest(_liquidityRouter);

        IERC20(_tokenA).approve(_liquidityRouter, type(uint256).max);
        IERC20(_tokenB).approve(_liquidityRouter, type(uint256).max);
    }

    function addLiquidity(int24 tickLower, int24 tickUpper, int256 liquidityDelta)
        external
        returns (int256 amount0, int256 amount1)
    {
        require(poolExists(), "the pool is not open, run Task 2 first and check your constructor values match");
        require(liquidityDelta > 0, "liquidity must be greater than zero");
        require(tickLower < tickUpper, "tickLower must be below tickUpper");

        int24 tickNow = currentTick();

        // TODO 3.1
        require(
            tickLower % TICK_SPACING == 0 && tickUpper % TICK_SPACING == 0,
            "a tick is not a multiple of the tick spacing"
        );

        // TODO 3.2
        require(tickNow >= tickLower, "the live tick is below your range");
        require(tickNow < tickUpper, "the live tick is at or above your range");

        // TODO 3.3
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

        amount0 = delta.amount0();
        amount1 = delta.amount1();
        emit LiquidityProvided(poolId(), tickLower, tickUpper, liquidityDelta, amount0, amount1);
    }
}
