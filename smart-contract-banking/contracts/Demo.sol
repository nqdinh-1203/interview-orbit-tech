// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract Demo {
    int256 testNumber;

    constructor() {
        testNumber = 0;
    }

    function getNumber() public view returns (int256) {
        return testNumber;
    }

    function setNumber(int256 number) public {
        testNumber = number;
    }
}
