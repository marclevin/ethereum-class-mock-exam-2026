// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./V4.sol";
import "./ExamBase.sol";

// Mock exam solution. Task 2, with TODO 2.1, 2.2 and 2.3 filled in.

contract Task2Pool is ExamBase {
    uint160 public immutable sqrtPriceIfTokenALower;
    uint160 public immutable sqrtPriceIfTokenBLower;

    event PoolReady(bytes32 poolId, address currency0, address currency1, uint160 sqrtPriceX96, int24 tick);

    constructor(
        address _poolManager,
        address _tokenA,
        address _tokenB,
        uint24 _fee,
        int24 _tickSpacing,
        uint160 _sqrtPriceIfTokenALower,
        uint160 _sqrtPriceIfTokenBLower
    ) ExamBase(_poolManager, _tokenA, _tokenB, _fee, _tickSpacing) {
        sqrtPriceIfTokenALower = _sqrtPriceIfTokenALower;
        sqrtPriceIfTokenBLower = _sqrtPriceIfTokenBLower;
    }

    function startingSqrtPriceX96() public view returns (uint160) {
        // TODO 2.1
        return alphaIsCurrency0() ? sqrtPriceIfTokenALower : sqrtPriceIfTokenBLower;
    }

    function openPool() external returns (int24 tick) {
        require(!poolExists(), "this pool is already open, you only open it once");

        PoolKey memory key = poolKey();
        uint160 startingPrice = startingSqrtPriceX96();
        require(startingPrice != 0, "startingSqrtPriceX96 still returns zero, finish TODO 2.1 first");

        // TODO 2.2
        tick = poolManager.initialize(key, startingPrice);

        // TODO 2.3
        emit PoolReady(poolId(), currency0(), currency1(), startingPrice, tick);
    }
}
