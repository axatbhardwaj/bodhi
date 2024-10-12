// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDC is ERC20, Ownable {
    uint256 private _totalSupply = 2000000 * 10 ** 18;

    constructor() ERC20("FUSDC", "FUSD") Ownable(msg.sender) {
        _mint(msg.sender, _totalSupply);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function mint(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }

    function buybackTokens(uint256 amount) external onlyOwner {
        _burn(owner(), amount);
    }
}
