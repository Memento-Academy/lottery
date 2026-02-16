// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {WeekendLottery} from "../src/WeekendLottery.sol";

contract DeployWeekendLottery is Script {
    function setUp() public {}

    function run() public returns (WeekendLottery) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        WeekendLottery lottery = new WeekendLottery();
        console.log("WeekendLottery deployed at:", address(lottery));

        vm.stopBroadcast();
        return lottery;
    }
}
