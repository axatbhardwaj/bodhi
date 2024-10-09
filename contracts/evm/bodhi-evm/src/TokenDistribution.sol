// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//importing interface of ERC20

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

error Unauthorized();
error insufficientFunds(address _beneficiary);

contract TokenDistribuition is OwnableUpgradeable, UUPSUpgradeable {
    event tokensBought(address indexed _beneficiary, uint256 _amount);

    //constant variables USDC token address on base chain
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public immutable bodhiToken;

    constructor(address _bodhiToken) {
        bodhiToken = _bodhiToken;
        _disableInitializers(); // Disable initializers to prevent direct calls
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function buyTokens(address _beneficiary, uint256 amount) public {
        //check balance of USDC
        if (IERC20(USDC).balanceOf(msg.sender) < amount) {
            revert insufficientFunds(_beneficiary);
        }
        //buy tokens
        IERC20(USDC).transferFrom(msg.sender, address(this), amount);
        IERC20(bodhiToken).transfer(_beneficiary, amount);

        emit tokensBought(_beneficiary, amount);
    }
}
