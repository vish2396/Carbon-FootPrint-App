// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonFootprintCalculator {
    address public owner;
    mapping(address => uint) public carbonFootprints;
    mapping(address => uint) public donations; // New mapping for tracking donations

    event CalculationResult(address indexed user, uint carbonFootprint);
    event DonationReceived(address indexed donor, uint amount); // New event for donation

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function calculateCarbonFootprint(uint distance, uint fuelEfficiency) external {
        uint carbonFootprint = (distance * fuelEfficiency) / 100;
        carbonFootprints[msg.sender] = carbonFootprint;

        emit CalculationResult(msg.sender, carbonFootprint);
    }

    function getCarbonFootprint() external view returns (uint) {
        return carbonFootprints[msg.sender];
    }

    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than zero");
        donations[msg.sender] += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    function getDonation() external view returns (uint) {
        return donations[msg.sender];
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
