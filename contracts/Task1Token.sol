// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./ERC20.sol";

// Mock exam solution. Task 1, with TODO 1.1 filled in.

contract PracticeToken is ERC20 {
    /// @notice Whoever deployed this token, and therefore who holds all of it.
    address public immutable issuer;

    constructor(string memory name_, string memory symbol_, uint256 startingSupply_)
        ERC20(name_, symbol_, 18)
    {
        issuer = msg.sender;

        // TODO 1.1
        _mint(issuer, startingSupply_);
    }
}
