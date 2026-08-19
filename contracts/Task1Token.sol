// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./ERC20.sol";

// Mock exam solution. Task 1, with TODO 1.1 filled in.

contract ExamToken is ERC20 {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply_)
        ERC20(name_, symbol_, 18)
    {
        _mint(msg.sender, initialSupply_);
    }
}
