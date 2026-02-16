// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface AutomationCompatibleInterface {
    function checkUpkeep(
        bytes calldata checkData
    ) external view returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external;
}

contract WeekendLottery is AutomationCompatibleInterface {
    address public owner;
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => mapping(address => bool)) public roundEntries;

    // Automation State
    uint256 public lotteryEndTimestamp;
    bool public lotteryActive;

    event LotteryEntered(address indexed player, uint256 lotteryId);
    event LotteryWinnerPicked(
        address indexed winner,
        uint256 prize,
        uint256 lotteryId
    );
    event LotteryStarted(uint256 endTime, uint256 lotteryId);

    constructor() {
        owner = msg.sender;
        lotteryId = 1;
        // Initially closed until started
        lotteryActive = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyWhileOpen() {
        require(lotteryActive, "Lottery is currently closed");
        require(
            block.timestamp < lotteryEndTimestamp,
            "Lottery time has ended"
        );
        _;
    }

    // 1. Enter Lottery (Free or Paid? User wants Free for now, but contract can handle value)
    function enterLottery() public payable onlyWhileOpen {
        // Enforce 1 ticket per person logic
        require(
            !roundEntries[lotteryId][msg.sender],
            "One ticket per person limit"
        );

        // Optional: Require payment if we want paid lottery later
        // require(msg.value >= ticketPrice, "Insufficient funds");

        players.push(payable(msg.sender));
        roundEntries[lotteryId][msg.sender] = true;

        emit LotteryEntered(msg.sender, lotteryId);
    }

    // 2. Start Weekend (Runs for 72 hours by default, or inputs duration)
    // Can be called by Owner OR Automation (if we add Open logic later)
    function startWeekendLottery(uint256 durationSeconds) public onlyOwner {
        require(!lotteryActive, "Lottery already active");

        // Duration default: 3 days (259200 seconds)
        if (durationSeconds == 0) durationSeconds = 3 days;

        lotteryEndTimestamp = block.timestamp + durationSeconds;
        lotteryActive = true;

        emit LotteryStarted(lotteryEndTimestamp, lotteryId);
    }

    // 3. Chainlink Automation: Check
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        // Trigger if:
        // 1. Lottery IS active
        // 2. Time has passed (now > endTime)
        // 3. There are players (optional, but good to save gas if empty)
        upkeepNeeded = (lotteryActive &&
            block.timestamp >= lotteryEndTimestamp &&
            players.length > 0);
        return (upkeepNeeded, "");
    }

    // 4. Chainlink Automation: Perform (Pick Winner)
    function performUpkeep(bytes calldata /* performData */) external override {
        // Re-validate state
        require(lotteryActive, "Lottery not active");
        require(block.timestamp >= lotteryEndTimestamp, "Time not yet reached");
        require(players.length > 0, "No players to pick from");

        pickWinner();
    }

    // Internal logic to pick winner
    function pickWinner() internal {
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    players.length
                )
            )
        ) % players.length;
        address payable winner = players[randomIndex];
        uint256 prize = address(this).balance;

        // Transfer all funds to winner
        (bool success, ) = winner.call{value: prize}("");
        require(success, "Transfer failed"); // Should we handle failure gracefully? For MVP revert is safer.

        emit LotteryWinnerPicked(winner, prize, lotteryId);

        // Reset State
        delete players;
        lotteryId++;
        lotteryActive = false; // Stays closed until next start
    }

    // Getter for frontend
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getPlayersCount() public view returns (uint256) {
        return players.length;
    }

    function getTimeRemaining() public view returns (uint256) {
        if (block.timestamp >= lotteryEndTimestamp) return 0;
        return lotteryEndTimestamp - block.timestamp;
    }

    function getTotalPrize() public view returns (uint256) {
        return address(this).balance;
    }

    // Allow contract to receive funds (Jackpot seeding)
    receive() external payable {}
}
