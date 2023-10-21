// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVotingToken {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract VotingContract {
    struct Project {
        string name;
        uint256 voteCount;
        uint256 approvals;
        uint256 rejections;
        Status status;
        uint256 projectId;
    }

    struct ProjectVotes {
        uint256 projectId;
        address voter;
        uint256 vote;
    }

    enum Status { Pending, Approved, Rejected }

    Project[] public projects;
    IVotingToken public token;
    
    address public owner;
    address public admin;
    uint256 public votingDeadline;
    uint256 public judgingDeadline;
    mapping(address => bool) public isJudge;
    mapping(address => uint256) public votesCastByAddress;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => ProjectVotes[]) public projectVotes;

    event Voted(address indexed voter, uint256 indexed projectId, uint256 value);
    event StatusChanged(uint256 indexed projectId, Status newStatus);
    event ProjectAdded(uint256 indexed projectId, string name);

    modifier onlyOwnerOrAdmin() {
        require(isAdminOrOwner(msg.sender), "Only owner or admin can call this function");
        _;
    }

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
        admin = address(0); // No admin initially
    }

    function setAdmin(address _admin) external onlyOwner {
        admin = _admin;
    }

    function removeAdmin() external onlyOwner {
        admin = address(0);
    }

    function addJudge(address judge) external onlyOwnerOrAdmin {
        isJudge[judge] = true;
    }

    function removeJudge(address judge) external onlyOwnerOrAdmin {
        isJudge[judge] = false;
    }

    function startVoting() external onlyOwnerOrAdmin {
        votingDeadline = block.timestamp + 1 weeks;
    }

    function endVoting() external onlyOwnerOrAdmin {
        votingDeadline = block.timestamp;
    }

    function startJudging() external onlyOwnerOrAdmin {
        judgingDeadline = block.timestamp + 1 weeks;
    }

    function endJudging() external onlyOwnerOrAdmin {
        judgingDeadline = block.timestamp;
    }

    function addProject(string memory name) external onlyOwnerOrAdmin {
        uint256 projectId = projects.length;
        projects.push(Project(name, 0, 0, 0, Status.Pending, projectId)); // Add projectId at the end
        emit ProjectAdded(projectId, name);
    }

    function setProjectStatusToPending(uint256 projectId) external onlyOwnerOrAdmin {
        require(projectId < projects.length, "Project does not exist");
        projects[projectId].status = Status.Pending;
        emit StatusChanged(projectId, Status.Pending);
    }

    function vote(uint256 projectId, uint256 value) external {
        require(block.timestamp < votingDeadline, "Voting period has ended");
        require(projectId < projects.length, "Project does not exist");
        require(projects[projectId].status == Status.Pending, "Voting closed for this project");
        
        require(token.transferFrom(msg.sender, address(this), value), "Token transfer failed");

        projects[projectId].voteCount += value;
        votesCastByAddress[msg.sender] += value;

        // Record the vote for this project
        projectVotes[projectId].push(ProjectVotes(projectId, msg.sender, value));

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

    function withdrawTokens(address to) external onlyOwnerOrAdmin {
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "No tokens to withdraw");

        require(token.transferFrom(address(this), to, amount), "Token transfer failed");
    }

    function getProjectsCount() external view returns (uint256) {
        return projects.length;
    }

    function getVotesAndUsers(uint256 projectId) external view returns (address[] memory, uint256[] memory) {
        require(projectId < projects.length, "Project does not exist");
        
        uint256 numVotes = projectVotes[projectId].length;
        address[] memory voters = new address[](numVotes);
        uint256[] memory votes = new uint256[](numVotes);
        
        for (uint256 i = 0; i < numVotes; i++) {
            voters[i] = projectVotes[projectId][i].voter;
            votes[i] = projectVotes[projectId][i].vote;
        }

        return (voters, votes);
    }

    function isAdminOrOwner(address account) internal view returns (bool) {
        return account == owner || account == admin;
    }
}
