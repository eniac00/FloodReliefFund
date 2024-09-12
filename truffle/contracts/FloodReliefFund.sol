// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

/**
 * Lab Assignment 01 (DApp)
 * Group Number 07
 * Abir Ahammed Bhuiyan (20101197)
 * Mashuk Jannat Mahima (21201007)
 * Md. Mustafizur Rahman (22301385)
 */


contract FloodReliefFund {
    struct Donor {
        string name;
        string mobileNumber;
        bool isRegistered;
    }

    struct Balance {
        uint256 sylhetBalance;
        uint256 ChittagongNorthBalance;
        uint256 ChittagongSouthBalance;
    }

    address private sylhetFund;
    address private chittagongSouthFund;
    address private chittagongNorthFund;

    mapping(address => Donor) private donors;
    mapping(address => uint256) private fundraiserBalance;
    uint256 private totalDonations;

    constructor(address _sylhetFund, address _chittagongSouthFund, address _chittagongNorthFund) {
        sylhetFund = _sylhetFund;
        chittagongSouthFund = _chittagongSouthFund;
        chittagongNorthFund = _chittagongNorthFund;
    }

    modifier NotFundraiserAccount() {
        require(msg.sender != sylhetFund && msg.sender != chittagongSouthFund && msg.sender != chittagongNorthFund, "Fundraiser accounts cannot register as donors");
        _;
    }

    function RegisterDonor(string memory _name, string memory _mobileNumber) public NotFundraiserAccount {
        require(!donors[msg.sender].isRegistered, "Donor already registered");
        require(bytes(_name).length > 0, "Provide a name");
        require(bytes(_mobileNumber).length > 0, "Provide a mobile number");
        donors[msg.sender] = Donor(_name, _mobileNumber, true);
    }

    function Donate(string memory _mobileNumber, string memory _fundraiserZone) public payable {
        require(donors[msg.sender].isRegistered, "Unauthorized donor");
        require(keccak256(abi.encodePacked(donors[msg.sender].mobileNumber)) == keccak256(abi.encodePacked(_mobileNumber)), "Mobile number is not matching");
        require(msg.value > 0, "Donation must be greater than zero");

        address fundraiser;

        if (keccak256(abi.encodePacked(_fundraiserZone)) == keccak256(abi.encodePacked("sylhet"))) fundraiser = sylhetFund;
        else if (keccak256(abi.encodePacked(_fundraiserZone)) == keccak256(abi.encodePacked("chittagong-south"))) fundraiser = chittagongSouthFund;
        else if (keccak256(abi.encodePacked(_fundraiserZone)) == keccak256(abi.encodePacked("chittagong-north"))) fundraiser = chittagongNorthFund;
        else revert("Try to input any of this value: 'sylhet', 'chittagong-south', 'chittagong-north'");

        fundraiserBalance[fundraiser] += msg.value;
        payable(fundraiser).transfer(msg.value);
        totalDonations += msg.value;
    }

    function GetTotalDonations() public view returns (uint256) {
        return totalDonations / 1 ether;
    }

    function GetFundraiserBalance() public view returns (Balance memory) {
        return Balance(
            fundraiserBalance[sylhetFund] / 1 ether, 
            fundraiserBalance[chittagongNorthFund] / 1 ether,
            fundraiserBalance[chittagongSouthFund] / 1 ether 
        );
    }

    function GetRealBalance() public view returns (Balance memory) {
        return Balance(
            sylhetFund.balance / 1 ether,
            chittagongNorthFund.balance / 1 ether,
            chittagongSouthFund.balance / 1 ether
        );
    }

    function CheckDonorInfo(address _donorAddress) public view returns (string memory name, string memory mobileNumber) {
        require(donors[_donorAddress].isRegistered, "Donor not found");
        Donor memory donor = donors[_donorAddress];
        return (donor.name, donor.mobileNumber);
    }
}