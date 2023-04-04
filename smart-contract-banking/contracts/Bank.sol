// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable {
    IERC20 private token;

    struct Recap {
        address from;
        address to;
        uint256 amount;
        uint256 time;
    }

    Recap[] public history;
    uint256 fee = 5; // 5%

    function getTokenAddress() public view returns (address) {
        return address(token);
    }

    function setToken(IERC20 _token) public onlyOwner {
        token = _token;
    }

    constructor() {}

    function send(address _to, uint256 _amount) external {
        require(
            token.balanceOf(msg.sender) >= _amount + ((_amount * fee) / 100),
            "Insufficient account balance"
        );
        token.transferFrom(msg.sender, _to, _amount);
        token.transferFrom(msg.sender, owner(), (_amount * fee) / 100);

        history.push(Recap(msg.sender, _to, _amount, block.timestamp));
    }

    function getHistoryList() public view returns (Recap[] memory) {
        return history;
    }
}
