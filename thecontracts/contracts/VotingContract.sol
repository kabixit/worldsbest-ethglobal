// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVotingToken {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool); // Added approve function
    function balanceOf(address account) external view returns (uint256);
}

contract VotingSystem {
    struct Project {
        string name;
        uint256 voteCount;
        uint256 approvals;
        uint256 rejections;
        Status status;
    }

    enum Status { Pending, Approved, Rejected }

    Project[] public projects;
    IVotingToken public token;
    
    address public owner;
    uint256 public votingDeadline;
    uint256 public judgingDeadline;
    mapping(address => bool) public isJudge;
    mapping(address => uint256) public votesCastByAddress;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // projectId to judge's vote

    event Voted(address indexed voter, uint256 indexed projectId, uint256 value);
    event StatusChanged(uint256 indexed projectId, Status newStatus);
    event ProjectAdded(uint256 indexed projectId, string name);

    modifier onlyJudge() {
        require(isJudge[msg.sender], "Only judges can call this function");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _tokenAddress) {
        token = IVotingToken(_tokenAddress);
        owner = msg.sender;
    }

    function addJudge(address judge) external onlyOwner {
        isJudge[judge] = true;
    }

    function removeJudge(address judge) external onlyOwner {
        isJudge[judge] = false;
    }

    function startVoting() external onlyOwner {
        votingDeadline = block.timestamp + 1 weeks;
    }

    function endVoting() external onlyOwner {
        votingDeadline = block.timestamp;
    }

    function startJudging() external onlyOwner {
        judgingDeadline = block.timestamp + 1 weeks;
    }

    function endJudging() external onlyOwner {
        judgingDeadline = block.timestamp;
    }

    function addProject(string memory name) external onlyOwner {
        uint256 projectId = projects.length;
        projects.push(Project(name, 0, 0, 0, Status.Pending));
        emit ProjectAdded(projectId, name);
    }

    function vote(uint256 projectId, uint256 value) external {
        require(block.timestamp < votingDeadline, "Voting period has ended");
        require(projectId < projects.length, "Project does not exist");
        require(projects[projectId].status == Status.Pending, "Voting closed for this project");
        
        // Approve the transfer of tokens before performing the transfer
        require(token.approve(address(this), value), "Token approval failed");
        require(token.transferFrom(msg.sender, address(this), value), "Token transfer failed");

        projects[projectId].voteCount += value;
        votesCastByAddress[msg.sender] += value;

        emit Voted(msg.sender, projectId, value);
    }

    function approveProject(uint256 projectId) external onlyJudge {
        require(block.timestamp < judgingDeadline, "Judging period has ended");
        require(projectId < projects.length, "Project does not exist");
        require(projects[projectId].status == Status.Pending, "Project status is not pending");
        require(!hasVoted[projectId][msg.sender], "Judge has already voted on this project");
        
        projects[projectId].approvals += 1;
        hasVoted[projectId][msg.sender] = true;

        // Checking if approvals outnumber rejections
        if (projects[projectId].approvals > projects[projectId].rejections) {
            projects[projectId].status = Status.Approved;
            emit StatusChanged(projectId, Status.Approved);
        }
    }

    function rejectProject(uint256 projectId) external onlyJudge {
        require(block.timestamp < judgingDeadline, "Judging period has ended");
        require(projectId < projects.length, "Project does not exist");
        require(projects[projectId].status == Status.Pending, "Project status is not pending");
        require(!hasVoted[projectId][msg.sender], "Judge has already voted on this project");
        
        projects[projectId].rejections += 1;
        hasVoted[projectId][msg.sender] = true;

        // Checking if rejections outnumber approvals
        if (projects[projectId].rejections > projects[projectId].approvals) {
            projects[projectId].status = Status.Rejected;
            emit StatusChanged(projectId, Status.Rejected);
        }
    }

    function withdrawTokens(address to) external onlyOwner {
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "No tokens to withdraw");

        require(token.approve(to, amount), "Token approval failed");
        require(token.transferFrom(address(this), to, amount), "Token transfer failed");
    }

    function getProjectsCount() external view returns (uint256) {
        return projects.length;
    }
}
