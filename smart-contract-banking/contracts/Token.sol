// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 private capacity = 50_000_000_000 * 10 ** uint256(18);
    uint256 private initAmount = 1_000_000 * 10 ** uint256(18);
    address public bank;

    function setAddressBank(address _address) public onlyOwner {
        bank = _address;
    }

    constructor() ERC20("My Token", "MT") {
        _mint(msg.sender, initAmount);
        transferOwnership(msg.sender);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        require(
            totalSupply() + _amount <= capacity,
            "My Token: capacity exceeded"
        );
        _mint(_to, _amount);
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(to == bank, "Not transfer to another address");

        _transfer(msg.sender, to, amount);

        return true;
    }
}
